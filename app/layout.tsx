import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteShell } from "@/app/components/site/shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

const exposure = localFont({
  src: "./fonts/exposure-regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-exposure-var",
  display: "swap",
});

const exposureItalic = localFont({
  src: "./fonts/exposure-italic.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-exposure-italic-var",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://0xjeremy.vercel.app"),
  title: "Jeremy - Backend Engineer",
  description:
    "Backend engineer building APIs and services with TypeScript, Python, and Go. Based in Ecuador.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.ico", sizes: "any" },
    ],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    title: "Jeremy - Backend Engineer",
    description:
      "Backend engineer building APIs and services with TypeScript, Python, and Go. Based in Ecuador.",
    type: "website",
    url: "https://0xjeremy.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeremy - Backend Engineer",
    description:
      "Backend engineer building APIs and services with TypeScript, Python, and Go. Based in Ecuador.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${exposure.variable} ${exposureItalic.variable} h-full`}
    >
      <body
        className="min-h-full bg-background font-sans"
        style={{
          margin: 0,
          background: "#000",
          color: "#fff",
          fontSize: "0.8125rem",
          lineHeight: 1.25,
        }}
      >
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
