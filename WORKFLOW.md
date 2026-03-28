# Development Workflow

## Daily development flow

```bash
git checkout dev
npm run dev
# confirm / and /admin load
# make ONE change
# test locally
git add <specific files>
git commit -m "type: description"
git push origin dev
# repeat
```

## Deploy to production

Only when `dev` is fully stable and all pages load:

```bash
git checkout main
git merge dev
git push origin main
# Netlify auto-deploys from main
git checkout dev
```

## Adding a new blog post (NO CODE NEEDED)

1. Go to `/admin`
2. Click **Blog Posts → Create New**
3. Fill in title, content, tags, featured image
4. Set status to **Published**
5. Post goes live immediately — no rebuild needed (force-dynamic)

## Editing page content (NO CODE NEEDED)

1. Go to `/admin`
2. Click **Pages** → find the page by its Page Type
3. Edit any field
4. Save — changes reflect on site on next request

## Making a code change

1. Always on `dev` branch — check with `git status`
2. One concern per session
3. Test locally before committing
4. Never push broken code to `main`

## Payload schema changes (CAREFUL)

Schema changes touch the live Neon database. Follow this order:

1. Make all new fields optional (`required: false`)
2. State **"SCHEMA CHANGE DETECTED"** and list affected columns
3. Test migration locally — watch terminal for errors
4. If migration fails with NULL constraint errors:
   - Fix data in Neon SQL Editor first
   - Then re-run dev server
5. Commit schema changes with `schema:` prefix

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | Neon PostgreSQL connection string (no `channel_binding=require`) |
| `PAYLOAD_SECRET` | Payload auth secret (32+ random chars) |
| `NEXT_PUBLIC_SERVER_URL` | Full URL (http://localhost:3000 locally) |
| `REVALIDATION_SECRET` | Protects the `/api/revalidate` endpoint |

Never commit `.env.local`. Copy `.env.example` as a template.

## Branch rules

| Branch | Purpose |
|---|---|
| `dev` | All development work |
| `main` | Production — Netlify deploys from here |

Never commit directly to `main`. Always merge from `dev`.

## Known gotchas

- **Neon free tier sleeps** after ~5 min of inactivity — first request after sleep takes 2–3 s
- **`channel_binding=require`** in DATABASE_URI breaks the postgres driver — remove it
- **`app/layout.tsx`** must return `children` only — no `<html>` or `<body>`
- **Blog pages** use `force-dynamic` — no rebuild needed for new posts
- **CSS from Payload** handled by `ignore-loader` in `next.config.mjs` — don't remove it
