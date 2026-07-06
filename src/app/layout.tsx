import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEO Autopilot — AI-Powered SEO Content & Free Website Audit",
  description:
    "Automatically research keywords, write SEO-optimized articles, and grow organic traffic. Get a free SEO audit of your website in 3 minutes.",
  keywords: [
    "AI SEO",
    "SEO content generation",
    "automated blogging",
    "keyword research",
    "AI writing tool",
    "content automation",
    "SEO optimization",
    "blog automation",
    "Google ranking",
    "free SEO audit",
  ],
  robots: "index, follow",
  openGraph: {
    title: "SEO Autopilot — AI-Powered SEO Content Generation",
    description:
      "Automatically research keywords, write SEO-optimized articles, and grow organic traffic on autopilot.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Autopilot — AI-Powered SEO",
    description:
      "Get a free SEO audit and discover keyword opportunities for your website.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "SEO Autopilot",
      url: "https://seo-autopilot.dev",
    },
    {
      "@type": "SoftwareApplication",
      name: "SEO Autopilot",
      applicationCategory: "BusinessApplication",
      description:
        "AI-powered SEO platform that researches keywords, writes content, and helps websites rank on Google.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free SEO audit",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does SEO Autopilot do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SEO Autopilot is an AI-powered platform that automatically researches keywords, writes SEO-optimized articles, and helps you grow organic traffic.",
          },
        },
        {
          "@type": "Question",
          name: "How does the free SEO audit work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Enter your website URL and we analyze your content, brand voice, keyword opportunities, and technical SEO — then provide a personalized report.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-[#111]">
        {children}
      </body>
    </html>
  );
}
