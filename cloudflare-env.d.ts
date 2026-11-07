declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    CONTACT_FROM?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
