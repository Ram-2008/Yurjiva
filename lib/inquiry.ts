import { z } from "zod";
import { services } from "./studio";
export const inquiry = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(150),
  service: z
    .string()
    .refine((value) => services.some(([name]) => name === value)),
  budget: z.enum([
    "",
    "Under ₹50,000",
    "₹50,000–₹2 lakh",
    "₹2 lakh+",
    "To be discussed",
  ]),
  description: z.string().trim().min(15).max(5000),
  website: z.literal(""),
});
export type Inquiry = z.infer<typeof inquiry>;
export async function parseInquiry(request: Request) {
  if (
    request.headers.get("origin") !== new URL(request.url).origin ||
    !request.headers.get("content-type")?.includes("application/json")
  )
    throw new Error("Invalid request");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Body required");
  const decoder = new TextDecoder();
  let size = 0,
    body = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 24000) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    body += decoder.decode(value, { stream: true });
  }
  return inquiry.parse(JSON.parse(body + decoder.decode()));
}
