import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createContactSubmission } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendContactFormEmail } from "./email";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          visitorEmail: z.string().email("Invalid email address"),
          visitorMessage: z.string().min(1, "Message cannot be empty").max(5000, "Message is too long"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const outcomes = await Promise.allSettled([
            // Save to database (optional in local/dev)
            createContactSubmission(input.visitorEmail, input.visitorMessage),
            // Send email to portfolio owner (requires env in prod)
            sendContactFormEmail(input.visitorEmail, input.visitorMessage),
            // Send owner notification (requires env in prod)
            notifyOwner({
              title: "New Portfolio Contact Submission",
              content: `New message from ${input.visitorEmail}:\n\n${input.visitorMessage}`,
            }),
          ]);

          const anySuccess = outcomes.some(o => o.status === "fulfilled");
          if (!anySuccess) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to process your message. Please try again later.",
            });
          }

          return { success: true, message: "Message received. Thank you!" };
        } catch (error) {
          console.error("Contact submission error:", error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process your message. Please try again later.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
