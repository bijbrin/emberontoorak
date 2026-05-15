# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # start dev server on localhost:3000
npm run build      # prisma generate + next build
npm run lint       # eslint
```

Database / seeding:
```bash
npx prisma migrate dev --name <name>   # create and apply a migration
npx prisma migrate deploy              # apply migrations in production
npx prisma db seed                     # seed initial data (prisma/seed.ts)
npx prisma studio                      # browse data in the browser
```

There are no automated tests. Verify UI changes by running `npm run dev` and manually testing in the browser.

## Architecture

**Ember on Toorak** is a Next.js 15 App Router restaurant site with Clerk auth, Prisma ORM over Neon (serverless Postgres), Framer Motion animations, and Lenis smooth-scroll.

### Request flow

```
browser → middleware.ts (Clerk auth guard for /admin)
        → app/ pages & API routes
        → lib/prisma.ts (PrismaNeonHttp singleton)
        → Neon Postgres
```

### Key directories

- `app/` — App Router pages and API routes
  - `app/page.tsx` — public homepage (Hero, SignatureDishes, TheatreOfFire, WineList, BookingPanel, Footer)
  - `app/menu/` — full menu page, force-dynamic, fetches from `/api/menu`
  - `app/reservations/` — reservation confirmation/form page
  - `app/admin/` — protected admin dashboard (Clerk auth required)
    - `AdminShell.tsx` — client component housing `MenuManager` and `ReservationManager` tabs
  - `app/api/menu/` — GET all menu+wine data; `[id]/` for item mutations
  - `app/api/reservations/` — POST (public, Zod-validated); GET + `[id]/` (admin-only via `currentUser` check)
  - `app/components/` — all shared UI components
- `lib/prisma.ts` — Prisma singleton using `@prisma/adapter-neon` (HTTP transport, no WebSocket needed)
- `prisma/schema.prisma` — `MenuSection`, `MenuItem`, `WineSection`, `WineItem`, `Reservation` models
- `middleware.ts` — Clerk middleware; only `/admin(.*)` is auth-gated, everything else is public

### Auth & admin role

Admin access requires Clerk authentication **plus** `publicMetadata.role === 'admin'` on the user object. The middleware only checks for a logged-in `userId`; the `role` check is enforced at the API route level in `app/api/reservations/route.ts`. Set the role in the Clerk dashboard.

### Design system

Tailwind v4 with inline theme tokens defined in `app/globals.css`:

| Token | Value | Usage |
|---|---|---|
| `obsidian` | `#273F4F` | Page background |
| `smoke` | `#1E2F3C` | Section layering |
| `surface` | `#2A4255` | Cards / panels |
| `steel` | `#447D9B` | Borders, secondary accents |
| `ember` / `gold` | `#FE7743` | CTAs, highlights — the coral accent |
| `cream` | `#F0EAE0` | Body text |

Fonts (loaded via `next/font/google`, exposed as CSS variables):
- `--font-cormorant` → `font-serif` — editorial headings
- `--font-oswald` → `font-display` — sub-headings, all-caps labels
- `--font-geist-sans` → `font-sans` — body copy

Use these Tailwind utilities (`bg-obsidian`, `text-ember`, `font-serif`, etc.) rather than raw hex values.

### Animations

Framer Motion handles entrance animations and interactions. Lenis (`SmoothScrollProvider`) wraps the app for luxury smooth-scroll — `html { scroll-behavior: auto }` in globals.css is intentional; Lenis owns scrolling. The `ScrollProgress` bar reads scroll position via Lenis.

### Security headers

`next.config.ts` applies CSP, `X-Frame-Options: DENY`, and (in production) HSTS to every route. When adding third-party scripts or fonts, update the CSP there.

### Planned features (see RESERVATION.md)

The PRD in `RESERVATION.md` specifies a future AI-powered reservation backend using OpenAI tool calling, Twilio SMS/voice, SendGrid, and Inngest for scheduled reminders. The current `/api/reservations` route is the baseline web-form implementation.
