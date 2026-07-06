# SEO Autopilot

An AI-powered SEO platform with a Soro-style onboarding quiz flow. Enter your website URL, get a free SEO audit with keyword opportunities, content ideas, and a personalized SEO score.

Inspired by [trysoro.com/?quiz](https://trysoro.com/?quiz) — replicates the same quiz-driven SEO onboarding experience.

## Features

- **Landing page with `?quiz` mode** — CTA routes to `/quiz` when `?quiz` query param is present (like Google Ads landing pages)
- **Multi-step SEO quiz** — Website URL → Analysis → Language → Email → Results
- **Real website analysis** — Scrapes and analyzes title, meta, headings, content depth, and technical SEO
- **Keyword opportunities** — Discovers keywords from your site content
- **Content ideas** — Generates article titles targeting discovered keywords
- **SEO score** — 0–100 score based on technical SEO checks
- **Lead capture** — Saves quiz submissions locally (email + website + score)
- **SEO optimized** — Meta tags, Open Graph, Twitter cards, JSON-LD structured data

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page.

Open [http://localhost:3000/?quiz](http://localhost:3000/?quiz) for quiz-mode landing (Google Ads style).

Open [http://localhost:3000/quiz](http://localhost:3000/quiz) to start the SEO audit directly.

## Quiz Flow

1. **What's your website?** — Enter your URL
2. **Analyzing** — Reads content, finds keywords, calculates traffic potential
3. **Language** — Choose content language (50+ supported)
4. **Email** — Get your SEO report delivered
5. **Results** — SEO score, keyword opportunities, content ideas, technical checks

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Analyze a website URL, returns SEO report |
| `/api/submit` | POST | Save quiz submission (email, website, score) |

### Analyze Example

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "example.com"}'
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── quiz/page.tsx     # Quiz onboarding
│   └── api/
│       ├── analyze/      # Website analysis
│       └── submit/       # Lead capture
├── components/
│   ├── landing/          # Landing page components
│   ├── quiz/             # Quiz step components
│   └── ui/               # Shared UI
└── lib/
    ├── analyze-website.ts # Core SEO analysis engine
    ├── languages.ts       # Supported languages
    └── types.ts           # TypeScript types
```

## Deployment

```bash
npm run build
npm start
```

Works on Vercel, Railway, or any Node.js host.

## License

MIT
