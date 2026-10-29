import { site, whatsappUrl } from "@/content/site";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { OpenBookingButton } from "@/components/booking/BookButton";

/** Sticky booking bar on phones (home page). */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-60 flex items-center justify-between gap-3 rounded-full bg-espresso/94 py-2 pr-2 pl-5 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md md:hidden">
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] text-ivory">{site.name}</span>
        <span className="text-[11px] text-sand-muted">{site.city}</span>
      </span>
      <OpenBookingButton className="flex h-[46px] items-center rounded-full bg-bronze px-[22px] text-sm font-medium text-white hover:bg-bronze-deep hover:text-white">
        Boek een Sessie
      </OpenBookingButton>
    </div>
  );
}

/** Floating WhatsApp button. `raised` clears the mobile booking bar. */
export function WhatsAppFab({ raised = false }: { raised?: boolean }) {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur een WhatsApp-bericht"
      className={cn(
        "fixed right-5 z-70 flex size-[58px] items-center justify-center rounded-full bg-bronze text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-[transform,background-color] duration-200 hover:scale-106 hover:bg-bronze-deep hover:text-white",
        raised ? "bottom-[calc(86px+env(safe-area-inset-bottom))] md:bottom-6" : "bottom-6",
      )}
    >
      <WhatsAppIcon />
    </a>
  );
}
