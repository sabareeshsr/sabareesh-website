# CLAUDE.md — Sabareesh Portfolio Ground Rules

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Payload CMS 3.0 (admin at /admin)
- Neon PostgreSQL (free tier)
- Netlify (deploy from main branch only)
- Branch strategy: develop on `dev`, merge to `main` when stable

## Design Tokens (NEVER change without explicit approval)
- Background: `#020617` (near black)
- Primary gradient: `#60a5fa` → `#2563eb` (blue)
- Muted text: `#94a3b8` | Subtle text: `#64748b` | Accent blue: `#94ccff`
- Glass card: `backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]`
- Blue gradient: `linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)`
- Section separator: `linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)`
- Font headings: Plus Jakarta Sans (`--font-plus-jakarta`)
- Font body: Inter (`--font-inter`)
- Border radius — cards: `24px`, buttons: `10px–16px`

---

## RULE 1 — One change at a time
Never fix multiple systems in one session.
Order: fix → test → commit → next fix.

## RULE 2 — Schema changes are DANGEROUS
Before ANY change to `payload.config.ts`:
- Say **"SCHEMA CHANGE DETECTED"**
- List exactly which tables/columns will be affected
- Check if existing data will break
- Only proceed after explicit approval
- Never use `ALTER TABLE SET NOT NULL` on existing columns
- Always make new fields optional (`required: false`)

## RULE 3 — Layout files are CRITICAL
These files affect the entire site if broken:
- `app/layout.tsx` → must return `children` ONLY, no `<html>` or `<body>`
- `app/(site)/layout.tsx` → owns `<html><body>` + Header + Footer
- `app/(payload)/layout.tsx` → Payload's own layout, do not touch

Never add `<html>` or `<body>` tags to `app/layout.tsx`.

## RULE 4 — Before every commit checklist
Run through this mentally:
- [ ] `localhost:3000` loads without errors
- [ ] `localhost:3000/admin` loads without errors
- [ ] No TypeScript errors in terminal
- [ ] No breaking changes to existing pages
- [ ] `.env.local` is in `.gitignore`
- [ ] Committing to `dev` branch, NOT `main`

## RULE 5 — CMS content vs hardcoded
Every user-facing text/image MUST come from Payload.
Exception: design structure, layout, animations.
When adding new content areas, always add a corresponding Payload field first.
Every CMS field must have a sensible hardcoded fallback in code.

## RULE 6 — Image handling
- Always use Next.js `<Image>` component
- Always specify `width`/`height` or use `fill` prop
- All image hostnames must be in `next.config.mjs` `remotePatterns`
- Payload media URL format:
  - Local: `/api/media/file/[filename]`
  - Prod: `https://domain.com/api/media/file/[filename]`

## RULE 7 — Safe vs dangerous zones

**SAFE** (low risk, make changes freely):
- Tailwind classes and styling
- Adding new optional CMS fields
- New page components
- Blog and content pages

**DANGEROUS** (test carefully, one at a time):
- `payload.config.ts` (triggers DB migrations)
- `app/layout.tsx` family
- `next.config.mjs`
- `package.json` dependencies

**NEVER touch without explicit discussion:**
- Database directly (except approved SQL fixes)
- Auth/security configuration
- Environment variables structure

## RULE 8 — Commit message format
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for maintenance
- `style:` for styling only
- `schema:` for `payload.config.ts` changes (flag these!)

Always commit to `dev` branch.
Merge to `main` only when all pages load correctly.

## RULE 9 — When something breaks
1. Stop — do not make more changes to fix the fix
2. Identify the single last change that caused it
3. Revert that change first: `git revert` or `git checkout -- <file>`
4. Confirm site works again
5. Then re-approach the fix more carefully

## RULE 10 — Session start checklist
At the start of every Claude Code session:
1. Run `npm run dev`
2. Confirm `/` and `/admin` load
3. Run `git status` — confirm on `dev` branch
4. Only then start making changes

## RULE 11 — Git is manual, NEVER auto-commit
- Never run `git add`, `git commit`, or `git push`
- Never suggest "I'll commit this for you"
- After every change, simply say: **"Changes complete. Ready to commit when you are."**
- The developer handles all git operations manually
- This applies to ALL changes without exception

---

## Architecture

### Payload CMS
- Always use `getPayload()` direct server calls — never HTTP fetch to `/api/`
- Always use `getPage<T>(pageType)` from `lib/getPage.ts` for page-level data
- Always use `getSiteSettings()` from `lib/getSiteSettings.ts` for global data
- Seed data lives in `scripts/seed.ts` — update whenever new fields are added

### Server vs Client Components
- Pages and layouts are **server components** by default
- Only add `'use client'` for components needing: browser events, `useState`, `useEffect`, client-side routing
- Current client components: `MobileMenu.tsx`, `BlogClient.tsx`, `ContactForm.tsx`

### File Structure
```
app/
  layout.tsx          ← Root: returns children ONLY
  (site)/             ← Public pages — has <html><body>, Header, Footer
  (payload)/          ← Payload admin — do not touch layout
  api/revalidate/     ← ISR revalidation endpoint

components/           ← Shared UI components
lib/                  ← Server utilities (getPage, getSiteSettings)
scripts/              ← CLI scripts (seed.ts)
payload.config.ts     ← Payload CMS config (DANGEROUS)
next.config.mjs       ← Next.js config (DANGEROUS)
```

### What NOT to Do
- Do not add `NODE_VERSION` to `netlify.toml`
- Do not use MongoDB adapter — this project uses `@payloadcms/db-postgres` (Neon)
- Do not put Header/Footer in `app/layout.tsx`
- Do not create a `pages/` directory — App Router only
- Do not hardcode nav/footer links — they come from Payload Site Settings
- Do not use `ALTER TABLE SET NOT NULL` on existing columns
- Do not add `channel_binding=require` to `DATABASE_URI` — breaks the postgres driver
