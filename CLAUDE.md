# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
npm start        # serve production build
```

No test suite is configured.

## Stack

- **Next.js 16.2.6** — App Router only; no Pages Router. This is a newer version than most training data — read `node_modules/next/dist/docs/` before using unfamiliar APIs.
- **React 19.2.4** with Server Components by default.
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss`. The v4 config API differs from v3 (no `tailwind.config.js`; tokens are declared in `globals.css` under `@theme inline`).
- **TypeScript** throughout.

## Architecture

### Content layer (`lib/` by domain)

All site content lives in-repo — no CMS. Domains are folders; imports are explicit (no barrel `index.ts`):

- `lib/site/site.ts` — personal info, nav, social links, stats, footer focus areas
- `lib/site/agent-brief.ts` — markdown brief for recruiters' agents (`/llms.txt`, copy/download)
- `lib/projects/projects.ts` — project catalog (`slug`, cards, `homeProjects`)
- `content/projects/*.md` — case study bodies; `lib/projects/cases.ts` loads them
- `lib/experience/experience.ts` — employment history (e.g. TRD)
- `content/writing/*.md` — blog posts; `lib/writing/posts.ts` loads them
- `lib/writing/claps.ts` + `claps-constants.ts` — post claps (Upstash Redis via `UPSTASH_REDIS_*`)
- `lib/writing/visitor.ts` — shared anonymous `visitor_id` cookie (claps + views)
- `lib/writing/views.ts` — unique visitor/day view totals (stored, not shown in UI yet)
- `lib/about/about.ts` — about page copy and sections
- `lib/shared/tech-icons.ts` — tech icon path helpers

To add or edit content, edit these files directly. Draft posts use `status: draft` and stay out of public lists.

Writing callouts (GitHub-style blockquotes), colored like Railly's notes:

```md
> [!NOTE] Optional title
> Body text

> [!TIP] ...
> [!WARNING] ...
> [!IMPORTANT] ...
```

### Layout primitives

`SiteShell` (`app/components/site/shell.tsx`): `.page-rail-guides` + fixed `SiteNavbar` + full-width `page-main` + `SiteFooter`. `.section-rule` is `width: 100%` of `page-main` (no `100vw`, avoids horizontal scroll). Mounted once in `app/layout.tsx`.

`PageColumn` (`app/components/ui/page-column.tsx`) centers content at `--content-max: 728px` with horizontal padding. Variants: `hero`, `section`, `section-tight`. Pass `ruleTop` for a full-width dashed rule above the block (rendered inside full-width `main`).

### Design system

The design system lives entirely in `app/globals.css`:

- **CSS custom properties** (`--background`, `--foreground`, `--muted`, `--border`, `--surface`, etc.) — dark-only theme.
- **Semantic utility classes** (`type-h1`, `type-body`, `type-section-heading`, `btn-primary`, `link-arrow`, `page-column`, `section-rule`, etc.) — prefer these over ad-hoc Tailwind utilities for anything covered by the system.
- **Fonts**: `Exposure` (display/serif, loaded from Framer CDN via `@font-face`) and `Inter` (body, via `next/font/google`). Use `font-display` class or `var(--font-exposure)` for display text; `font-sans` / `var(--font-inter)` for body.
- Tailwind v4 tokens are bridged into the theme via the `@theme inline` block in `globals.css`.

### Pages

- `/` — `app/page.tsx`: single-page scroll (hero, at-a-glance, experience, projects, writing).
- `/about` — `app/about/page.tsx`: hero and sections from `lib/about/about.ts`.
- `/projects` — project grid; `/projects/[slug]` — case study from `content/projects/`
- `/writing` — `app/writing/page.tsx`: published posts from `content/writing/`
- `/writing/[slug]` — `app/writing/[slug]/page.tsx`: single post markdown body
