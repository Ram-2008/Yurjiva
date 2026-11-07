import type { Metadata } from "next";
import "./globals.css";
const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://yurjiva-digital-core.chinnitechinfo18.chatgpt.site";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: "YURJIVA — Innovating Beyond Tomorrow.",
  description:
    "YURJIVA designs and engineers intelligent digital products, AI agents, SaaS platforms, and custom software.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "YURJIVA — Innovating Beyond Tomorrow.",
    description: "Technology that gives life to new possibilities.",
    images: [{url:"/brand/share.jpg",width:1200,height:630,alt:"YURJIVA — Innovating Beyond Tomorrow."}],
  },
  icons: { icon: "/brand/orbit-y.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "YURJIVA",
              url: origin,
              logo: new URL("/brand/yurjiva.webp", origin).href,
              slogan: "Innovating Beyond Tomorrow.",
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
