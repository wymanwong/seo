# SEO Research Dashboard

A personal SEO research tool for **your own website** — not a SaaS product. Analyze your site, view keyword opportunities, content ideas, technical SEO checks, and actionable recommendations.

## What it does

- **Analyzes your website** — scrapes title, meta, headings, content, links, images
- **Keyword research** — discovers keyword opportunities with volume, difficulty, intent, and priority
- **Content plan** — generates article ideas with outlines you can write yourself
- **Technical SEO audit** — checks title, meta description, H1, OG tags, canonical, alt text, links
- **Issues & fixes** — lists problems found with specific fix instructions
- **Recommendations** — prioritized action items to improve rankings

## Setup

```bash
npm install
cp .env.example .env.local   # optional — set your site URL
npm run dev
```

Open http://localhost:3000

## Configure your website

Set your site URL in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://your-website.com
NEXT_PUBLIC_SITE_NAME=My Store SEO
```

Defaults to `https://furbaby-8874.myshopify.com` if not set.

## Dashboard tabs

| Tab | What you see |
|-----|-------------|
| **Overview** | SEO score, traffic potential, site snapshot, top recommendations |
| **Real Traffic** | Connect Google Search Console — real clicks, impressions, rankings (free OAuth) |
| **Keywords** | Keyword ideas + Google Keyword Planner helper for real volumes |
| **Content Plan** | Article ideas with titles, target keywords, and outlines |
| **Technical SEO** | Pass/fail checks for all technical elements |
| **Issues & Fixes** | Problems found + how to fix each one |

Results are cached in your browser (localStorage) so you don't lose research between visits.

## Google Search Console (free, real traffic data)

The **Real Traffic** tab syncs actual Google data via OAuth — clicks, impressions, CTR, and position.

### One-time setup (free)

1. Create a project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Google Search Console API**
3. Create **OAuth 2.0 Web client** credentials
4. Add redirect URI: `http://localhost:3000/api/gsc/callback` (or your deployed URL)
5. Add to `.env.local`:

```env
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gsc/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

6. Restart the dev server → open **Real Traffic** tab → **Connect with Google**

Your site must already be verified in [Google Search Console](https://search.google.com/search-console).

### Keyword volumes (estimated vs real)

- Dashboard keyword volumes marked **Est.** are generated estimates, not Google data
- For real volumes: use **Keyword Research** tab → copy keywords → paste into [Google Keyword Planner](https://ads.google.com/aw/keywordplanner/home) (free)
- Enter real volumes back in the dashboard table (saved in your browser)

## API

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "yourwebsite.com"}'
```

## This is NOT

- A SaaS platform to sell SEO to others
- A lead capture / email funnel
- A pricing / checkout page

It's a **personal SEO research dashboard** for growing your own website's organic traffic.
