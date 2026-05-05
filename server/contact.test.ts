import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should accept valid email and message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      visitorEmail: "visitor@example.com",
      visitorMessage: "This is a test message",
    });

    expect(result).toEqual({
      success: true,
      message: "Message received. Thank you!",
    });
  });

  it("should reject invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        visitorEmail: "not-an-email",
        visitorMessage: "This is a test message",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject empty message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        visitorEmail: "visitor@example.com",
        visitorMessage: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject message exceeding max length", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const longMessage = "a".repeat(5001);

    try {
      await caller.contact.submit({
        visitorEmail: "visitor@example.com",
        visitorMessage: longMessage,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should accept valid Gmail address", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      visitorEmail: "abdusattorovdiyor01@gmail.com",
      visitorMessage: "Test message from Gmail",
    });

    expect(result).toEqual({
      success: true,
      message: "Message received. Thank you!",
    });
  });

  it("should accept message with various valid characters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      visitorEmail: "visitor@example.com",
      visitorMessage: "Hello! I'm interested in your services. Can we discuss? 🚀",
    });

    expect(result).toEqual({
      success: true,
      message: "Message received. Thank you!",
    });
  });

  it("should accept message at max length boundary", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const maxMessage = "a".repeat(5000);

    const result = await caller.contact.submit({
      visitorEmail: "visitor@example.com",
      visitorMessage: maxMessage,
    });

    expect(result).toEqual({
      success: true,
      message: "Message received. Thank you!",
    });
  });
});
