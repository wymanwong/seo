import type { SeoAnalysis } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { getPlatformPublishUrl } from "@/lib/platform-detect";

const PILLARS = [
  {
    id: "publishing",
    icon: "📅",
    title: "Daily publishing",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "keywords",
    icon: "🔍",
    title: "Keyword research",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "optimization",
    icon: "🤖",
    title: "Google + AI optimization",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "platform",
    icon: "🔗",
    title: "Works with your website",
    color: "from-orange-500 to-amber-600",
  },
] as const;

function PillarContent({ data, id }: { data: SeoAnalysis; id: string }) {
  const avgPostScore = Math.round(
    data.contentIdeas.reduce((s, c) => s + c.seoScore.total, 0) /
      Math.max(data.contentIdeas.length, 1),
  );
  const buyerKw = data.buyerKeywords.filter((k) => k.buyerStage === "purchase").length;
  const nextPost = data.publishingSchedule[0];
  const publishUrl = getPlatformPublishUrl(data.platform, data.domain);

  switch (id) {
    case "publishing":
      return (
        <>
          <p className="text-sm text-[#555] leading-relaxed">
            A new post is scheduled every morning. Approve it, tweak it, or publish it to your{" "}
            <strong>{data.platform.name}</strong> blog.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E7] space-y-2">
            <div className="flex justify-between text-xs text-[#777]">
              <span>Next post</span>
              <span>{nextPost ? new Date(nextPost.scheduledDate).toLocaleDateString() : "—"}</span>
            </div>
            <div className="text-sm font-medium text-[#111] line-clamp-2">
              {nextPost?.title ?? "No posts scheduled"}
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                {nextPost?.status ?? "scheduled"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                {nextPost?.seoScore.total ?? 0}/100 SEO
              </span>
            </div>
          </div>
          <p className="text-xs text-[#999] mt-3">
            {data.publishingSchedule.length} posts queued · 1 per day
          </p>
        </>
      );

    case "keywords":
      return (
        <>
          <p className="text-sm text-[#555] leading-relaxed">
            We found what your buyers are searching for — and mapped each query to content you
            should write about.
          </p>
          <div className="mt-4 space-y-2">
            {data.buyerKeywords.slice(0, 3).map((kw, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E7] text-sm"
              >
                <span className="font-medium text-[#111] truncate flex-1">{kw.query}</span>
                <span className="text-xs text-[#5855ff] ml-2 shrink-0">
                  {formatNumber(kw.volume)}/mo
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#999] mt-3">
            {data.keywords.length} keywords · {buyerKw} high-buyer-intent
          </p>
        </>
      );

    case "optimization":
      return (
        <>
          <p className="text-sm text-[#555] leading-relaxed">
            Every post is scored for Google and AI search (ChatGPT). Target{" "}
            <strong>100/100</strong> before publishing.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Avg score", value: `${avgPostScore}/100` },
              { label: "Google", value: `${Math.round(data.contentIdeas[0]?.seoScore.google ?? 0)}/100` },
              { label: "AI search", value: `${Math.round(data.contentIdeas[0]?.seoScore.aiSearch ?? 0)}/100` },
            ].map((s) => (
              <div key={s.label} className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E5E7] text-center">
                <div className="text-lg font-bold text-[#5855ff]">{s.value}</div>
                <div className="text-xs text-[#777]">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#999] mt-3">
            Scores check title, meta, headings, FAQ, and internal links
          </p>
        </>
      );

    case "platform":
      return (
        <>
          <p className="text-sm text-[#555] leading-relaxed">
            Your site runs on <strong>{data.platform.name}</strong>. Publish directly to{" "}
            <code className="text-xs bg-[#F0F0F0] px-1 rounded">{data.platform.blogPath}</code>{" "}
            without copy/paste hassles.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E7]">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${data.platform.connected ? "bg-green-500" : "bg-amber-500"}`} />
              <span className="text-sm font-medium">
                {data.platform.connected ? `${data.platform.name} detected` : "Custom site"}
              </span>
            </div>
            <ol className="text-xs text-[#777] space-y-1 list-decimal list-inside">
              {data.platform.publishSteps.slice(0, 3).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          <a
            href={publishUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#5855ff] hover:underline mt-3 inline-block"
          >
            Open {data.platform.name} to publish →
          </a>
        </>
      );

    default:
      return null;
  }
}

export function FeaturePillars({ data }: { data: SeoAnalysis }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {PILLARS.map((pillar) => (
        <div
          key={pillar.id}
          className="p-5 rounded-2xl bg-white border border-[#E5E5E7] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-lg shadow-sm`}
            >
              {pillar.icon}
            </div>
            <h3 className="font-semibold text-[#111]">{pillar.title}</h3>
          </div>
          <PillarContent data={data} id={pillar.id} />
        </div>
      ))}
    </div>
  );
}
