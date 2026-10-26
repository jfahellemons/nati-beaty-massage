# Nataly Beauty Massages

Website for Nataly Beauty Massages (Oosterhout): Next.js 16 (App Router, Cache Components) + Tailwind CSS v4. Clients request appointments and leave reviews here; Nataly manages them in the separate management app [`nataly-beheer`](https://github.com/jfahellemons/nataly-beheer). Both apps share one Supabase database. See `IMPLEMENTATION_PLAN.md` for the decisions behind it.

## Development

```bash
npm install
cp .env.example .env.local   # values: see below
npm run dev                  # http://localhost:3000
```

| Script | |
|---|---|
| `npm run build` | Production build. Marketing pages are static. |
| `npm test` | Unit tests (free-time calculation incl. summer/winter time). |
| `npm run lint` / `npm run typecheck` / `npm run format` | Quality checks. |

## Where things live

| What | File |
|---|---|
| Contact details, hours shown on the site, Instagram, cancellation note | `src/content/site.ts` |
| Services, descriptions, prices per duration, photos | `src/content/services.ts` |
| Design tokens (colours, fonts, breakpoints) | `src/app/globals.css` |
| Booking dialog (service → duration → date → time → details → review) | `src/components/booking/` |
| Free-time calculation | `src/lib/booking/slots.ts` (+ tests) |
| Booking server actions (availability, request, client cancel) | `src/lib/booking/actions.ts` |
| Client's own booking page (`/afspraak/<id>?token=…`) | `src/app/afspraak/[id]/` |
| Shareable booking link (`/afspraak`, `?dienst=<slug>`) | `src/app/afspraak/page.tsx` |
| Reviews (form, approved reviews, cache refresh endpoint) | `src/components/reviews/`, `src/lib/reviews/`, `src/app/api/revalidate/` |
| Privacy policy / terms | `src/app/privacy/`, `src/app/algemene-voorwaarden/` |

### Changing a price

Update `prices` in `src/content/services.ts` **here and in `nataly-beheer`** (same file). The card shows the lowest price as "vanaf €…".

## How booking works

1. A client picks service, duration (with price), date and time. Free times come live from the database: Nataly's working hours, time off, existing bookings and the rules from Beheer → Instellingen (time steps, 15-min buffer, 12 h notice, 60-day window).
2. Sending creates a `pending` booking. The database refuses overlapping bookings, so two people can never get the same time; the loser sees "Dit tijdstip is net bezet".
3. Database triggers queue the emails; **nataly-beheer sends them** (the website sends no email itself). Nataly accepts or declines from her email or the management app.
4. Every client email links to `/afspraak/<id>?token=…`, where the client sees the status and can cancel until 24 h before. The token is an HMAC with `MANAGE_LINK_SECRET`, which must be identical in both apps.

Links to share: `/afspraak` opens the booking dialog; `/afspraak?dienst=pedicure-spa` (or `/?boek=pedicure-spa`) starts at that service.

## Reviews

Clients submit on `/review` (prefill with `?behandeling=<slug>`); reviews are stored as `pending` and Nataly gets a moderation email from nataly-beheer. Approved reviews appear on the home page. After a decision, nataly-beheer calls `POST /api/revalidate` (header `x-revalidate-secret` = `REVALIDATE_SECRET`) so the change shows immediately.

## Environment

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://natalybeautymassages.nl` |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Shared project `kqxdrzeocbguzlukqkvg`. Secret key only on the server |
| `MANAGE_LINK_SECRET` | Same value as in nataly-beheer |
| `REVALIDATE_SECRET` | Same value as `WEBSITE_REVALIDATE_SECRET` in nataly-beheer |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile widget for the domain. Required in production (forms are refused without it). Locally the Cloudflare test keys are used |

The database schema is owned by nataly-beheer (`supabase/migrations/`). After a schema change, copy its `src/lib/database.types.ts` here.

## Deployment (Vercel)

1. Import the repo in Vercel and add the environment variables above.
2. Add the domain `natalybeautymassages.nl` (and redirect `www`).
3. Enable Web Analytics and Speed Insights in the Vercel dashboard.
4. Submit `https://natalybeautymassages.nl/sitemap.xml` in Google Search Console.
