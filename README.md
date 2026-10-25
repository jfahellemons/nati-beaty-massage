# Nataly Beauty Massages

Website for Nataly Beauty Massages (Oosterhout): Next.js 16 (App Router, Cache Components) + Tailwind CSS v4, bookings via Cal.com, client reviews via Supabase + Resend. See `IMPLEMENTATION_PLAN.md` for the decisions behind it.

## Development

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional locally
npm run dev                  # http://localhost:3000
```

| Script | |
|---|---|
| `npm run build` | Production build. All public pages are static (`○`). |
| `npm run lint` / `npm run typecheck` / `npm run format` | Quality checks. |

Without Supabase/Resend credentials the site works fully; the reviews section stays hidden and the review form shows a friendly error on submit.

## Where things live

| What | File |
|---|---|
| Contact details, hours, Instagram, Cal.com username, cancellation note | `src/content/site.ts` |
| Services, descriptions, prices per duration, photos | `src/content/services.ts` |
| Design tokens (colours, fonts, breakpoints) | `src/app/globals.css` |
| Booking (Cal.com popup, service picker, `?boek=<slug>`) | `src/components/booking/` |
| Reviews (form, server actions, moderation) | `src/components/reviews/`, `src/lib/reviews/`, `src/app/review/` |
| Privacy policy / terms | `src/app/privacy/`, `src/app/algemene-voorwaarden/` |

### Changing a price

1. Update `prices` in `src/content/services.ts` (the card shows the lowest one as "vanaf €…").
2. Update the price list in that service's Cal.com event description.

## Cal.com setup (with Nataly)

1. Create the account with `natalypereyrav@gmail.com`; username must match `NEXT_PUBLIC_CAL_USERNAME` (default `natalybeautymassages`). Language Dutch, timezone Europe/Amsterdam.
2. Connect Google Calendar.
3. Availability: Mon–Sat 09:00–21:00 (adjust to real hours).
4. Create one event type per service. **The event slug must equal the service `slug`:**

   | Event slug | Durations (multiple durations option) |
   |---|---|
   | `therapeutische-massage` | 30 / 60 / 75 / 90 |
   | `volledige-lichaamsmassage` | 30 / 60 / 75 / 90 |
   | `craniofaciale-massage` | 30 / 60 / 75 / 90 |
   | `rug-nek-schoudermassage` | 30 / 60 / 75 |
   | `benen-voetenmassage` | 30 / 60 / 75 |
   | `pedicure-spa` | 60 (fixed) |

5. For every event: turn on **Requires confirmation**, add the prices per duration and "Annuleren of wijzigen kan tot 24 uur voor uw afspraak." to the description, require a phone number, set the salon address as location, and add a buffer (e.g. 15 min) and a minimum notice (e.g. 12 h).
6. Review link: add a Workflow (if the plan includes it) that emails `https://natalybeautymassages.nl/review?behandeling=<slug>` a few hours after the appointment. Also print a QR code to `/review` for the salon and save a WhatsApp template with the link.

## Reviews setup

1. **Supabase** (EU region): create a project and run `supabase/migrations/0001_reviews.sql` in the SQL editor. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server only).
2. **Resend**: verify the domain `natalybeautymassages.nl` (SPF/DKIM), set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. Moderation emails go to `REVIEW_NOTIFY_EMAIL`.
3. **Token secret**: `REVIEW_TOKEN_SECRET=$(openssl rand -base64 48)`.
4. **Cloudflare Turnstile**: create a widget for the domain and set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. In production the form rejects submissions when these are missing.

Flow: client submits on `/review` → stored as `pending` → Nataly gets an email with **Publiceren / Verwijderen** → the link opens `/review/beheer`, she confirms → the review appears on the home page (cache tag `reviews`).

## Deployment (Vercel)

1. Import the repo in Vercel and add the environment variables from `.env.example`.
2. Add the domain `natalybeautymassages.nl` (and redirect `www`).
3. Enable Web Analytics and Speed Insights in the Vercel dashboard.
4. Submit `https://natalybeautymassages.nl/sitemap.xml` in Google Search Console.
