# Nataly Beauty Massages — Implementation Plan

Source design: `Nataly beauty massage website.zip` (Claude Design export)
- `Nataly Beauty Massage.dc.html` — Home (one-page: hero, trust bar, services, contact, footer, booking modal)
- `Over Mij.dc.html` — About page
- `assets/` — logo, hero photo, portraits
- `.image-slots.state.json` — the 9 images placed in the design (embedded as base64 WebP: `hero-card`, `svc-1`…`svc-7`, `final-img`, `about-portrait`)
- `archive/` — older v1 versions (ignore)

Price list: `PHOTO-2026-10-25-21-24-17.jpg`

Language: Dutch (`nl-NL`), formal "u" tone. Audience: local clients in Oosterhout, mostly on mobile.
Domain: **natalybeautymassages.nl** · Booking: **Cal.com** · Reviews: **own review page** · Stack: **Next.js** (see §2)

---

## 0. Client decisions (confirmed)

| Topic | Decision |
|-------|----------|
| Brand name | **Nataly Beauty Massages** everywhere (wordmark: "Nataly" + "beauty massages"), matching logo, price list, domain and Instagram |
| Domain | **natalybeautymassages.nl** |
| Phone | **06 1980 0612** → `tel:+31619800612` |
| WhatsApp | Same number → `https://wa.me/31619800612` |
| Public email | **natalypereyrav@gmail.com** (shown on the site; also the Cal.com account + booking notifications) |
| Address | **Only "Oosterhout"** on the site. The full address is shared in the booking confirmation. |
| Social | Instagram only: `https://www.instagram.com/beautymassagesnataly` (tracking parameter removed) |
| Booking system | **Cal.com**, with **Nataly approving every booking first** ("requires confirmation") |
| Durations | **The client chooses the duration** (30 / 60 / 75 / 90 min, where offered) when booking in Cal.com |
| Cancellation | **Cancelling/changing is possible up to 24 hours before the appointment.** Shown as a note at every booking step (see §7, Phase 5) |
| VAT | All prices **incl. BTW** |
| Prices on the site | Service cards show **"vanaf €…"** (lowest price). No full price table on the site; the price per duration is shown inside Cal.com when booking |
| Services | 6 services (§0.1). Zwangerschapsmassage and Lifting wimpers are **excluded** |
| Service name | "Therapeutic massage" → **"Therapeutische massage"** |
| Reviews | **No reviews at launch**, but a **review page where clients can leave a review after a treatment** (§7, Phase 6). Approved reviews appear on the site. |
| Review details | Link reaches clients via **all three**: automatic Cal.com email after the appointment, QR card in the salon, WhatsApp from Nataly. Shown as **first name + initial** ("Sanne V."). **No email field** on the review form. |
| Subscription plans | Dropped |
| Photos & logo | **The ones from the design** |
| KvK | Not registered yet → launch without a KvK line; add later |
| "Over Mij" footer | **Minimal footer** as in the design |
| CMS | **No CMS at launch** (§2) |

### 0.1 Services & prices (source of truth for `services.ts` and Cal.com)

| Service | 30 min | 60 min | 75 min | 90 min | Card shows | Cal.com durations |
|---------|-------:|-------:|-------:|-------:|-----------|-------------------|
| Ontspannende craniofaciale massage | €35 | €55 | €65 | €90 | 30 – 90 min · vanaf €35 | 30 / 60 / 75 / 90 |
| Ontspannende volledige lichaamsmassage | €40 | €55 | €65 | €90 | 30 – 90 min · vanaf €40 | 30 / 60 / 75 / 90 |
| Therapeutische massage | €40 | €60 | €70 | €95 | 30 – 90 min · vanaf €40 | 30 / 60 / 75 / 90 |
| Rug-, nek- en schoudermassage | €35 | €50 | €65 | — | 30 – 75 min · vanaf €35 | 30 / 60 / 75 |
| Benen- en voetenmassage | €35 | €50 | €65 | — | 30 – 75 min · vanaf €35 | 30 / 60 / 75 |
| Pedicure SPA | | €60 | | | 60 min · €60 | 60 (fixed) |

Changes vs. the design's placeholder data: all prices/durations replaced; "Therapeutic massage" renamed; Lifting wimpers removed (it's in the design, not on the price list); Ontspannende zwangerschapsmassage left out (it's on the price list but not offered on the site).

> Note: the printed price list still shows the zwangerschapsmassage and the English "Therapeutic massage". Update it if it's shared alongside the site.

---

## 1. Design review

### What's strong
- Coherent warm, premium visual language: cream/espresso palette, bronze accent, Jost + Cormorant Garamond italic pairing.
- Clear conversion focus: "Boek een Sessie" is present in the header, hero, services, contact, the final image block, a sticky mobile bar and a floating WhatsApp button.
- Responsiveness has been thought about: mobile menu, bottom-sheet modal on mobile, `dvh` + `safe-area-inset` handling, fluid type with `clamp()`.
- Small, well-scoped site (2 main pages, 6 services).
- The design's copy ("Nataly bevestigt uw afspraak persoonlijk") already matches the chosen Cal.com approval mode.

### Issues to fix during implementation

| # | Issue | Fix |
|---|-------|-----|
| 1 | **Booking form doesn't send anything**: submitting only changes what's shown on screen. | Replaced by **Cal.com** booking (real availability, approval by Nataly, confirmation emails, calendar sync). |
| 2 | **Responsiveness is driven by JS** (`window.innerWidth < 860`). Causes layout flash and wrong layout before JS loads. | Pure CSS media queries. JS only for interactivity. |
| 3 | **Clickable `<span>`/`<div>` elements** for nav, logo and footer links. Not keyboard- or screen-reader-accessible. | Real `<a href>` for navigation, `<button>` for actions. |
| 4 | **Modal accessibility**: no focus trap, focus isn't returned, mobile menu doesn't close on Escape. | Native `<dialog>` or Radix UI Dialog (focus trap, Escape, return focus, scroll lock). |
| 5 | **Inconsistent booking entry on "Over Mij"**: its CTAs link to `#contact` instead of booking. | Every "Boek" CTA on every page opens the same booking flow. |
| 6 | **Placeholder content**: fake phone/WhatsApp/email, footer legal links not linked. | Replace with the confirmed data (§0); add privacy/terms pages. |
| 7 | **Privacy/GDPR**: booking and reviews collect personal data (possibly health info for therapeutic massage). | Privacy policy naming Cal.com, Supabase, Resend and Vercel as processors; no medical questions in forms; cookieless analytics. |
| 8 | **Dead code in the design**: subscription `PLANS`, `REVIEWS`, avatar `faces`, custom dropdown. | Leave out. ⚠️ The review texts/names in the design are **invented** and must never be published. Real reviews come only from the new review page. |
| 9 | **Mixed language**: "Therapeutic massage". | → "Therapeutische massage". |
| 10 | **Hero image** is a portrait photo (992×1600) cropped into a ~62%-wide landscape area on desktop. It will look soft on large/retina screens. | Use the design photo as decided; `next/image` with tuned `object-position` per breakpoint. A higher-res original can be swapped in later without code changes. |
| 11 | **Logo** is a 375×338 PNG and fuzzy on retina. | Keep the design logo; trace it to SVG with the identical look (also favicon + OG image). |
| 12 | **Inline styles everywhere**, with colours repeated as hex literals. | Design tokens (§4). |
| 13 | **Brand name**: the design's wordmark says "beauty massage". | → "beauty massages". |
| 14 | **Service grid** was designed for 7 services; there are now 6. | Advice card spans 2 columns (§5). |

---

## 2. Stack

### **Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + TypeScript, on Vercel. Booking via Cal.com, reviews via Supabase + Resend**

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15, App Router**, all marketing pages statically prerendered | Static HTML on the CDN for top SEO/Core Web Vitals; server code available for the review form. |
| Rendering model | **React Server Components by default**; `"use client"` only for interactive leaves | Only header-scroll state, mobile menu, service picker, Cal.com trigger and review form hydrate. |
| Styling | **Tailwind CSS v4** with `@theme` tokens (+ `clsx`/`tailwind-merge`) | Maps 1:1 onto the design tokens; fast responsive variants. |
| Booking | **Cal.com** + **`@calcom/embed-react`** (popup embed, lazy-loaded) | Real-time availability from Nataly's Google Calendar, approval step, automatic emails, Dutch locale, brand colour. |
| Reviews: storage | **Supabase** (Postgres, EU region) | Small `reviews` table with a `pending`/`approved` status. Row Level Security: the public can only read approved reviews; writes go through the server only. Free tier is plenty. |
| Reviews: form | **Server Action** + `useActionState` + **Zod** | Type-safe, validates on client and server, and works before hydration. |
| Reviews: moderation | **Resend** email to Nataly with **"Publiceren" / "Verwijderen"** buttons (signed one-time links) | Nataly approves from her phone in one tap. No admin panel or login to build or maintain. |
| Spam protection | Honeypot + **Cloudflare Turnstile** (invisible) + rate limit | Protects the public review form. |
| Dialog / menu primitives | Native `<dialog>` (or Radix UI Dialog) | Service-picker sheet and mobile menu. |
| Images | **`next/image`** | AVIF/WebP, `srcset`/`sizes`, no layout shift; `priority` on hero. |
| Fonts | **`next/font/google`** (Jost, Cormorant Garamond) | Self-hosted at build time (GDPR-friendly), no layout shift. |
| Content | Typed data files (`src/content/services.ts`, `site.ts`) | Services, prices and contact details in one place. |
| SEO | Next **Metadata API**, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` | Built-in, typed. |
| Hosting | **Vercel** | Native Next.js host, preview deploys, image optimisation. |
| Analytics | **Vercel Web Analytics** + Speed Insights | Cookieless, so no cookie banner. Tracks `bookingRequested` and `reviewSubmitted` events. |
| Quality | ESLint (`next/core-web-vitals`), Prettier, `tsc --noEmit`, Playwright, Lighthouse CI | Production-grade. |

**Trade-offs to manage**
- Next.js ships the React runtime (~90–100 KB gzipped). Keep sections as Server Components.
- The Cal.com embed is heavy. **Load it only on first interaction** (hover/focus/tap on a "Boek" button, or on idle) so it never affects LCP.
- The home page stays static. When Nataly approves a review, the approve endpoint calls `revalidateTag('reviews')` so the new review appears within seconds without a rebuild.

### CMS: **no CMS at launch**
- Availability, days off and booking approvals are managed by Nataly in the **Cal.com app**. Review approval is one tap in an email.
- Texts and prices change rarely; price changes are a 5-minute edit in `services.ts` plus the Cal.com event description (README checklist).
- If she later wants to edit texts herself: add **Keystatic** (free, git-based, ~1 day).

---

## 3. Information architecture & routes

```
/                       Home (one-page)
  #behandelingen        Services
  #ervaringen           Reviews (only rendered once ≥ 1 review is approved)
  #contact              Contact / plan your visit
/over-mij               About Nataly
/review                 "Deel uw ervaring": review form (linked after a treatment; noindex)
/review/bedankt         Thank-you state (or inline success view)
/api/reviews/moderate   Signed approve/reject links from the moderation email (GET → confirm page → POST)
/privacy                Privacybeleid
/algemene-voorwaarden   Algemene voorwaarden (cancellation policy; KvK added once registered)
/404                    Not found (app/not-found.tsx)
?boek=<slug>            Opens the Cal.com popup for that service on any page (Instagram bio / WhatsApp)
```

Header nav (as designed): **Over Mij · Behandelingen · Contact** + "Boek een Sessie" CTA. The review page is not in the main nav; it gets a footer link ("Deel uw ervaring") and is reached mainly via the post-treatment link/QR code.

---

## 4. Design tokens (extracted from the design)

### Colours
| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FAF5EF` | Page background, modal bg |
| `ivory` | `#FFFDFA` | Cards, alt sections, light buttons |
| `ink` | `#2A211C` | Body text, dark cards |
| `espresso` | `#1E1713` | Hero bg, footer |
| `bronze` | `#B08358` | Primary button bg, accents, icons, review stars |
| `bronze-deep` | `#94683F` | Links, eyebrow text, button hover, icon circles; **Cal.com brand colour** |
| `bronze-darker` | `#6E4B2C` / `#7E5934` | Link hover, submit hover |
| `sand` | `#E9CFAE` | Italic accent on dark |
| `sand-soft` | `#E2C7A6`, `#C9A27E` | Eyebrows/sub-labels on dark |
| `line` | `#EADFD3` | Borders, dividers |
| `line-soft` | `#F0E6DB`, `#EFE5DA` | Card borders, inner dividers |
| `chip` | `#F3E7DA`, `#F6EDE3` | Icon chips, selected state |
| `muted` | `#6B5C50` | Secondary text |
| `muted-2` | `#7A6A5E` | Meta text (duration, labels) |
| `on-dark` | `#D9CCBF`, `#E8DDD2` | Body text on dark |
| `error` | `#B4533A` | Validation |
| `whatsapp` | `#25D366` | WhatsApp FAB |

> Action: verify contrast. `#94683F` on `#FAF5EF` is borderline for 12–13px eyebrow text, and so is `#A8998C` on `#1E1713` (footer meta). Darken slightly if they fail WCAG AA.

### Typography
- **Sans**: Jost 300/400/500 for body, UI and the H1/H2 base.
- **Serif**: Cormorant Garamond 400/500 + italic for the logo wordmark, italic accent words, prices, titles on dark and review quotes.
- Fluid scale (from design):
  - H1 hero `clamp(42px, 6vw, 82px)`, weight 300, lh 1.02, tracking −0.02em
  - H1 about `clamp(40px, 5.2vw, 68px)`
  - H2 `clamp(34px, 4.2vw, 54px)`, lh 1.08
  - Lead `clamp(16px, 1.4vw, 18px)`, lh 1.65
  - Eyebrow 12px, uppercase, tracking 0.24–0.28em, with 28px leading rule
  - Price 26px serif ("vanaf" in 13px sans before it); card title 19px/500

### Shape, spacing, effects
- Radii: pill `999px`; cards `26px`; image `18px`; dark CTA panels `30–32px`; section top `44px`; inputs `14px`.
- Containers: header `1320px`, content `1192px`.
- Section padding: `clamp(72px, 9vw, 120px)` vertical, `clamp(20px, 5vw, 64px)` horizontal.
- Shadows: card hover `0 20px 50px rgba(110,75,44,.12)` + `translateY(-3px)`; modal `0 30px 80px rgba(0,0,0,.3)`.
- Glass: `backdrop-filter: blur(14–16px)` on header, hero card, mobile CTA bar.

### Signature component: **Pill button with arrow circle**
Used ~10× in 5 variants. One `<PillButton>` with `variant` (`bronze` | `ivory` | `outline` | `ghost-dark` | `deep`), `size` (`sm` | `md` | `lg`), rendering `<Link>`/`<a>` or `<button>`.

---

## 5. Responsive strategy

Mobile-first. Breakpoints aligned with the design's thresholds:

| Name | Min width | Design behaviour |
|------|-----------|------------------|
| base | 0 | Single column; hamburger menu; sticky bottom CTA bar; WhatsApp FAB raised to 86px; full-bleed hero with vertical scrim; service picker = bottom sheet; Cal.com popup full-screen. |
| `sm` | 640px | Services 2 columns: 6 cards + advice card spanning 2 columns = 4 full rows. |
| `md` | 860px | **Desktop header** (pill nav + CTA), no bottom bar, split hero (photo 62% with left fade mask), glass hero card, service picker = centred dialog (max 580px). |
| `lg` | 1100px | Services 4 columns: row 1 = 4 cards, row 2 = 2 cards + advice card spanning 2 columns (horizontal layout) → two full rows. |
| `xl` | 1320px | Max container width reached. |

Rules:
- No JS-based layout switching. Hide/show with CSS (`md:hidden`, `hidden md:flex`).
- `auto-fit/minmax(min(100%, X), 1fr)` grids where the design already uses them.
- `100dvh`/`svh` for hero height; `env(safe-area-inset-bottom)` on sticky bar and sheets.
- Touch targets ≥ 44px; inputs at 16px font-size (no iOS zoom). Star-rating buttons ≥ 44px.
- Test matrix: 360, 390, 414, 768, 1024, 1280, 1440, 1920 px; iOS Safari, Android Chrome, desktop Chrome/Safari/Firefox/Edge; landscape phones. Includes the Cal.com popup and the review form.

---

## 6. Component inventory

`(S)` = Server Component (no client JS) · `(C)` = Client Component (`"use client"`)

```
src/
  app/
    layout.tsx                (S) <html lang="nl">, fonts, metadata defaults, JSON-LD, analytics,
                                  BookingProvider + ServicePicker
    page.tsx                  (S) Home (full footer)
    over-mij/page.tsx         (S) About (minimal footer)
    review/page.tsx           (S) review page shell + ReviewForm (noindex)
    api/reviews/moderate/route.ts   verify signed token → approve/reject → revalidateTag('reviews')
    privacy/page.tsx          (S)
    algemene-voorwaarden/page.tsx (S)
    not-found.tsx             (S)
    sitemap.ts, robots.ts
    opengraph-image.tsx
    icon.svg, apple-icon.png
    globals.css               Tailwind v4 @theme tokens, base styles
  components/
    layout/
      SiteHeader.tsx          (C) transparent→solid on scroll (home), always solid (subpages); hosts MobileMenu
      MobileMenu.tsx          (C)
      SiteFooter.tsx          (S) full footer (home): nav, services, contact, Instagram, "Deel uw ervaring"
      MinimalFooter.tsx       (S) "© … · Oosterhout" + "Terug naar home" (Over Mij, review page)
      MobileCtaBar.tsx        (S) <md only; contains a BookButton
      WhatsAppFab.tsx         (S)
      Logo.tsx                (S) SVG mark + "Nataly / beauty massages" wordmark, light/dark variants
    ui/
      PillButton.tsx          (S)
      Eyebrow.tsx             (S)
      SectionHeading.tsx      (S) H2 with italic serif accent word slot
      Icon.tsx                (S) inline SVG paths from the design (+ Instagram, star)
      CancellationNote.tsx    (S) "Annuleren of wijzigen kan tot 24 uur voor uw afspraak." (reused everywhere)
    home/
      Hero.tsx                (S)
      TrustBar.tsx            (S)
      ServicesSection.tsx     (S)
      ServiceCard.tsx         (S) "30 – 90 min" + "vanaf €35"; "Boek Nu" = BookButton
      AdviceCard.tsx          (S) wide dark card; "Vraag Advies" opens WhatsApp
      ReviewsSection.tsx      (S) approved reviews (cached, tag 'reviews'); hidden when empty
      ContactSection.tsx      (S) phone, email, hours, "Oosterhout", Instagram + dark booking CTA panel
      FinalImageCta.tsx       (S)
    about/
      AboutIntro.tsx, Pillars.tsx, Quote.tsx, CtaBanner.tsx   (S)
    booking/
      BookingProvider.tsx     (C) context: openPicker() / book(slug); lazy-loads Cal embed; handles ?boek=
      BookButton.tsx          (C) <a href="https://cal.com/<user>/<slug>"> enhanced to open the popup
      ServicePicker.tsx       (C) designed sheet/dialog: choose a service → Cal.com popup; shows CancellationNote
      cal.ts                  Cal.com namespace + UI config
    reviews/
      ReviewForm.tsx          (C) name, treatment, star rating, text, consent; useActionState; Turnstile
      StarRating.tsx          (C) accessible radio-group of 5 stars
      ReviewCard.tsx          (S)
  lib/
    reviews/
      schema.ts               Zod schema (shared client + server)
      actions.ts              "use server": submitReview: honeypot, Turnstile, rate limit, insert pending, email Nataly
      queries.ts              getApprovedReviews() with unstable_cache / fetch tag 'reviews'
      tokens.ts               HMAC-signed approve/reject tokens (expiring)
    supabase.ts               server-only client (service-role key never sent to the browser)
    cn.ts
  content/
    services.ts               title, slug, desc, prices: Partial<Record<30|60|75|90, number>>, icon, image, calSlug
                              (card text "30 – 90 min" and "vanaf €35" derived from prices)
    site.ts                   name, phone, whatsapp, email, city, hours, instagram, calUsername
  emails/
    ReviewModeration.tsx      React Email: review text + "Publiceren" / "Verwijderen" buttons
  assets/images/
public/
  logo-mark.svg
supabase/
  migrations/0001_reviews.sql reviews table + RLS policies
```

**`reviews` table:** `id`, `created_at`, `name` (first name + initial), `service_slug`, `rating` (1–5), `text`, `consent_publish` (bool), `status` (`pending` | `approved` | `rejected`), `approved_at`. RLS: anon `select` only where `status = 'approved'`; no anon insert/update (server-side only).

---

## 7. Implementation phases

### Phase 0: Project setup (½ day)
- [ ] `npx create-next-app@latest` (TypeScript strict, App Router, `src/` dir, Tailwind v4, ESLint, Turbopack); add Prettier + `prettier-plugin-tailwindcss`.
- [ ] Install `@calcom/embed-react`, `@supabase/supabase-js`, `zod`, `resend`, `@react-email/components`, `clsx`, `tailwind-merge`.
- [ ] Create Supabase project (EU region) + Resend account; connect repo to Vercel.
- [ ] `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CAL_USERNAME`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `REVIEW_NOTIFY_EMAIL=natalypereyrav@gmail.com`, `REVIEW_TOKEN_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.

### Phase 1: Assets & tokens (½–1 day)
- [ ] Extract the 9 embedded WebP images from `.image-slots.state.json` into `src/assets/images/` with meaningful names (the `svc-*` images for the removed wimpers service are dropped).
- [ ] Copy `hero.jpeg`, `nataly-portrait.png`, `nataly-towel.png` from the design.
- [ ] Trace the design logo to `logo-mark.svg` (identical look); generate favicon set + OG image.
- [ ] Fonts via `next/font/google` (Jost 300/400/500, Cormorant Garamond 400/500 + italic, Latin subset) as `--font-sans` / `--font-serif`.
- [ ] Define all tokens from §4 in `globals.css` `@theme`.

### Phase 2: Layout shell (1 day)
- [ ] Root `layout.tsx` with `lang="nl"`, default `metadata`, skip-link.
- [ ] `SiteHeader` (client): logo `<Link>`, pill nav, CTA; transparent over hero on home, solid after 40px scroll (IntersectionObserver on a sentinel); solid on subpages (`usePathname()`); state via data-attributes so server HTML is correct before hydration.
- [ ] `MobileMenu`: `aria-expanded`, Escape closes, closes on link click, body scroll lock.
- [ ] `SiteFooter` (home) and `MinimalFooter` (Over Mij, review page), with links to privacy/terms and "Deel uw ervaring".
- [ ] `MobileCtaBar` + `WhatsAppFab` (`wa.me/31619800612` with prefilled Dutch message), safe-area offsets; footer bottom padding on mobile.

### Phase 3: Home page (1.5–2 days)
- [ ] **Hero**: desktop split (image right 62%, `mask-image` fade), mobile full-bleed with vertical scrim; two CTAs; desktop-only glass card. `next/image` `priority`, `sizes="(min-width: 860px) 62vw, 100vw"`.
- [ ] **TrustBar**: overlapping rounded ivory panel, 4 icon+label items.
- [ ] **Services**: header row + 6 `ServiceCard` + wide `AdviceCard` (§5). Card meta: "30 – 90 min" left, "**vanaf** €35" right (Pedicure SPA: "60 min · €60"). "Boek Nu" opens Cal.com for that service directly. Hover lift only on `(hover: hover)`.
- [ ] **Reviews** (`#ervaringen`): cards with stars, quote (serif italic), first name + treatment. Rendered only when there's ≥ 1 approved review. Below it: "Bent u bij Nataly geweest? Deel uw ervaring →" link to `/review`.
- [ ] **Contact**: phone `tel:+31619800612`, email `mailto:natalypereyrav@gmail.com`, hours, "Oosterhout", Instagram; dark CTA panel keeps the design copy ("Nataly bevestigt uw afspraak persoonlijk") + `CancellationNote`.
- [ ] **FinalImageCta**: large rounded image with ivory notch + CTA.
- [ ] `scroll-margin-top` on sections; smooth scroll respects `prefers-reduced-motion`.

### Phase 4: Over Mij page (½–1 day)
- [ ] Intro: 3:4 portrait + caption, H1 with italic "Nataly", body copy, stats row (10 jaar · Oosterhout).
- [ ] Pillars: 4 numbered cards, 2-col → 1-col.
- [ ] Quote block.
- [ ] Dark CTA banner → opens the booking flow.
- [ ] Minimal footer.

### Phase 5: Cal.com setup & booking integration (1–1.5 days)

**Cal.com account (set up together with Nataly, using natalypereyrav@gmail.com)**
- [ ] Create account + username (e.g. `cal.com/natalybeautymassages`); profile photo, Dutch language, timezone Europe/Amsterdam.
- [ ] Connect **Google Calendar** so busy times block slots and bookings appear in her calendar.
- [ ] Availability: Mon–Sat 09:00–21:00 (adjust to real working hours); days off via the Cal.com app.
- [ ] **6 event types** (§0.1). Massages use **multiple durations** (30/60/75/90 or 30/60/75) so the **client picks the length**; Pedicure SPA fixed 60 min. Event description lists the price per duration + "Prijzen incl. BTW".
- [ ] Turn on **"Requires confirmation"** for every event type, so each booking is a request that Nataly accepts or declines in the Cal.com app or email. The client gets a "request received" email, then a confirmation (with the full address) or a decline.
- [ ] Set expectations: Nataly confirms quickly (the design says "meestal binnen enkele uren"). Turn on Cal.com email notifications on her phone.
- [ ] Per event: buffer between appointments (e.g. 15 min), minimum notice (e.g. 12 h; must leave time for approval), booking window (e.g. 60 days), location = salon address (only revealed in the confirmation).
- [ ] Booking questions: name, email, **phone** (required), optional "Opmerkingen of wensen". No medical questions.
- [ ] **24-hour cancellation rule**: text in every event description, booking page and confirmation email ("Annuleren of wijzigen kan tot 24 uur voor uw afspraak"). Check whether the Cal.com plan can block client cancel/reschedule inside 24 h; if not, the rule is enforced as policy (terms page).
- [ ] Optional: reminder emails/SMS via Cal.com Workflows (check plan).

**Website integration**
- [ ] `BookingProvider` in root layout; lazy-load `@calcom/embed-react` (`getCalApi`) on first hover/focus/tap of any booking trigger or on idle.
- [ ] Cal UI config: light theme, brand colour `#94683F`, month view, `nl` locale.
- [ ] `BookButton` is a real `<a href="https://cal.com/<user>/<slug>">`, so it works without JS and is enhanced to open the popup.
- [ ] Generic CTAs open the designed **ServicePicker** (bottom sheet on mobile, centred dialog on desktop, reusing the design's service list with "vanaf" prices). Picking a service opens the Cal.com popup.
- [ ] **CancellationNote** shown in the ServicePicker, the contact CTA panel, below the services grid, and on the terms page.
- [ ] `?boek=<slug>` opens the popup directly (read via `useSearchParams` inside `<Suspense>` so pages stay static).
- [ ] Listen to Cal embed `bookingSuccessful` → show a short message in Dutch: "Uw aanvraag is verstuurd. Nataly bevestigt deze zo snell mogelijk." + analytics event.
- [ ] "Vraag Advies" (advice card) → WhatsApp with prefilled message.

### Phase 6: Review page & moderation (1.5–2 days)

**Flow:** treatment done → client receives the review link → fills in the form → Nataly gets an email → taps "Publiceren" → the review appears on the home page.

- [ ] **How clients get the link** (confirmed: all three):
  - Cal.com **Workflow**: email ~2 hours after the appointment ends with "Hoe was uw behandeling?" + link to `/review?behandeling=<slug>` (check that the Cal.com plan includes Workflows).
  - A **QR code card** in the salon.
  - A ready-made **WhatsApp message** Nataly can send (template with the link).
- [ ] **`/review` page** (design language: cream background, eyebrow "Uw ervaring", H1 with italic accent, form in an ivory card):
  - Name (shown as first name + initial), treatment (select from the 6 services, prefilled via `?behandeling=`), **star rating 1–5**, review text (min ~20, max ~800 chars), checkbox "Ik geef toestemming om mijn review op de website te publiceren", privacy link.
  - Honeypot + Turnstile; rate limit per IP.
  - Success view: "Dank u wel! Uw review wordt na controle geplaatst."
  - `noindex`, minimal footer.
- [ ] **Server Action `submitReview`**: Zod validation → insert into Supabase with `status = 'pending'` → send **moderation email** to natalypereyrav@gmail.com (Resend) with the review and two buttons: **Publiceren** / **Verwijderen** (HMAC-signed, expiring links).
- [ ] **Moderation endpoint**: link opens a small confirm page (prevents email scanners from auto-approving via GET) → POST updates status → `revalidateTag('reviews')`.
- [ ] **Display**: `ReviewsSection` on home shows approved reviews (newest first, max ~6, "Toon meer" if needed). Hidden until the first one is approved.
- [ ] **Transparency** (EU consumer law requires saying whether/how reviews are checked to come from real clients): a short line under the reviews, e.g. "Reviews worden geplaatst door klanten na hun behandeling en door Nataly gecontroleerd voordat ze online komen." Negative but genuine reviews shouldn't be rejected just for being negative.
- [ ] Don't add review-star JSON-LD (`AggregateRating`) for self-collected reviews; Google ignores/penalises it for local businesses. Also encourage happy clients to leave a **Google review** (link on the thank-you screen).
- [ ] Privacy policy covers review data (what's stored, publication, deletion on request).

### Phase 7: SEO, legal, local presence (½–1 day)
- [ ] Per-page `metadata` (title template `%s · Nataly Beauty Massages`, description, canonical via `metadataBase = https://natalybeautymassages.nl`, Open Graph); generated OG image.
- [ ] JSON-LD `HealthAndBeautyBusiness` with name, phone, email, `address.addressLocality = Oosterhout` (no street), opening hours, `sameAs` Instagram, `makesOffer` per service with "vanaf" price.
- [ ] `app/sitemap.ts` (excludes `/review`), `app/robots.ts`.
- [ ] Privacy policy (Cal.com, Supabase, Resend, Vercel as processors; booking + review data; retention; contact) + terms with the **24-hour cancellation rule** and the booking-approval process. KvK line added once registered.
- [ ] Recommend a **Google Business Profile** (can hide the street address as a service-area business), linked to the booking URL.

### Phase 8: Accessibility, performance & QA (1 day)
- [ ] WCAG 2.2 AA: contrast audit, keyboard walkthrough, visible focus rings, Dutch alt texts, `aria-label`s, landmarks, heading order; star rating usable with keyboard and screen reader.
- [ ] `prefers-reduced-motion`: disable smooth scroll and hover lifts.
- [ ] Performance budget: LCP < 2.0s on 4G, CLS < 0.05, INP < 200ms, first-load JS < 130 KB gzipped (Cal embed excluded since it's lazy-loaded), total home weight < 900 KB. Lighthouse mobile ≥ 90 Performance, ≥ 95 A11y/Best Practices/SEO.
- [ ] `next build`: marketing routes `○ (Static)` / ISR; no accidental dynamic rendering.
- [ ] Playwright: nav, menu, service picker, Cal popup opens with the right event (network-stubbed), review form validation + submit (Supabase/Resend mocked), moderation link flow; screenshots at 390 / 768 / 1280.
- [ ] Real-device check (iPhone Safari, Android Chrome).
- [ ] End-to-end with real services: book → Nataly approves → confirmation email + calendar entry; cancel within/outside 24 h; submit review → approve → visible on home.

### Phase 9: Launch (½ day)
- [ ] Point **natalybeautymassages.nl** to Vercel (DNS); `www` → apex redirect.
- [ ] Verify the domain in Resend (SPF/DKIM) so moderation emails don't land in spam.
- [ ] Production env vars; Supabase RLS double-checked.
- [ ] Enable analytics; submit sitemap in Google Search Console.
- [ ] Update Instagram bio link; print the review QR card.

**Estimated total: ~9–11 working days** for one developer (review page + moderation adds ~1.5–2 days), excluding waiting on content.

---

## 8. Definition of done
- Pixel-close to the design at 390px and 1440px; no horizontal scroll from 320px up.
- Every "Boek" CTA on every page leads to the correct Cal.com booking (also without JavaScript); bookings arrive as **requests** that Nataly approves.
- The 24-hour cancellation note is visible before booking and in every confirmation.
- Service cards show the correct "vanaf" prices from §0.1.
- A review can be submitted on mobile in under a minute, reaches Nataly's inbox, and appears on the home page after one tap on "Publiceren".
- Lighthouse mobile: Performance ≥ 90, Accessibility/Best Practices/SEO ≥ 95.
- Keyboard-only and screen-reader usable (menu, service picker, review form).
- All placeholder data replaced; privacy policy and terms live.

---

## 9. Content to prepare (by Nataly)
- Check the service descriptions (from the design) for the 6 services.
- Real working hours (design says Mon–Sat 09:00–21:00).
- Salon address (only used in Cal.com confirmations, not on the site).

---

## 10. Still open

Nothing. All client questions are answered. Remaining inputs are the content items in §9.

---

## 11. Implementation status (25 Oct 2026)

Phases 0–6 built; QA done on the production build (screenshots at 390 / 768 / 1440 px, no horizontal overflow, review form tested end-to-end up to the database step). Not done yet: Cal.com account setup, Supabase/Resend/Turnstile accounts, Vercel deploy and domain (Phases 5 account part, 9). Setup steps are in `README.md`.

Deviations from the plan:
- **Next.js 16.4** (current release) instead of 15, with Cache Components; reviews use `"use cache"` + `cacheTag("reviews")` and `updateTag` on approval.
- **Logo kept as the design's PNG**: it's a metallic texture, which an SVG trace would lose. At header size the 375 px source is sharp on retina.
- **Over Mij header** reuses the site header (incl. the mobile menu) instead of the design's logo-plus-button only, so phone visitors can navigate.
- **Over Mij pillar 02** ("Nieuwe Schoonheidsbehandelingen") rewritten to "Verzorging van top tot teen" because Lifting wimpers was removed. Please check.
- **Terms page** only states what was confirmed (approval, 24 h cancellation, prices incl. BTW). No no-show fee or payment moment; add them if Nataly wants them.
- **Privacy policy and terms** are a solid starting text, not legal advice; have them checked.
