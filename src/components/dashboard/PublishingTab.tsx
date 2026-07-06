"use client";

import { useEffect, useState } from "react";
import type { ScheduledPost, SeoAnalysis } from "@/lib/types";
import { getPlatformPublishUrl } from "@/lib/platform-detect";
import { Button } from "@/components/ui/Button";

const SCHEDULE_KEY = "seo_publish_schedule";

function PostScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 90 ? "#22c55e" : score >= 70 ? "#5855ff" : "#f59e0b";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#777]">{label}</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 bg-[#E5E5E7] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

function PostCard({
  post,
  onStatusChange,
  platformName,
  publishUrl,
}: {
  post: ScheduledPost;
  onStatusChange: (id: string, status: ScheduledPost["status"]) => void;
  platformName: string;
  publishUrl: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(post.scheduledDate);

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700",
    draft: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    published: "bg-gray-100 text-gray-600",
  };

  return (
    <div className={`p-5 rounded-2xl border bg-white ${
      post.status === "published" ? "border-[#E5E5E7] opacity-75" : "border-[#E5E5E7]"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs text-[#777]">
              {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              {" · "}8:00 AM
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[post.status]}`}>
              {post.status}
            </span>
          </div>
          <h3 className="font-semibold text-[#111]">{post.title}</h3>
          <p className="text-sm text-[#777] mt-1">Target: <strong>{post.keyword}</strong></p>
        </div>
        <div className="shrink-0 text-center">
          <div className={`text-2xl font-bold ${
            post.seoScore.total >= 90 ? "text-green-600" :
            post.seoScore.total >= 70 ? "text-[#5855ff]" : "text-amber-600"
          }`}>
            {post.seoScore.total}
          </div>
          <div className="text-xs text-[#777]">/100</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <PostScoreBar score={post.seoScore.google} label="Google" />
        <PostScoreBar score={post.seoScore.aiSearch} label="AI search" />
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-[#5855ff] mt-3 hover:underline"
      >
        {expanded ? "Hide details" : "Show SEO details & publish info"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-[#F0F0F0] pt-4">
          <div>
            <div className="text-xs font-medium text-[#777] mb-1">Meta description</div>
            <p className="text-sm text-[#555] bg-[#FAFAFA] p-2 rounded-lg">{post.metaDescription}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-[#777] mb-1">URL slug</div>
            <code className="text-sm bg-[#FAFAFA] px-2 py-1 rounded">/{post.suggestedSlug}</code>
          </div>
          <div>
            <div className="text-xs font-medium text-[#777] mb-2">SEO score breakdown</div>
            <div className="space-y-2">
              {post.seoScore.breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-[#555]">{b.label}</span>
                  <span className="font-medium">{b.score}/{b.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {post.status !== "published" && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.status === "scheduled" && (
            <button
              type="button"
              onClick={() => onStatusChange(post.id, "draft")}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E5E5E7] hover:bg-[#FAFAFA]"
            >
              Create draft
            </button>
          )}
          {(post.status === "draft" || post.status === "scheduled") && (
            <button
              type="button"
              onClick={() => onStatusChange(post.id, "approved")}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#5855ff]/10 text-[#5855ff] font-medium hover:bg-[#5855ff]/20"
            >
              Approve
            </button>
          )}
          {post.status === "approved" && (
            <a
              href={publishUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#5855ff] to-[#8b3dff] text-white font-medium"
            >
              Publish on {platformName}
            </a>
          )}
          <button
            type="button"
            onClick={() => onStatusChange(post.id, "published")}
            className="text-xs px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50"
          >
            Mark published
          </button>
        </div>
      )}
    </div>
  );
}

export function PublishingTab({ data }: { data: SeoAnalysis }) {
  const [schedule, setSchedule] = useState<ScheduledPost[]>(data.publishingSchedule);
  const publishUrl = getPlatformPublishUrl(data.platform, data.domain);

  useEffect(() => {
    const saved = localStorage.getItem(SCHEDULE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ScheduledPost[];
        if (parsed.length === data.publishingSchedule.length) {
          setSchedule(parsed);
        }
      } catch { /* use default */ }
    }
  }, [data.publishingSchedule.length]);

  const updateStatus = (id: string, status: ScheduledPost["status"]) => {
    setSchedule((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, status } : p));
      localStorage.setItem(SCHEDULE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const published = schedule.filter((p) => p.status === "published").length;
  const approved = schedule.filter((p) => p.status === "approved").length;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#5855ff]/10 to-[#8b3dff]/10 border border-[#5855ff]/20">
        <h3 className="font-semibold text-[#111] mb-1">Daily publishing schedule</h3>
        <p className="text-sm text-[#555]">
          A new post is created every morning. <strong>Approve</strong> it, <strong>tweak</strong> the
          title or meta, then <strong>publish</strong> to your {data.platform.name} blog.
        </p>
        <div className="flex gap-4 mt-3 text-sm">
          <span><strong>{schedule.length}</strong> scheduled</span>
          <span className="text-green-600"><strong>{approved}</strong> approved</span>
          <span className="text-[#777]"><strong>{published}</strong> published</span>
        </div>
      </div>

      <div className="space-y-4">
        {schedule.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onStatusChange={updateStatus}
            platformName={data.platform.name}
            publishUrl={publishUrl}
          />
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-white border border-[#E5E5E7]">
        <h3 className="font-semibold mb-3">How to publish on {data.platform.name}</h3>
        <ol className="space-y-2">
          {data.platform.publishSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#555]">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#5855ff]/10 text-[#5855ff] flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <Button href={publishUrl} className="mt-4 !text-sm" variant="secondary">
          Open {data.platform.name} admin →
        </Button>
      </div>
    </div>
  );
}
