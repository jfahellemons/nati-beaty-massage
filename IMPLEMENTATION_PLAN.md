# Nataly Beauty Massages — Implementation Plan (website)

Source design: `Nataly beauty massage website.zip` (Claude Design export: `Nataly Beauty Massage.dc.html`, `Over Mij.dc.html`, `assets/`, `.image-slots.state.json`)
Price list: `PHOTO-2026-10-25-21-24-17.jpg`

Language: Dutch (`nl-NL`), formal "u" tone. Audience: local clients in Oosterhout, mostly on mobile.
Domain: **natalybeautymassages.nl** · Booking: **own reservation system** (no Cal.com, no Google Calendar) · Stack: **Next.js 16** (§2)

**Two apps, one database:**
- **Website** (this repo, `nati-beaty-massage`): public pages, the client booking flow, the client's booking page, the review form. **This plan.**
- **Beheer** (separate repo `nataly-beheer`, `beheer.natalybeautymassages.nl`): Nataly's management, all emails, scheduled jobs, review moderation, database schema. **See `IMPLEMENTATION_PLAN.md` in the `nataly-beheer` repo.**

**Status (26 Oct 2026):** website phases W1–W5 are done (branch `feat/website-v1`): own booking dialog, client booking page, reviews without own email sending, Cal.com and Resend removed. Remaining: launch (§8, "Launch"). See "Implementation notes" below.

---

## 0. Client decisions (confirmed)

| Topic | Decision |
|-------|----------|
| Brand name | **Nataly Beauty Massages** everywhere (wordmark "Nataly" + "beauty massages") |
| Domain | **natalybeautymassages.nl** (website), **beheer.natalybeautymassages.nl** (management) |
| Phone / WhatsApp | **06 1980 0612** → `tel:+31619800612`, `https://wa.me/31619800612` |
| Email | **natalypereyrav@gmail.com**: shown on the site, receives requests and notifications, only login for the management app |
| Address | **Only "Oosterhout"** on the site. The full address is sent in the booking confirmation |
| Social | Instagram only: `https://www.instagram.com/beautymassagesnataly` |
| Booking system | **Own reservation system.** Clients book on the website; Nataly manages in the separate management app. No Cal.com, no Google Calendar |
| Approval | **Nataly approves every booking first.** A booking is a request until she accepts it |
| Durations | **The client chooses the duration** (30 / 60 / 75 / 90 min, where offered) and sees the price per duration while booking |
| Cancellation | **Cancelling is possible online up to 24 hours before the appointment**, enforced by the system; after that, clients are pointed to WhatsApp/phone |
| VAT | All prices **incl. BTW** |
| Prices on the site | Service cards show **"vanaf €…"**; the exact price per duration appears in the booking flow |
| Services | 6 services (§0.1). Zwangerschapsmassage and Lifting wimpers are **excluded** |
| Reviews | Review form on the website; Nataly approves in the management app; shown as **first name + initial**; **no email field** |
| Review link | Via **all three**: automatic email after the appointment, QR card in the salon, WhatsApp from Nataly |
| Photos & logo | The ones from the design |
| KvK | Not registered yet → launch without a KvK line |
| "Over Mij" footer | Minimal footer as in the design |
| CMS | No CMS at launch (§2) |

### 0.1 Services & prices (source of truth: `src/content/services.ts`)

| Service | slug | 30 min | 60 min | 75 min | 90 min | Card shows |
|---------|------|-------:|-------:|-------:|-------:|-----------|
| Therapeutische massage | `therapeutische-massage` | €40 | €60 | €70 | €95 | 30 – 90 min · vanaf €40 |
| Ontspannende volledige lichaamsmassage | `volledige-lichaamsmassage` | €40 | €55 | €65 | €90 | 30 – 90 min · vanaf €40 |
| Ontspannende craniofaciale massage | `craniofaciale-massage` | €35 | €55 | €65 | €90 | 30 – 90 min · vanaf €35 |
| Rug-, nek- en schoudermassage | `rug-nek-schoudermassage` | €35 | €50 | €65 | — | 30 – 75 min · vanaf €35 |
| Benen- en voetenmassage | `benen-voetenmassage` | €35 | €50 | €65 | — | 30 – 75 min · vanaf €35 |
| Pedicure SPA | `pedicure-spa` | | €60 | | | 60 min · €60 |

> The management app needs the same service list (titles, durations, prices) for manual bookings and emails. The website's `services.ts` stays the source; a copy lives in `nataly-beheer` and must be updated together (checklist in both READMEs).
>
> The printed price list still shows the zwangerschapsmassage and the English "Therapeutic massage". Update it if it's shared alongside the site.

---

## 1. Design review (summary)

**Strong:** coherent warm, premium look (cream/espresso, bronze accent, Jost + Cormorant Garamond); booking CTA everywhere; responsiveness already considered (bottom-sheet modal, `dvh`, safe areas, fluid type).

**Fixed in the build:**

| Issue in the design | Fix |
|---|---|
| Booking form sent nothing | Own reservation system (§7) |
| Layout switched by JS (`innerWidth < 860`) | Pure CSS breakpoints |
| Clickable `<span>`/`<div>` | Real links and buttons |
| Modal without focus handling | Native `<dialog>` |
| "Over Mij" CTAs went to `#contact` | Every CTA opens the same booking flow |
| Placeholder phone/email, dead legal links | Real data, privacy + terms pages |
| Invented reviews in design code | Removed; only real, moderated reviews |
| "Therapeutic massage", "beauty massage" | "Therapeutische massage", "beauty massages" |
| Grid designed for 7 services | 6 services + advice card spanning 2 columns |

---

## 2. Stack (website)

**Next.js 16 (App Router, Cache Components) + React 19 + Tailwind CSS v4 + TypeScript, on Vercel. Data in the shared Supabase database.**

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16**, marketing pages statically prerendered | Fast, SEO-friendly; server code for booking requests and reviews |
| Rendering | Server Components by default; `"use client"` only for interactive parts | Small client JS |
| Styling | **Tailwind CSS v4**, tokens in `src/app/globals.css` | Matches the design 1:1 |
| Database | **Supabase Postgres (EU region)**, shared with the management app | Schema and migrations are owned by `nataly-beheer`; this repo uses generated types |
| Server logic | **Server Actions** + **Zod** | Typed, validated on client and server |
| Date/time | **`date-fns` + `@date-fns/tz`**, stored in UTC, calculated in `Europe/Amsterdam` | Correct across summer/winter time |
| Emails | **None sent from the website.** Database triggers queue them; the management app sends them | One place for templates and retries |
| Spam protection | Honeypot + **Cloudflare Turnstile** + rate limit | On the booking and review forms |
| Images / fonts | `next/image`, `next/font/google` | Optimised, self-hosted fonts |
| SEO | Metadata API, JSON-LD, sitemap, robots, OG image | Built in |
| Analytics | Vercel Web Analytics + Speed Insights | Cookieless; events `booking_requested`, `review_submitted` |
| Quality | ESLint, Prettier, `tsc`, Vitest (slot logic), Playwright (flows) | |

**Removed from the website:** Cal.com embed, Resend, React Email, review moderation pages and tokens (all move to the management app or disappear).

**CMS:** none at launch. Prices change in `services.ts` (+ the copy in `nataly-beheer`). Working hours, days off and booking settings are managed by Nataly in the management app.

---

## 3. Routes (website)

```
/                            Home: hero, trust bar, #behandelingen, #ervaringen (once reviews exist), #contact
/over-mij                    About Nataly
/afspraak                    No-JS fallback of the booking flow (?dienst=<slug>)          noindex
/afspraak/[id]?token=…       Client's booking page: status, details, cancel (until 24 h)  noindex
/review                      Review form (?behandeling=<slug> prefills)                  noindex
/api/revalidate              Called by the management app to refresh cached reviews (secret)
/privacy, /algemene-voorwaarden, 404
?boek=<slug>                 Opens the booking flow for that service on any page
```

Removed: `/review/beheer` (moves to the management app).

---

## 4. Design tokens

Implemented in `src/app/globals.css` (`@theme`); the management app copies the same `@theme` block. Key values:

- Colours: cream `#FAF5EF`, ivory `#FFFDFA`, ink `#2A211C`, espresso `#1E1713`, bronze `#B08358`, bronze-deep `#94683F`, sand `#E9CFAE`, line `#EADFD3`, muted `#6B5C50`, error `#B4533A`, WhatsApp `#25D366`.
- Fonts: Jost 300/400/500 (sans), Cormorant Garamond 400/500 + italic (serif accents, prices).
- Radii: pills 999px, cards 26px, images 18px, dark panels 30–32px, inputs 14px.
- Breakpoints (all px; mixing px and rem breaks Tailwind's order): sm 640, md 860, lg 1100, xl 1320.
- Signature component: pill button with arrow circle (`src/components/ui/pill.tsx`).

---

## 5. Responsive strategy (booking flow)

| Width | Behaviour |
|---|---|
| < 860px | Booking flow in a **bottom sheet** (max 92dvh) with step header, back button and a sticky footer ("Gekozen: … · €…" + Volgende). Month calendar full width; time slots in a 3-column grid of 44px+ buttons |
| ≥ 860px | Booking flow in the **centred dialog** (max ~640px). Calendar and time slots side by side from the date step |

Everything else as built: CSS-only layout switching, safe-area insets, touch targets ≥ 44px, 16px inputs. Test at 360, 390, 768, 1024, 1440 px on iOS Safari and Android Chrome.

---

## 6. Architecture (website)

### Keep (already built)
```
src/app/            layout, home, over-mij, review, privacy, terms, 404, sitemap, robots, OG image
src/components/     layout/*, home/*, ui/*, reviews/{ReviewForm, Stars}
src/content/        site.ts, services.ts
src/lib/            supabase.ts, cn.ts, reviews/{schema, queries}
```

### Remove
- `@calcom/embed-react`, `resend`, `@react-email/components` dependencies.
- Cal.com loading in `BookingProvider`; `calUrl()` and `cal` settings in `site.ts`.
- `src/app/review/beheer/`, `src/emails/`, `src/lib/reviews/tokens.ts`, moderation code and email sending in `src/lib/reviews/actions.ts` (the trigger now queues the moderation email).
- `supabase/migrations/` (moves to `nataly-beheer`).

### Add / change
```
src/components/booking/
  BookingProvider.tsx     (C) open(slug?) → opens BookingFlow; keeps ?boek=
  BookButton.tsx          (C) without JS: links to /afspraak?dienst=<slug>
  BookingFlow.tsx         (C) multi-step sheet/dialog (§7.1)
  steps/                  ServiceStep, DurationStep, DateStep (MonthCalendar), TimeStep, DetailsStep, ReviewStep, DoneStep
src/app/afspraak/page.tsx            no-JS fallback
src/app/afspraak/[id]/page.tsx       client's booking page + cancel
src/app/api/revalidate/route.ts      revalidateTag('reviews', 'max') with secret
src/lib/booking/
  slots.ts                pure free-time calculation (unit-tested)
  schema.ts               Zod schemas
  actions.ts              "use server": getMonthAvailability, getDaySlots, requestBooking, cancelBooking
  queries.ts              server-only data access
src/lib/database.types.ts generated in nataly-beheer, copied here
```

---

## 7. Booking on the website

### 7.1 Client flow
1. **Behandeling**: the 6 services with icon, duration range and "vanaf" price (skipped when opened from a service card or `?boek=`).
2. **Duur**: options with price per duration, e.g. "60 min · €60" (skipped for Pedicure SPA).
3. **Datum**: month calendar from today; days without free time disabled; within the 60-day window.
4. **Tijd**: free start times in 15-minute steps, grouped "Ochtend / Middag / Avond".
5. **Gegevens**: voornaam*, achternaam*, e-mailadres*, telefoonnummer*, "Opmerkingen of wensen" (optional, max 500, hint: no medical details), consent to terms and privacy*.
6. **Overzicht**: service, duration, date, time, price, cancellation note → **"Aanvraag versturen"**.
7. **Verstuurd**: "Uw aanvraag is verstuurd. Nataly bevestigt deze persoonlijk, meestal binnen enkele uren. U ontvangt een e-mail ter bevestiging."

If the time was taken in the meantime, the database refuses it; the flow returns to step 4 with "Dit tijdstip is net bezet. Kies een ander tijdstip." and refreshed times.

### 7.2 Rules (read from `booking_settings`, managed in the management app)
Slot step 15 min · buffer 15 min after each appointment · minimum notice 12 h · booking window 60 days · appointment must end by closing time · online cancel until 24 h before start. `pending` and `confirmed` bookings occupy their time.

### 7.3 Free-time calculation (`slots.ts`, pure function, unit-tested)
Input: date, duration, opening hours for that weekday, time off, occupied ranges (pending + confirmed, each extended by the buffer), settings, "now".
1. Open intervals for the day in Europe/Amsterdam, minus time off.
2. Candidate starts every 15 min from opening; keep a start if `[start, start + duration + buffer)` overlaps nothing, `start + duration ≤ close`, `start ≥ now + 12 h`, within 60 days.
3. Store UTC, display local time.

Month view: one query for the month's bookings/time off, then step 2 per day. Tests cover DST change days, buffers, edges of opening hours and time off spanning midnight. Free times are fetched live (not cached), so changes in the management app show immediately.

### 7.4 Requesting a booking (`requestBooking`)
Zod validation → Turnstile + honeypot + rate limit (~5 per IP per hour) → re-check the slot → insert `pending` booking with a random manage token (stored hashed). The database's exclusion constraint guarantees no double bookings; a database trigger queues the "aanvraag ontvangen" email to the client and the request email to Nataly (sent by the management app).

### 7.5 Client's booking page (`/afspraak/[id]?token=…`)
Linked from every client email. Shows status (aangevraagd / bevestigd / afgewezen / verlopen / geannuleerd), service, duration, date/time, price. **Annuleren** is available until 24 h before the start; after that: "Annuleren is niet meer online mogelijk. Neem contact op via WhatsApp of bel 06 1980 0612." Cancelling sets status `cancelled` (by client); the trigger queues the email to Nataly.

### 7.6 Reviews (website part)
The review form stays as built, but `submitReview` only inserts the `pending` review; the database trigger queues the moderation email, which the management app sends. Approved reviews are read with `"use cache"` + `cacheTag('reviews')`; the management app calls `/api/revalidate` after publishing or removing.

### 7.7 Privacy & terms
- Privacy policy: processors Supabase, Resend (via the management app), Vercel, Cloudflare; what is stored for bookings and reviews; 12-month retention; no Cal.com/Google Calendar.
- Terms: request + approval by Nataly, online cancellation until 24 h before, after that by phone/WhatsApp.

---

## 8. Phases (website)

### Done ✅ (branch `feat/website-v1`)
- Setup, assets/tokens, layout (header, footers, mobile bar, WhatsApp), home, Over Mij.
- Review form and approved reviews on home (moderation moves to the management app).
- SEO (metadata, JSON-LD, sitemap, robots, OG image), privacy and terms pages.
- QA on the production build at 390 / 768 / 1440 px.

### Depends on `nataly-beheer` phase B2
The database schema (bookings, opening hours, time off, settings, outbox, triggers) is created in the management repo. The website phases below start once B2 is done and types are generated.

### W1: Free-time engine (1 day)
- [ ] `slots.ts` + Vitest tests (DST, buffers, notice, window, time off, edges).
- [ ] `queries.ts` + `getMonthAvailability`, `getDaySlots`.

### W2: Booking flow UI (2 days)
- [ ] `BookingFlow` sheet/dialog with steps 1–7, back navigation, sticky summary footer, focus management per step.
- [ ] Month calendar (keyboard accessible, disabled days announced) and time-slot grid with empty state.
- [ ] Details form (Zod, Dutch inline errors), Turnstile, consent.
- [ ] `requestBooking` action incl. "net bezet" handling; analytics event.
- [ ] Rewire `BookingProvider`, `BookButton`, `ServicePicker`, `?boek=`; remove Cal.com.
- [ ] No-JS fallback at `/afspraak`.

### W3: Client booking page (½ day)
- [ ] `/afspraak/[id]` with token check, status display, cancel with 24 h rule.

### W4: Reviews & clean-up (½ day)
- [ ] `submitReview` without email sending; remove `/review/beheer`, `src/emails/`, tokens, Resend; `/api/revalidate`.
- [ ] Move `supabase/migrations/` to `nataly-beheer`; add generated `database.types.ts`.
- [ ] Privacy, terms, contact/picker copy (§7.7); README updated (no Cal.com guide).

### W5: QA (1 day)
- [ ] Playwright: full booking request, "net bezet" race (two parallel requests → one wins), cancel before/after the 24 h cut-off, no-JS fallback.
- [ ] Phone check (iPhone Safari, Android Chrome) of sheet, calendar and time grid.
- [ ] Accessibility: keyboard through the whole flow, screen-reader labels for calendar and times.

**Estimate website: ~5 working days. Management app: ~7.5–8 days (plan in `nataly-beheer`). Together ~12–13 days.**
The split costs ~1–2 extra days compared with one app (two projects, shared types, outbox/webhook), in exchange for a lighter website and one place for all emails and data rules.

### Launch (both apps, ½ day)
- [ ] Supabase project (EU), migrations from `nataly-beheer`; Resend domain verified; Turnstile widgets for both domains.
- [ ] Two Vercel projects: `natalybeautymassages.nl` and `beheer.natalybeautymassages.nl`; env vars.
- [ ] Nataly: first login, set working hours, add the agenda feed to her phone, test booking end to end.
- [ ] Review QR card, Instagram bio link, Google Business Profile, Search Console sitemap.

### Environment variables (website)
`NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `REVALIDATE_SECRET`.
Removed: `NEXT_PUBLIC_CAL_USERNAME`, `RESEND_*`, `REVIEW_NOTIFY_EMAIL`, `REVIEW_TOKEN_SECRET`.

---

## 9. Definition of done (website)
- A client can request an appointment on a phone in under 2 minutes, choosing service, duration (with price), date and time.
- Free times reflect Nataly's working hours, time off and existing bookings immediately.
- Double bookings are impossible, also with simultaneous requests.
- The client's booking page shows the current status; online cancellation works until 24 h before and is refused after that.
- Times are correct across the summer/winter time change.
- Lighthouse mobile: Performance ≥ 90, Accessibility/Best Practices/SEO ≥ 95; no horizontal scroll from 320px.
- Keyboard and screen-reader usable throughout the booking flow.
- Privacy policy and terms match how the system works.

---

## 10. Content to prepare (by Nataly)
- Check the service descriptions for the 6 services.
- Real working hours (default Mon–Sat 09:00–21:00); she can change them herself in the management app.
- Salon address (only used in confirmation emails).

---

## 11. Assumed defaults (change if wanted)
| Topic | Default |
|---|---|
| Time slot step | 15 min |
| Buffer between appointments | 15 min |
| Minimum notice / booking window | 12 h / 60 days |
| Pending request holds the slot | Yes, expires after 24 h |
| Reminder email | 24 h before |
| Review request email | 2 h after the appointment |
| Client data retention | 12 months after the appointment |

---

## 12. Deviations from the original design (already built)
- **Logo** kept as the design's PNG (metallic texture would be lost as SVG).
- **Over Mij header** uses the full site header incl. mobile menu.
- **Over Mij pillar 02** rewritten to "Verzorging van top tot teen" because Lifting wimpers was removed. Please check.
- **Terms page** states only confirmed rules (no no-show fee or payment moment).
- **Privacy policy and terms** are a starting text, not legal advice; have them checked.

---

## 13. Implementation notes (W1–W5, 26 Oct 2026)

**Built and tested end-to-end** against the shared Supabase database, with nataly-beheer sending the emails (to Resend's test address):
- Booking on a phone: service card → date (only days with free times) → time → details → review (Turnstile) → "Dank u". First free time respects the 12 h notice; the last time still ends by closing.
- "Net bezet": when someone takes the same time first, the database refuses the second request; the client returns to the time step with a message and refreshed times (incl. the 15-min buffer on both sides).
- Client booking page: wrong token refused; status shown; cancelling works until 24 h before, after that the page points to WhatsApp/phone; Nataly and the client get emails.
- `/afspraak?dienst=…` and `/?boek=…` open the dialog at that service; back to the service list always possible; Escape closes.
- Review form stores a pending review (moderation email via nataly-beheer). `/api/revalidate` refuses calls without the secret.
- Unit tests for the free-time calculation (9), incl. both summer/winter time change days.

**Deviations from the plan:**
- **No booking without JavaScript.** The spam check (Turnstile) needs JavaScript, so a no-JS form could never pass. `/afspraak` is instead a shareable booking link that opens the dialog; without JavaScript it shows phone and WhatsApp.
- **Client booking links** use an HMAC token shared with nataly-beheer (`MANAGE_LINK_SECRET`) instead of a stored hash.
- The database schema and migrations live in nataly-beheer only; this repo has a copy of the generated types.
