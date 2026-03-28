# Sabareesh Portfolio Website

Personal portfolio for Sabareesh — Writer, SAP GenAI Developer, Growth Marketer, AI Agent Manager.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Payload CMS 3.0** — content management at `/admin`
- **Neon PostgreSQL** — free-tier serverless Postgres
- **Netlify** — auto-deploys from `main` branch

## Local Development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# fill in your values in .env.local
npm run dev
```

Visit `http://localhost:3000` — site
Visit `http://localhost:3000/admin` — CMS

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URI` | Neon PostgreSQL connection string |
| `PAYLOAD_SECRET` | 32+ character random secret for Payload auth |
| `NEXT_PUBLIC_SERVER_URL` | Full URL (`http://localhost:3000` locally) |
| `REVALIDATION_SECRET` | Secret for the `/api/revalidate` endpoint |

> **Important:** Remove `&channel_binding=require` from Neon connection strings — it breaks the postgres driver.

## Content Management

All content is managed through Payload CMS at `/admin`. No code changes needed for:

- Blog posts (create, edit, publish)
- Page content (hero text, about bio, skill tiles, etc.)
- Site settings (title, description, favicon, social links)
- Navigation and footer links

## Deployment

Push to `main` branch → Netlify auto-deploys.

**Always develop on `dev` branch. Merge to `main` only when stable.**

```bash
git checkout main
git merge dev
git push origin main
git checkout dev
```

## Blog Posts

Blog pages use `force-dynamic` rendering — new posts go live immediately after publishing in `/admin` without any rebuild.

## Project Structure

```
app/
  layout.tsx           ← Root: returns children only (no html/body)
  (site)/              ← Public pages with Header + Footer
  (payload)/           ← Payload admin (separate layout)
  api/revalidate/      ← ISR revalidation endpoint

components/            ← Shared UI (Header, Footer, RichText, etc.)
lib/                   ← Server utilities (getPage, getSiteSettings)
payload.config.ts      ← CMS schema (careful: triggers DB migrations)
next.config.mjs        ← Next.js config
```

See `CLAUDE.md` for full development ground rules and `WORKFLOW.md` for the day-to-day workflow.
