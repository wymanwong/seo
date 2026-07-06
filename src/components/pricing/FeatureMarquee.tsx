"use client";

interface MarqueeItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureMarqueeProps {
  items: MarqueeItem[];
  title: string;
  subtitle?: string;
}

export function FeatureMarquee({ items, title, subtitle }: FeatureMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111]">{title}</h2>
        {subtitle && <p className="text-[#777]">{subtitle}</p>}
      </div>

      <div className="relative">
        <div className="flex animate-marquee gap-4 w-max">
          {doubled.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="w-72 shrink-0 p-5 rounded-2xl border border-[#E5E5E7] bg-white shadow-sm"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-[#111] mb-2">{item.title}</h3>
              <p className="text-sm text-[#777] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
