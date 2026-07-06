"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WebsiteStep } from "./WebsiteStep";
import { AnalyzingStep } from "./AnalyzingStep";
import { LanguageStep } from "./LanguageStep";
import { EmailStep } from "./EmailStep";
import { ResultsStep } from "./ResultsStep";
import type { QuizStep, SeoAnalysis } from "@/lib/types";
import { getQuizProgress, normalizeUrl } from "@/lib/utils";

export function QuizFlow() {
  const [step, setStep] = useState<QuizStep>("website");
  const [website, setWebsite] = useState("");
  const [language, setLanguage] = useState("en");
  const [email, setEmail] = useState("");
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const analysisStarted = useRef(false);

  const runAnalysis = useCallback(async (url: string) => {
    setError("");
    setAnalysisReady(false);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizeUrl(url) }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      setAnalysis(data);
      setAnalysisReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("website");
      analysisStarted.current = false;
    }
  }, []);

  useEffect(() => {
    if (step === "analyzing" && analysisReady && animationDone) {
      setStep("language");
    }
  }, [step, analysisReady, animationDone]);

  const handleWebsiteSubmit = (url: string) => {
    setWebsite(url);
    setAnalysisReady(false);
    setAnimationDone(false);
    analysisStarted.current = true;
    setStep("analyzing");
    runAnalysis(url);
  };

  const handleAnalyzingComplete = () => {
    setAnimationDone(true);
  };

  const handleLanguageSubmit = (lang: string) => {
    setLanguage(lang);
    setStep("email");
  };

  const handleEmailSubmit = async (emailValue: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: normalizeUrl(website),
          language,
          email: emailValue,
          seoScore: analysis?.seoScore ?? 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }
      setEmail(emailValue);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar progress={getQuizProgress(step)} />

      <header className="py-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5855ff] to-[#8b3dff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-[#111]">SEO Autopilot</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center px-4 pb-16">
        <div className="max-w-xl mx-auto w-full">
          {step === "website" && (
            <WebsiteStep onSubmit={handleWebsiteSubmit} error={error} />
          )}
          {step === "analyzing" && (
            <AnalyzingStep onComplete={handleAnalyzingComplete} />
          )}
          {step === "language" && (
            <LanguageStep onSubmit={handleLanguageSubmit} />
          )}
          {step === "email" && (
            <EmailStep
              onSubmit={handleEmailSubmit}
              error={error}
              loading={loading}
            />
          )}
          {step === "results" && analysis && (
            <ResultsStep analysis={analysis} email={email} />
          )}
        </div>
      </main>
    </div>
  );
}
