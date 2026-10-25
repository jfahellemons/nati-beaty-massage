"use client";

import { useEffect, useRef } from "react";
import { durationLabel, hasRange, lowestPrice, services } from "@/content/services";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { CancellationNote } from "@/components/ui/CancellationNote";

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (slug: string) => void;
  onWarm: () => void;
};

/** Step 1 of booking (from the design): choose a treatment, then Cal.com takes over. */
export function ServicePicker({ open, onClose, onPick, onWarm }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      onWarm();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, onWarm]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="picker-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-3xl bg-cream p-0 text-ink shadow-modal md:m-auto md:max-h-[min(860px,calc(100dvh-48px))] md:max-w-[580px] md:rounded-[28px]"
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line py-4 pr-5 pl-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] tracking-[0.24em] text-bronze-deep uppercase">{site.name}</span>
            <h2 id="picker-title" className="font-serif text-[28px] leading-tight">
              Afspraak maken
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-ivory"
          >
            <Icon name="close" size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 pt-5 pb-6 [-webkit-overflow-scrolling:touch]">
          <p className="text-[15px] leading-relaxed text-muted">
            Kies een behandeling. Daarna kiest u de duur, datum en tijd. Nataly bevestigt uw aanvraag
            persoonlijk.
          </p>
          <ul className="flex flex-col gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => onPick(s.slug)}
                  className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-[14px] border border-line bg-ivory px-3.5 py-2.5 text-left transition-colors hover:border-bronze hover:bg-chip-soft"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip text-bronze-deep">
                    <Icon d={s.icon} size={18} strokeWidth={1.4} />
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-[15px] leading-tight">{s.title}</span>
                    <span className="text-xs text-muted-2">{durationLabel(s)}</span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-1 whitespace-nowrap">
                    {hasRange(s) && <span className="text-xs text-muted-2">vanaf</span>}
                    <span className="font-serif text-[19px]">€{lowestPrice(s)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-line bg-ivory px-6 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom))] md:pb-3.5">
          <CancellationNote />
        </div>
      </div>
    </dialog>
  );
}
