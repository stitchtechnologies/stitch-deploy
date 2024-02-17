import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";
import { inter, roboto_mono } from "./fonts";

export const metadata: Metadata = {
  title: "Stitch",
  description: "Stitch Deployment Platform",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon-dark.svg',
        href: '/favicon-dark.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-light.svg',
        href: '/favicon-light.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        roboto_mono.variable,
      )}>
        {children}
      </body>
    </html>
  );
}
