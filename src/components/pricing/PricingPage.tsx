"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "./CountdownTimer";
import { FeatureMarquee } from "./FeatureMarquee";
import {
  PRICING,
  HERO_FEATURES,
  INCLUDED_FEATURES,
  ALSO_GETTING,
  ALSO_INCLUDED,
  BUYING_FEATURES,
  TESTIMONIALS,
  PRICING_FAQ,
  CMS_PLATFORMS,
} from "@/lib/pricing-data";

function SaleBanner() {
  return (
    <div className="bg-gradient-to-r from-[#5855ff] to-[#8b3dff] text-white py-3 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
            Sale Up To {PRICING.discountPercent}% OFF
          </span>
        </div>
        <CountdownTimer />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-[#E5E5E7] bg-white space-y-3">
      <div className="w-12 h-12 rounded-xl bg-[#5855ff]/10 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <h3 className="font-semibold text-[#111]">{title}</h3>
      <p className="text-sm text-[#777] leading-relaxed">{description}</p>
    </div>
  );
}

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col pb-28">
      <SaleBanner />

      <header className="py-5 px-4 bg-white border-b border-[#f0f0f0]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5855ff] to-[#8b3dff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-[#111]">SEO Autopilot</span>
          </Link>
          <Link href="/quiz" className="text-sm text-[#5855ff] font-medium hover:underline">
            Free SEO Audit
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Price hero */}
        <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center space-y-6">
          <p className="text-[#777] text-sm uppercase tracking-wide">Starting from</p>
          <div className="flex items-end justify-center gap-2">
            <span className="text-5xl sm:text-6xl font-bold text-[#111]">
              {PRICING.currency}
              {PRICING.salePrice}
            </span>
            <span className="text-xl text-[#777] mb-2">{PRICING.period}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#999] line-through text-lg">
              {PRICING.currency}
              {PRICING.originalPrice}
              {PRICING.period}
            </span>
            <span className="bg-[#34d399]/15 text-[#059669] px-2 py-0.5 rounded-full text-sm font-semibold">
              {PRICING.discountPercent}% OFF
            </span>
          </div>
        </section>

        {/* Hero features grid */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {HERO_FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* AI powered banner */}
        <section className="bg-white py-12 px-4 border-y border-[#E5E5E7]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111] leading-snug">
              Powered by the latest AI,{" "}
              <span className="text-[#5855ff]">that grows your traffic while you sleep.</span>
            </h2>
          </div>
        </section>

        <FeatureMarquee
          title="Included with SEO Autopilot"
          subtitle='Everything you need to go from "0 traffic" to Top 1 on Google and ChatGPT.'
          items={INCLUDED_FEATURES}
        />

        {/* You're also getting */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111] text-center mb-8">
            You&apos;re also getting
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {ALSO_GETTING.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        <FeatureMarquee title="Also included with SEO Autopilot" items={ALSO_INCLUDED} />

        {/* Buying section */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111] text-center mb-8">
            Buying with SEO Autopilot
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {BUYING_FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
          <p className="text-center text-sm text-[#777] mt-6">
            ⭐ Rated excellent by business owners
          </p>
        </section>

        {/* CMS platforms */}
        <section className="bg-white py-10 px-4 border-y border-[#E5E5E7]">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h3 className="font-semibold text-[#111]">Works with your website</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {CMS_PLATFORMS.map((platform) => (
                <span
                  key={platform}
                  className="px-4 py-2 rounded-full border border-[#E5E5E7] bg-[#FAFAFA] text-sm text-[#555]"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111] text-center">
            Trusted by business owners
          </h2>
          <p className="text-center text-[#777] -mt-4">
            Thousands of entrepreneurs use SEO Autopilot to publish consistent content and grow traffic.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="p-6 rounded-2xl bg-white border border-[#E5E5E7] space-y-4"
              >
                <p className="text-[#333] italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-sm text-[#777]">
                  — {t.author}, {t.location}
                </p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-green-50 border border-green-100 text-center space-y-1">
              <div className="text-2xl">🛡️</div>
              <div className="font-semibold text-[#111]">14-day money-back guarantee</div>
              <p className="text-sm text-[#777]">Try risk-free on your site</p>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 text-center space-y-1">
              <div className="text-2xl">💬</div>
              <div className="font-semibold text-[#111]">24/7 customer support</div>
              <p className="text-sm text-[#777]">Fast help with setup and publishing</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111] text-center mb-8">FAQ</h2>
          <div className="space-y-3">
            {PRICING_FAQ.map((faq) => (
              <details
                key={faq.q}
                className="group p-4 rounded-2xl border border-[#E5E5E7] bg-white open:shadow-sm"
              >
                <summary className="font-semibold text-[#111] cursor-pointer list-none flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-[#777] group-open:rotate-180 transition-transform shrink-0">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#777] leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-md border-t border-[#E5E5E7]">
        <div className="max-w-lg mx-auto">
          <Button href="/quiz" className="w-full !py-4 !text-lg">
            Redeem {PRICING.discountPercent}% OFF — Start Now
          </Button>
        </div>
      </div>
    </div>
  );
}
