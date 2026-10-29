# Motion & Animation Plan — Nataly Beauty Massages

Goal: make the site feel calm, warm and alive, like walking into the salon, without slowing it down or getting in the way of booking.

Status: **implemented (M1–M6), with the defaults from §12:** subtle intensity, one WhatsApp pulse per visit, mobile booking bar hidden while the hero buttons are visible.

Deviations from the plan:
- Booking steps and calendar months slide with keyed CSS enter animations (`animate-step-forward/back`) instead of `<ViewTransition>`: simpler inside the native `<dialog>` and works in every browser. Page-to-page transitions do use `<ViewTransition>` (`src/components/motion/PageTransition.tsx`).
- The scroll-reveal observer starts after the page has loaded, so it never touches elements React is still hydrating.

Code: `src/components/motion/` (RevealObserver, inline init script, PageTransition, CountUp, `delay()`), motion tokens and keyframes in `src/app/globals.css`.

---

## 1. Motion principles

| Principle | What it means here |
|---|---|
| **Calm, not playful** | Slow ease-outs, small distances (8–24 px), no bounce, no spring overshoot, no spinning. A spa, not an app launch. |
| **Motion explains, it doesn't decorate** | Things animate when they *arrive* (scroll into view, dialog opens, step changes). Nothing loops forever. |
| **Content first** | Text is never hidden behind an animation for long: reveals finish within ~700 ms, and nothing waits for JavaScript to become readable. |
| **Cheap to render** | Only `transform`, `opacity`, `filter` (blur ≤ 4 px) and `clip-path`. No animating width/height/top/left/margin, so no layout shift. |
| **Respect the visitor** | `prefers-reduced-motion: reduce` shows everything instantly (the global rule in `globals.css` already does this; the reveal system will honour it too). |
| **No new dependencies** | CSS + Tailwind v4 + React 19.3 `<ViewTransition>` + one tiny `IntersectionObserver`. No Framer Motion / GSAP / Lottie (≈ 0 KB extra, about 1 KB JS in total). |

---

## 2. Foundation (do first)

### 2.1 Motion tokens in `src/app/globals.css` (`@theme`)

```css
--ease-soft: cubic-bezier(0.22, 1, 0.36, 1);   /* main ease-out: quick start, long gentle landing */
--ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);
--duration-quick: 200ms;   /* hovers, presses */
--duration-base: 400ms;    /* menus, dialogs, step changes */
--duration-slow: 700ms;    /* scroll reveals */
--duration-hero: 1600ms;   /* hero image settle */
```

Tailwind v4 exposes these as `ease-soft`, `duration-base`, etc., so every component uses the same timing.

### 2.2 Keyframes (also in `@theme`, so `animate-*` utilities exist)

| Name | Effect | Used for |
|---|---|---|
| `fade-up` | opacity 0→1, translateY 16px→0 | Text blocks, cards |
| `fade-in` | opacity 0→1 | Images, backdrops |
| `settle` | scale 1.06→1 (opacity stays 1) | Hero photo |
| `reveal-clip` | clip-path `inset(8% 8% 8% 8% round 26px)` → `inset(0 round 26px)` | Large photos (Contact, Over Mij) |
| `line-grow` | scaleX 0→1 (origin left) | The small line in front of eyebrows |
| `soft-pulse` | ring scale 1→1.6, opacity .5→0 | WhatsApp button (once, see §5) |

### 2.3 Scroll-reveal system

A single, reusable mechanism instead of animation code per section.

- **Markup:** add `data-reveal` to any element (optionally `data-reveal="clip"` / `"fade"`), and `style={{ "--i": index }}` on list items for stagger (`animation-delay: calc(var(--i, 0) * 80ms)`).
- **`src/components/motion/RevealObserver.tsx`** (client, rendered once in `layout.tsx`):
  - sets `data-motion` on `<html>` (only then does CSS hide not-yet-revealed elements, so **without JS everything is simply visible**);
  - one `IntersectionObserver` (`rootMargin: "0px 0px -10% 0px"`) sets `data-revealed` and then stops observing that element (plays **once**);
  - re-scans after client navigation (`usePathname`) so subpages work too;
  - does nothing when `prefers-reduced-motion: reduce` matches.
- **CSS:** `html[data-motion] [data-reveal]:not([data-revealed]) { opacity: 0 }`, and `[data-revealed]` runs the matching keyframe with `var(--duration-slow) var(--ease-soft) both`.
- Elements already in view on load (above the fold) reveal immediately, with no flash, because the observer fires on its first callback in the same frame.

Why not CSS scroll-driven animations (`animation-timeline: view()`) for this? They scrub with the scroll position (half-visible = half-faded), which feels restless for a calm brand, and Firefox support is still incomplete. We use them only for the one parallax effect in §3, as an enhancement.

---

## 3. Hero (home page), first impression

Plays once on page load, total ≈ 1.2 s, staggered top-to-bottom:

| Element | Animation | Delay |
|---|---|---|
| Photo | `settle` (scale 1.06→1, 1600 ms). **Opacity stays 1**: it's the LCP image, so it's never hidden. | 0 |
| Eyebrow line + "Massage & Schoonheid" | `line-grow` then `fade-in` | 100 ms |
| H1 line 1 / line 2 | `fade-up`, each line separately | 200 / 320 ms |
| Intro text | `fade-up` | 440 ms |
| Buttons | `fade-up` | 560 ms |
| Glass card (desktop) | `fade-up` + blur 8→0 px | 800 ms |

Extra, as an enhancement only (`@supports (animation-timeline: scroll())`):
- Gentle **parallax**: the photo moves up ~6% slower than the page while the hero scrolls out. Pure CSS, no JS. Browsers without support just scroll normally.

Header (already transitions background/padding on scroll): switch it to the shared `duration-base ease-soft` tokens so it matches the rest.

---

## 4. Scroll reveals per section

| Section | Effect |
|---|---|
| **TrustBar** | 4 items `fade-up` with 80 ms stagger; icons draw in (SVG `stroke-dashoffset`, 600 ms). |
| **Behandelingen**, heading block | Eyebrow line grows, heading + text `fade-up`. |
| **Behandelingen**, cards | `fade-up`, stagger 80 ms per card (max 4 per row, so the last card never waits > 400 ms). |
| **Card hover** (existing lift) | Add: photo zooms 1→1.05 inside its rounded frame (700 ms), arrow in the book button nudges 3 px right. Only on `@media (hover: hover)`. |
| **Reviews** | Cards `fade-up` with stagger; stars fill in left-to-right (opacity stagger 60 ms). |
| **Contact**, list | Contact rows `fade-up` with stagger; icons get a soft bronze background on hover. |
| **Contact**, large photo | `reveal-clip`: opens from a slightly inset rounded rectangle to full size. |
| **Footer** | Single `fade-in` of the content block. Nothing more: the footer should be calm. |
| **Over Mij** | Portrait `reveal-clip`; intro text `fade-up`; "10 jaar ervaring" counts 0→10 once (≈ 900 ms, `tabular-nums`, final value is in the HTML for SEO and no-JS); werkwijze items stagger; quote fades in word-group by word-group (3–4 groups, not per letter). |
| **Legal pages / review page** | Only the page-level transition (§7). Long text pages don't need reveals. |

---

## 5. Micro-interactions

| Element | Interaction |
|---|---|
| **Pill buttons** (`pill.tsx`) | Hover: background colour + icon/arrow nudges 3 px (`duration-quick`). Press: `scale(0.98)`. |
| **Text links** (footer, "Ontdek alle behandelingen") | Underline grows from left (`scaleX` on a pseudo-element) instead of instant colour change. |
| **Desktop nav** | The active/hover highlight **slides** between items (one shared pill moved with `transform`, anchored by measured offsets) instead of popping per item. |
| **Mobile menu** | Opens with height via `grid-template-rows: 0fr → 1fr` (no JS measuring), links `fade-up` with 50 ms stagger; closes in reverse (keep it mounted, toggle `data-open`). The hamburger → X already animates. |
| **WhatsApp button** | Fades/scales in 600 ms after load. After 8 s on the page: **one** soft pulse ring, once per session (`sessionStorage`). Never loops. |
| **Mobile booking bar** | Slides up from below once the hero's buttons scroll out of view, slides away when they're visible again (avoids two "Boek" buttons on screen at once). |
| **Form fields** (review form, booking details) | Focus: border colour + label colour transition; error messages `fade-up` 8 px. |

---

## 6. Booking dialog (`BookingFlow.tsx`)

This is where motion helps the most, because it shows clients where they are in the 7 steps.

| Moment | Animation | How |
|---|---|---|
| **Open** | Backdrop fades in; panel `fade-up` 24 px + scale .97→1 (`duration-base`). On phones: slides up from the bottom like a sheet. | Pure CSS on `<dialog>` with `@starting-style` + `transition-behavior: allow-discrete` (Tailwind `starting:` variant). |
| **Close** | Reverse, 250 ms. | Same CSS (`overlay` + `display` allow-discrete). |
| **Next step** | Old step slides out to the left + fades, new step slides in from the right (24 px). | React `<ViewTransition>` around the step body + `addTransitionType("forward")` inside the existing `startTransition` calls. |
| **Back** | Mirror: slide right. | `addTransitionType("back")`. |
| **Month change** in calendar | Days grid slides in the direction of the arrow. | Same pattern, types `"next-month"` / `"prev-month"`. |
| **Time slots** appear | Fast stagger (25 ms per slot, capped at 300 ms total). | `--i` + `fade-up`. |
| **Selected day / slot** | Background fills with a quick scale .9→1 of the bronze circle. | CSS transition. |
| **Submitting** | Button shows a soft shimmering dots indicator instead of static text. | CSS keyframe. |
| **Done step** | Checkmark draws itself (SVG stroke, 600 ms), text `fade-up`. | `stroke-dashoffset`. |

The step-height change (steps differ in height) animates via the `::view-transition-group` of the panel, so the dialog doesn't jump.

---

## 7. Page transitions (between routes)

Next.js 16.4 + React 19.3 support view transitions on navigation with no extra config.

- **Default:** a soft cross-fade (200 ms out / 300 ms in, content moves 8 px) between pages: home ↔ Over Mij ↔ legal pages ↔ review page.
- **Header & footer stay put:** give them `<ViewTransition name="site-header">` / `"site-footer"` so they don't fade along with the page.
- **Logo → Over Mij:** clicking "Over Mij" morphs nothing (no shared images between those pages). We keep it a cross-fade rather than inventing a morph.
- Browsers without View Transitions support just navigate instantly (current behaviour).

---

## 8. Accessibility & performance guardrails

- `prefers-reduced-motion: reduce`: reveals show instantly, no parallax, no pulse, view transitions become instant cross-fades (`::view-transition-*` animations set to `none`). The existing global rule stays as the safety net.
- **LCP:** the hero photo and H1 are never at opacity 0 for longer than the first paint delay of the stagger (H1 starts at 200 ms). Check that LCP stays < 2.5 s (Speed Insights is already installed).
- **CLS stays 0:** reveals use transform/opacity only; elements keep their space while hidden.
- **INP:** no scroll listeners; one IntersectionObserver; hovers are CSS only.
- **Focus:** animated elements are focusable immediately; the dialog's focus handling (`data-step-title`) keeps working after each step transition.
- **No content gated on JS:** `data-motion` is set by script, so if JS fails everything is visible.

---

## 9. Implementation order

| Phase | Scope | Size |
|---|---|---|
| **M1 Foundation** | Tokens, keyframes, `RevealObserver`, reduced-motion handling | S |
| **M2 Hero** | Hero entrance + header timing + parallax enhancement | S |
| **M3 Home reveals** | TrustBar, services (incl. card hover zoom), reviews, contact, footer | M |
| **M4 Micro-interactions** | Buttons, links, nav slider, mobile menu, WhatsApp, mobile bar | M |
| **M5 Booking dialog** | Open/close, directional steps, calendar, slots, done | M–L |
| **M6 Over Mij + page transitions** | Over Mij reveals + counter, route cross-fades | S–M |
| **M7 QA** | See §10 | S |

Each phase is a separate commit and can go live on its own.

---

## 10. QA checklist

- [ ] Chrome, Safari (macOS + iOS), Firefox (desktop + Android): animations run, or degrade to instant without errors.
- [ ] macOS "Reduce motion" / iOS "Reduce Motion" on: nothing moves, everything visible.
- [ ] JS disabled: all content visible.
- [ ] Slow 4× CPU throttling in DevTools: no jank during scroll (Performance panel: no long tasks from animations).
- [ ] Lighthouse mobile: LCP, CLS, INP unchanged or better than before M1 (note the baseline first).
- [ ] Booking flow end-to-end with keyboard only, with animations on.
- [ ] Back/forward navigation between pages: no stuck half-transparent content.

---

## 11. Deliberately not doing

- Custom cursors, magnetic buttons, text scrambling, 3D tilt: they don't fit a calm salon.
- Auto-playing carousels/sliders or looping background video: distracting and heavy.
- Scroll-jacking or snap scrolling.
- Animating every paragraph on legal pages.
- A JS animation library.

---

## 12. Open questions

1. **Intensity:** this plan is "subtle". A lighter version would drop parallax, the counter and the nav slider; a richer one could add a slow Ken Burns on the Contact photo.
2. **WhatsApp pulse:** one pulse per session after 8 s: OK, or no pulse at all?
3. **Mobile booking bar:** OK to hide it while the hero's own booking button is visible?
