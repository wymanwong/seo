import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

interface Submission {
  id: string;
  website: string;
  language: string;
  email: string;
  seoScore: number;
  createdAt: string;
}

async function loadSubmissions(): Promise<Submission[]> {
  if (!existsSync(SUBMISSIONS_FILE)) return [];
  const raw = await readFile(SUBMISSIONS_FILE, "utf-8");
  return JSON.parse(raw) as Submission[];
}

async function saveSubmission(submission: Submission): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const existing = await loadSubmissions();
  existing.push(submission);
  await writeFile(SUBMISSIONS_FILE, JSON.stringify(existing, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { website, language, email, seoScore } = body as {
      website?: string;
      language?: string;
      email?: string;
      seoScore?: number;
    };

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Please enter your email address" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const submission: Submission = {
      id: crypto.randomUUID(),
      website: website ?? "",
      language: language ?? "en",
      email: email.trim().toLowerCase(),
      seoScore: seoScore ?? 0,
      createdAt: new Date().toISOString(),
    };

    await saveSubmission(submission);

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
