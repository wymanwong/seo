"use client";

import { useCallback, useEffect, useState } from "react";
import type { GscSummary } from "@/lib/gsc-types";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Props {
  siteUrl: string;
  gscNotice?: string | null;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E5E5E7]">
      <div className="text-sm text-[#777]">{label}</div>
      <div className="text-2xl font-bold text-[#111] mt-1">{value}</div>
      {sub && <div className="text-xs text-[#999] mt-1">{sub}</div>}
    </div>
  );
}

export function SearchConsoleTab({ siteUrl, gscNotice }: Props) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GscSummary | null>(null);
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/gsc/status");
    const json = await res.json();
    setConfigured(json.configured);
    setConnected(json.connected);
    return json.connected as boolean;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const isConnected = await loadStatus();
      if (!isConnected) {
        setData(null);
        return;
      }

      const res = await fetch(`/api/gsc/data?site=${encodeURIComponent(siteUrl)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load Search Console data");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [loadStatus, siteUrl]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const disconnect = async () => {
    await fetch("/api/gsc/disconnect", { method: "POST" });
    setConnected(false);
    setData(null);
  };

  if (configured === false) {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
          <h3 className="font-semibold text-lg text-amber-900">Setup required (one-time, free)</h3>
          <p className="text-sm text-amber-800 mt-2">
            To sync <strong>real Google traffic</strong> automatically, create free Google Cloud
            credentials and add them to <code className="text-xs bg-white/60 px-1 rounded">.env.local</code>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5E5E7] space-y-4 text-sm text-[#555]">
          <h4 className="font-semibold text-[#111]">Step-by-step (about 10 minutes)</h4>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5855ff] underline"
              >
                Google Cloud Console
              </a>{" "}
              → create a project (free).
            </li>
            <li>
              Enable <strong>Google Search Console API</strong> (APIs &amp; Services → Library).
            </li>
            <li>
              Create <strong>OAuth credentials</strong> (APIs &amp; Services → Credentials →
              Create OAuth client ID → Web application).
            </li>
            <li>
              Add authorized redirect URI:{" "}
              <code className="text-xs bg-[#FAFAFA] px-1 rounded">
                http://localhost:3000/api/gsc/callback
              </code>{" "}
              (or your deployed URL + <code className="text-xs">/api/gsc/callback</code>).
            </li>
            <li>
              Copy Client ID and Client Secret into <code className="text-xs">.env.local</code>:
              <pre className="mt-2 p-3 rounded-lg bg-[#FAFAFA] text-xs overflow-x-auto">{`GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gsc/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000`}</pre>
            </li>
            <li>Restart <code className="text-xs">npm run dev</code> and return here.</li>
          </ol>
          <p className="text-xs text-[#777]">
            Cost: <strong>$0</strong>. Google Search Console API is free. You only pay if you use
            other paid Google Cloud services.
          </p>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="space-y-6">
        {gscNotice && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {gscNotice}
          </div>
        )}

        <div className="p-8 rounded-2xl bg-white border border-[#E5E5E7] text-center space-y-4">
          <div className="text-4xl">📊</div>
          <h3 className="font-semibold text-xl">Connect Google Search Console</h3>
          <p className="text-sm text-[#777] max-w-md mx-auto">
            See <strong>real clicks, impressions, and rankings</strong> for{" "}
            <strong>{siteUrl}</strong> — pulled directly from Google (free).
          </p>
          <p className="text-xs text-[#999]">
            You must own this site in{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5855ff] underline"
            >
              Google Search Console
            </a>{" "}
            first.
          </p>
          <Button
            onClick={() => {
              window.location.href = "/api/gsc/auth";
            }}
            className="!px-6"
          >
            Connect with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {gscNotice === "connected" && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
          Connected to Google Search Console successfully.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-[#777]">
          <div className="w-8 h-8 border-4 border-[#5855ff] border-t-transparent rounded-full animate-spin" />
          Loading real traffic data from Google...
        </div>
      )}

      {!loading && data && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Real Google traffic</h3>
              <p className="text-sm text-[#777]">
                {data.startDate} → {data.endDate} (last 28 days)
                {data.siteUrl && (
                  <> · Property: <code className="text-xs">{data.siteUrl}</code></>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => void loadData()} className="!text-sm">
                Refresh
              </Button>
              <Button variant="secondary" onClick={() => void disconnect()} className="!text-sm">
                Disconnect
              </Button>
            </div>
          </div>

          {!data.siteUrl && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              Connected, but no Search Console property matched this site. Add{" "}
              <strong>{siteUrl}</strong> in Google Search Console, then refresh.
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Clicks" value={formatNumber(data.totals.clicks)} sub="real visitors from Google" />
            <StatCard label="Impressions" value={formatNumber(data.totals.impressions)} sub="times you appeared in search" />
            <StatCard label="CTR" value={`${(data.totals.ctr * 100).toFixed(1)}%`} sub="click-through rate" />
            <StatCard label="Avg. position" value={data.totals.position.toFixed(1)} sub="lower is better" />
          </div>

          <div className="rounded-2xl border border-[#E5E5E7] bg-white overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E7] bg-[#FAFAFA]">
              <h4 className="font-semibold">Top search queries (real data)</h4>
              <p className="text-xs text-[#777] mt-1">
                These are actual searches where people found your site — not estimates.
              </p>
            </div>
            {data.queries.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#777]">
                No query data yet. Google needs time to index your site and collect impressions.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5E7]">
                      <th className="text-left p-3 font-medium">Query</th>
                      <th className="text-left p-3 font-medium">Clicks</th>
                      <th className="text-left p-3 font-medium">Impressions</th>
                      <th className="text-left p-3 font-medium">CTR</th>
                      <th className="text-left p-3 font-medium">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.queries.map((row, i) => (
                      <tr key={i} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA]">
                        <td className="p-3 font-medium">&ldquo;{row.query}&rdquo;</td>
                        <td className="p-3 text-green-700 font-medium">{row.clicks}</td>
                        <td className="p-3">{formatNumber(row.impressions)}</td>
                        <td className="p-3">{(row.ctr * 100).toFixed(1)}%</td>
                        <td className="p-3">{row.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
