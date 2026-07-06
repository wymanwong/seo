"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Suspense } from "react";

function HeroContent() {
  const searchParams = useSearchParams();
  const isQuizMode = searchParams.has("quiz");
  const ctaHref = isQuizMode ? "/quiz" : "/quiz";
  const ctaText = isQuizMode ? "Start now" : "Analyze my website";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]">
        <nav className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5855ff] to-[#8b3dff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-[#111]">SEO Autopilot</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/quiz" className="text-sm text-[#777] hover:text-[#111] hidden sm:block">
              Free SEO Audit
            </Link>
            <Button href={ctaHref} className="!px-6 !py-2.5 !text-sm">
              {ctaText}
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-24 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5855ff]/10 text-[#5855ff] text-sm font-medium">
            AI-Powered SEO Autopilot
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111] leading-tight">
            Find the keywords that bring you{" "}
            <span className="bg-gradient-to-r from-[#5855ff] to-[#8b3dff] bg-clip-text text-transparent">
              buyers
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#777] max-w-2xl mx-auto">
            We analyze your website, discover keyword opportunities, and generate
            SEO content that ranks on Google — automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href={ctaHref} className="!px-10 !py-4 !text-lg w-full sm:w-auto">
              {ctaText}
            </Button>
            <Link
              href="#how-it-works"
              className="text-[#777] hover:text-[#111] text-sm font-medium"
            >
              See how it works ↓
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-8">
            {[
              { value: "50+", label: "Languages" },
              { value: "100", label: "SEO Score" },
              { value: "3 min", label: "Setup time" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E7]">
                <div className="text-2xl font-bold text-[#5855ff]">{stat.value}</div>
                <div className="text-xs text-[#777] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-[#F9F9F9] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111]">
              3 steps to get started
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Add your website",
                  desc: "Enter your website link and we'll learn your site in minutes.",
                },
                {
                  step: "2",
                  title: "Get content ideas",
                  desc: "Our SEO autopilot finds keyword opportunities and content ideas.",
                },
                {
                  step: "3",
                  title: "Publish & grow traffic",
                  desc: "Launch SEO content that ranks on Google and AI search.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl bg-white border border-[#E5E5E7] text-left space-y-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5855ff] to-[#8b3dff] flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-[#111]">{item.title}</h3>
                  <p className="text-sm text-[#777]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111]">
                100% of SEO work, automated
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Finds Best Keywords",
                  desc: "Discovers which keywords will get you visible, then writes content proven to rank.",
                },
                {
                  title: "Learns Your Content",
                  desc: "Picks up your brand voice and writing style. Every article sounds like you.",
                },
                {
                  title: "Understands Your Customers",
                  desc: "Learns about your target audience and niche — then writes content that connects.",
                },
                {
                  title: "Technical SEO Built-in",
                  desc: "Meta descriptions, title tags, internal linking, and image optimization — automatic.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-[#E5E5E7] space-y-2"
                >
                  <h3 className="font-semibold text-[#111]">{feature.title}</h3>
                  <p className="text-sm text-[#777]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#5855ff] to-[#8b3dff] py-20 px-4 text-white text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to grow your traffic?
            </h2>
            <p className="text-white/80">
              Get a free SEO analysis of your website in under 3 minutes.
            </p>
            <Button
              href="/quiz"
              className="!bg-white !from-white !to-white !text-[#5855ff] hover:!bg-white/90 !shadow-none"
            >
              Start free SEO audit
            </Button>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-[#111] text-center">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "What exactly does SEO Autopilot do?",
                  a: "It's an AI-powered SEO platform that researches keywords, writes optimized articles, and helps you publish content to rank on Google and AI search — on autopilot.",
                },
                {
                  q: "How does the free SEO audit work?",
                  a: "Enter your website URL, and we analyze your content, brand voice, keyword opportunities, and technical SEO — then send you a personalized report.",
                },
                {
                  q: "Do I need SEO knowledge?",
                  a: "Not at all. Our tool handles keyword research, content optimization, and technical SEO automatically.",
                },
                {
                  q: "What languages are supported?",
                  a: "We support 50+ languages for content generation, from English and Spanish to Chinese, Japanese, Arabic, and more.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group p-4 rounded-2xl border border-[#E5E5E7] open:bg-[#F9F9F9]"
                >
                  <summary className="font-semibold text-[#111] cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-[#777] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-[#777]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E5E5E7] py-8 px-4 text-center text-sm text-[#777]">
        <p>© {new Date().getFullYear()} SEO Autopilot. Built for organic growth.</p>
      </footer>
    </>
  );
}

export function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HeroContent />
    </Suspense>
  );
}
