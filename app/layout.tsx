import type { Metadata, Viewport } from "next";
import { Noto_Sans, Outfit } from "next/font/google";
import "./globals.css";

const ui = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
});

const text = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-noto",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Darbar",
  description: "A royal court of qawwali. Press play.",
  openGraph: {
    title: "Darbar",
    description: "A royal court of qawwali. Press play.",
    images: ["/bg.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a140c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ui.variable} ${text.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-black font-sans text-white">
        {children}
      </body>
    </html>
  );
}
