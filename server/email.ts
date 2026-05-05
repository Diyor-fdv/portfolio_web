import { ENV } from "./_core/env";

/**
 * Send email to a recipient using the Manus built-in email service
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.error("Email service not configured");
      return { success: false, error: "Email service not configured" };
    }

    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ""),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Email send failed:", errorData);
      return {
        success: false,
        error: `Email service error: ${response.statusText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send contact form submission email to the portfolio owner
 */
export async function sendContactFormEmail(
  visitorEmail: string,
  visitorMessage: string
): Promise<{ success: boolean; error?: string }> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 10px;">
        New Portfolio Contact Submission
      </h2>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #00d4ff; border-radius: 4px;">
        <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${escapeHtml(visitorEmail)}</p>
        <p style="margin: 0;"><strong>Message:</strong></p>
        <p style="margin: 10px 0 0 0; white-space: pre-wrap; word-wrap: break-word;">
          ${escapeHtml(visitorMessage)}
        </p>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
        <p>This is an automated message from your portfolio website contact form.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: "abdusattorovdiyor01@gmail.com",
    subject: `New Contact Form Submission from ${visitorEmail}`,
    html: htmlContent,
  });
}

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
