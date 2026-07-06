import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SITE_NAME } from "@/lib/site-config";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Personal SEO research dashboard for your website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased bg-[#F5F5F7] text-[#111]">
        {children}
      </body>
    </html>
  );
}
