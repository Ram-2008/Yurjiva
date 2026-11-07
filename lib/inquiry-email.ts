import type { Inquiry } from "./inquiry";

type MailSettings = { RESEND_API_KEY?: string; CONTACT_FROM?: string };

export const inquiryRecipient = "yurjiva@gmail.com";

export async function sendInquiryEmail(
  data: Inquiry,
  settings: MailSettings,
  id: string,
) {
  if (!settings.RESEND_API_KEY || !settings.CONTACT_FROM) return "unconfigured";
  const text = [
    "New YURJIVA project inquiry",
    "",
    "Name: " + data.name,
    "Email: " + data.email,
    "Company: " + (data.company || "Not provided"),
    "Service: " + data.service,
    "Budget: " + (data.budget || "Not provided"),
    "",
    "Project description:",
    data.description,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + settings.RESEND_API_KEY,
      "Content-Type": "application/json",
      "Idempotency-Key": id,
    },
    body: JSON.stringify({
      from: settings.CONTACT_FROM,
      to: [inquiryRecipient],
      reply_to: data.email,
      subject: "New YURJIVA project inquiry",
      text,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok || !((await response.json()) as { id?: string }).id)
    throw new Error("Email provider did not confirm acceptance.");
  return "accepted";
}
