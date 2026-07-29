import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { SiteShell } from "@/app/components/site-shell";
import { heroPaddingTop, heroSubpagePaddingTop } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

const exposure = localFont({
  src: [
    {
      path: "./fonts/exposure-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/exposure-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-exposure-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jeremy — Backend Engineer",
  description:
    "Backend engineer building APIs and services with TypeScript, Python, and Go. Based in Ecuador.",
  openGraph: {
    title: "Jeremy — Backend Engineer",
    description:
      "APIs, event-driven backends, and cloud tooling. orderly, entries, signal, Wallbit Workflows.",
    type: "website",
    url: "https://jeremyportfolio.vercel.app",
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
      className={`${inter.variable} ${exposure.variable} h-full`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `*,*::before,*::after{box-sizing:border-box}html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-size:16px;background:#000}body{margin:0;background:#000;color:#fff;font-size:.8125rem;line-height:1.25}h1,h2,h3,h4,h5,h6,p{margin:0}.site-navbar{position:sticky;top:0;z-index:50;width:100%;padding-top:2rem;padding-bottom:1rem}.page-column-hero{padding-top:${heroPaddingTop}}.page-column-hero--subpage{padding-top:${heroSubpagePaddingTop}}`,
          }}
        />
      </head>
      <body className="min-h-full bg-background font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
