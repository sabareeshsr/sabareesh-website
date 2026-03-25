# Claude Code — Project Ground Rules

## Colour Theme & Design Tokens

Always use the established design system. Never introduce new colours or styles that deviate from these tokens:

| Token | Value |
|---|---|
| Background | `#020617` (dark navy) |
| Blue gradient start | `#60a5fa` |
| Blue gradient end | `#2563eb` |
| Muted text | `#94a3b8` |
| Subtle text | `#64748b` |
| Accent blue | `#94ccff` |
| White text | `#ffffff` |

**Glassmorphism card:**
```
backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.12)] rounded-[24px]
```

**Blue gradient (backgrounds, buttons):**
```
linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)
```

**Section separator line:**
```
linear-gradient(90deg, transparent 0%, rgba(148,204,255,0.3) 50%, transparent 100%)
```

---

## Architecture Rules

### Modularity
- Every page must be composed of self-contained, reusable sections
- Components must accept props from both Payload CMS and hardcoded fallbacks
- No monolithic page files — split into logical sub-components when a section exceeds ~80 lines

### CMS-First Content
- **No content should ever be hardcoded as the only source of truth**
- Every piece of visible text, link, image, or configuration must be editable via Payload CMS
- All pages must define a corresponding `pageType` in the Payload `pages` collection
- Fallback values are allowed in code (for local dev / before seeding) but must be clearly marked as fallbacks

### Payload CMS
- Always use `getPayload()` direct server calls — never HTTP fetch to `/api/`
- Always use `getPage<T>(pageType)` from `lib/getPage.ts` for page-level data
- Always use `getSiteSettings()` from `lib/getSiteSettings.ts` for global data
- Seed data lives in `scripts/seed.ts` — update it whenever new fields are added

### Server vs Client Components
- Pages and layouts are **server components** by default — no `'use client'` unless required
- Only add `'use client'` for components that need: browser events, `useState`, `useEffect`, or client-side routing
- Current client components: `MobileMenu.tsx`, `BlogClient.tsx`, `ContactForm.tsx`

---

## File Structure Conventions

```
app/
  (site)/          ← All public-facing pages (Header + Footer layout)
  (payload)/       ← Payload admin routes (separate layout, no Header/Footer)
  layout.tsx       ← Root layout: html/body only, NO Header or Footer

components/        ← Shared UI components
lib/               ← Server-side utilities (getPage, getSiteSettings)
scripts/           ← CLI scripts (seed.ts)
payload.config.ts  ← Payload CMS config (collections + globals)
```

---

## What NOT to Do

- Do not add `NODE_VERSION` to `netlify.toml` — Netlify auto-detects it
- Do not use MongoDB adapter — this project uses `@payloadcms/db-postgres` (Neon)
- Do not put Header or Footer inside `app/layout.tsx` (root) — they belong in `app/(site)/layout.tsx` only
- Do not create a `pages/` directory — this is an App Router project
- Do not use `import Layout from '@/components/Layout'` wrappers — inline Header/Footer directly
- Do not hardcode nav links or footer links — these come from Payload Site Settings global
- Do not skip fallback values — every CMS field must have a sensible hardcoded fallback
