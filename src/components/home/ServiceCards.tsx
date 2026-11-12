"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { durationLabel, getService, hasRange, lowestPrice, offered, services, type Service } from "@/content/services";
import { Icon } from "@/components/ui/Icon";
import { CancellationNote } from "@/components/ui/CancellationNote";
import { BookButton } from "@/components/booking/BookButton";

function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  return (
    <article
      data-reveal
      className="group relative flex flex-col rounded-card border border-line-soft bg-ivory p-2.5 transition-[box-shadow,translate] duration-500 ease-soft [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:shadow-card-hover"
    >
      <div className="relative h-[200px] shrink-0 overflow-hidden rounded-[18px] bg-line">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1100px) 280px, (min-width: 640px) 45vw, 100vw"
          placeholder="blur"
          className="object-cover transition-[scale] duration-700 ease-soft [@media(hover:hover)]:group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 flex size-[42px] items-center justify-center rounded-full bg-ivory text-bronze-deep shadow-[0_4px_14px_rgba(42,33,28,.1)]">
          <Icon d={service.icon} size={20} strokeWidth={1.4} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-3.5 pt-5 pb-3">
        <h3 className="text-[19px] leading-tight font-medium">
          {/* Stretched over the whole card, so clicking anywhere opens the details. */}
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="cursor-pointer text-left after:absolute after:inset-0 after:rounded-card"
          >
            {service.title}
          </button>
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-pretty text-muted">{service.tagline}</p>
        <div className="flex items-end justify-between gap-2.5 border-t border-line-softer pt-3.5">
          <span className="flex items-center gap-[7px] text-[13px] text-muted-2">
            <Icon name="clock" size={15} className="text-bronze-deep" />
            {durationLabel(service)}
          </span>
          <span className="flex items-baseline gap-1.5 leading-none">
            {hasRange(service) && <span className="text-[13px] text-muted-2">vanaf</span>}
            <span className="font-serif text-[26px] text-ink">€{lowestPrice(service)}</span>
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <BookButton slug={service.slug} variant="outline-soft" size="sm" className="relative z-10 font-normal">
            Boek Nu<span className="sr-only">: {service.title}</span>
          </BookButton>
          <span
            aria-hidden
            className="flex items-center gap-1.5 text-[13px] text-bronze-deep transition-colors group-hover:text-bronze-darkest"
          >
            Meer info
            <Icon name="info" size={15} />
          </span>
        </div>
      </div>
    </article>
  );
}

function ServiceDialog({ service, open, onClose }: { service: Service; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="service-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="booking-dialog m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-3xl bg-cream p-0 text-ink shadow-modal md:m-auto md:max-h-[min(820px,calc(100dvh-48px))] md:max-w-[560px] md:rounded-[28px]"
    >
      <div className="flex max-h-[inherit] flex-col overflow-y-auto [-webkit-overflow-scrolling:touch]">
        <div className="relative h-[200px] shrink-0 bg-line md:h-[240px]">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            placeholder="blur"
            className="object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="absolute top-3.5 right-3.5 flex size-11 cursor-pointer items-center justify-center rounded-full bg-ivory shadow-[0_4px_14px_rgba(42,33,28,.15)]"
          >
            <Icon name="close" size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-5 pt-6 pb-7 md:px-8 md:pt-7 md:pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] tracking-[0.24em] text-bronze-deep uppercase">Behandeling</span>
            <h2 id="service-dialog-title" className="font-serif text-[30px] leading-tight font-normal">
              {service.title}
            </h2>
          </div>

          <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-pretty text-muted">
            <p className="font-medium text-ink">{service.tagline}</p>
            {service.description.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <div className="flex flex-col gap-1 rounded-[18px] border border-line-soft bg-ivory px-4 py-2">
            {offered(service).map(({ min, price }) => (
              <div
                key={min}
                className="flex items-center justify-between border-b border-line-softer py-2.5 last:border-0"
              >
                <span className="flex items-center gap-2 text-sm text-muted">
                  <Icon name="clock" size={15} className="text-bronze-deep" />
                  {min} min
                </span>
                <span className="font-serif text-[22px] leading-none text-ink">€{price}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <BookButton slug={service.slug} variant="bronze" size="md" onBeforeBook={onClose} className="self-start">
              Boek Nu<span className="sr-only">: {service.title}</span>
            </BookButton>
            <CancellationNote />
          </div>
        </div>
      </div>
    </dialog>
  );
}

/** Service grid; each card opens a dialog with the full description and prices. */
export function ServiceCards({ children }: { children?: React.ReactNode }) {
  // The slug stays set after closing, so the dialog keeps its content during the close animation.
  const [state, setState] = useState<{ open: boolean; slug: string | null }>({ open: false, slug: null });
  const selected = getService(state.slug);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceCard
            key={service.slug}
            service={service}
            onOpen={() => setState({ open: true, slug: service.slug })}
          />
        ))}
        {children}
      </div>
      {selected && (
        <ServiceDialog
          service={selected}
          open={state.open}
          onClose={() => setState((s) => ({ ...s, open: false }))}
        />
      )}
    </>
  );
}
