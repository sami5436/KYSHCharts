import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const TAGLINE = "the chart doesnt care what you think";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "KYSH / charts",
  description: TAGLINE,
  applicationName: "KYSH",
  openGraph: {
    title: "KYSH / charts",
    description: TAGLINE,
    siteName: "KYSH",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYSH / charts",
    description: TAGLINE,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-fg flex flex-col">{children}</body>
    </html>
  );
}
