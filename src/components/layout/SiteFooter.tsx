import Link from "next/link";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { cn } from "@/lib/cn";
import { BookButton } from "@/components/booking/BookButton";
import { Logo } from "./Logo";

const heading = "text-xs tracking-[0.2em] text-sand-muted uppercase";
const link = "text-sm text-on-dark hover:text-ivory";

function LegalLinks() {
  return (
    <span className="flex flex-wrap gap-x-4 gap-y-1">
      <Link href="/privacy" className="text-on-dark-muted hover:text-ivory">
        Privacybeleid
      </Link>
      <Link href="/algemene-voorwaarden" className="text-on-dark-muted hover:text-ivory">
        Algemene voorwaarden
      </Link>
      <Link href="/review" className="text-on-dark-muted hover:text-ivory">
        Deel uw ervaring
      </Link>
    </span>
  );
}

/** Full footer (home). `withMobileBar` leaves room for the sticky booking bar. */
export function SiteFooter({ withMobileBar = false }: { withMobileBar?: boolean }) {
  return (
    <footer
      className={cn(
        "mt-[clamp(64px,8vw,104px)] bg-espresso px-[clamp(20px,5vw,64px)] pt-16 text-on-dark",
        withMobileBar ? "pb-[110px] md:pb-10" : "pb-10",
      )}
    >
      <div className="mx-auto flex max-w-[1192px] flex-col gap-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
          <div className="flex flex-col gap-[18px]">
            <Logo size="lg" nameClassName="text-ivory font-normal" subClassName="text-sand-muted" />
            <p className="max-w-[260px] text-sm leading-relaxed">
              Massage en schoonheidsverzorging met persoonlijke aandacht.
            </p>
          </div>
          <nav aria-label="Navigatie" className="flex flex-col gap-3">
            <span className={heading}>Navigatie</span>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={link}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <span className={heading}>Behandelingen</span>
            {services.map((s) => (
              <BookButton key={s.slug} slug={s.slug} className={link}>
                {s.title}
              </BookButton>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className={heading}>Contact</span>
            <a href={site.phone.href} className={link}>
              {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className={cn(link, "break-all")}>
              {site.email}
            </a>
            <span className="text-sm">Ma t/m za {site.hours.display}</span>
            <span className="text-sm">{site.city}</span>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className={link}>
              Instagram {site.instagram.handle}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-on-dark/18 pt-6 text-[13px] text-on-dark-muted">
          <span>© 2026 {site.name}</span>
          <LegalLinks />
        </div>
      </div>
    </footer>
  );
}

/** Minimal footer from the "Over Mij" design. */
export function MinimalFooter() {
  return (
    <footer className="mt-[clamp(64px,8vw,104px)] bg-espresso px-[clamp(20px,5vw,64px)] py-8 text-on-dark-muted">
      <div className="mx-auto flex max-w-[1192px] flex-wrap justify-between gap-3 text-[13px]">
        <span>
          © 2026 {site.name} · {site.city}
        </span>
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          <LegalLinks />
          <Link href="/" className="text-sand-muted hover:text-ivory">
            Terug naar home
          </Link>
        </span>
      </div>
    </footer>
  );
}
