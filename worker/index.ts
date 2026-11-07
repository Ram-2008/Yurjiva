import handler from "vinext/server/fetch-handler";
import { parseInquiry } from "../lib/inquiry";
import { sendInquiryEmail } from "../lib/inquiry-email";
export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    if (new URL(request.url).pathname != "/api/contact")
      return handler.fetch(request, env, ctx);
    if (request.method !== "POST") return new Response(null, { status: 405 });
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
      const sender = Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(
              request.headers.get("cf-connecting-ip") || "local",
            ),
          ),
        ),
      )
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
      const now = Date.now();
      const id = crypto.randomUUID();
      const result = await env
        .DB!.prepare(
          "INSERT INTO inquiries (id,sender,created,payload) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM inquiries WHERE sender=? AND created>?) < 4",
        )
        .bind(id, sender, now, JSON.stringify(data), sender, now - 3600000)
        .run();
      if (!result.success) throw new Error("Database insert failed");
      if (result.meta.changes !== 1)
        return Response.json(
          { error: "Too many inquiries. Please try again later." },
          { status: 429 },
        );
      // The database receipt remains valid even when the mail provider is unavailable.
      let notification: string;
      try {
        notification = await sendInquiryEmail(data, env, id);
      } catch {
        notification = "failed";
      }
      if (notification !== "accepted")
        console.warn("Inquiry notification", id, notification);
      return Response.json({ ok: true, notification });
    } catch {
      return Response.json(
        { error: "Unable to save your inquiry. Please try again later." },
        { status: 503 },
      );
    }
  },
};
