import { parseInquiry } from "@/lib/inquiry";
import { sendInquiryEmail } from "@/lib/inquiry-email";
export async function POST(request: Request) {
  let data;
  try {
    data = await parseInquiry(request);
  } catch {
    return Response.json(
      { error: "Please check the form fields." },
      { status: 400 },
    );
  }
  try {
    const status = await sendInquiryEmail(
      data,
      {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        CONTACT_FROM: process.env.CONTACT_FROM,
      },
      crypto.randomUUID(),
    );
    if (status === "unconfigured")
      return Response.json(
        { error: "The project inbox is not configured yet." },
        { status: 503 },
      );
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Unable to submit your inquiry. Please try again." },
      { status: 502 },
    );
  }
}
