"use client";

import Link from "next/link";
import { Turnstile } from "@/components/Turnstile";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { services } from "@/content/services";
import { submitReview } from "@/lib/reviews/actions";
import type { ReviewFormState } from "@/lib/reviews/schema";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { STAR_PATH } from "./Stars";

const field =
  "w-full rounded-[14px] border border-line bg-ivory px-4 text-base text-ink outline-none transition-colors focus:border-bronze aria-invalid:border-error";
const label = "text-[13px] font-medium text-ink";
const ratingLabels = ["Slecht", "Matig", "Goed", "Heel goed", "Uitstekend"];

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[13px] text-error">
      {message}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[50px] cursor-pointer self-start rounded-full bg-bronze-deep px-7 text-[15px] font-medium text-white transition-colors hover:bg-bronze-darker disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Versturen…" : "Review versturen"}
    </button>
  );
}

function StarInput({ defaultValue, error }: { defaultValue?: string; error?: string }) {
  const [value, setValue] = useState(Number(defaultValue) || 0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset className="flex flex-col gap-2.5" aria-describedby={error ? "rating-error" : undefined}>
      <legend className={cn(label, "mb-2.5")}>Uw beoordeling*</legend>
      <div className="flex items-center gap-3" onMouseLeave={() => setHover(0)}>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                defaultChecked={value === n}
                onChange={() => setValue(n)}
                className="peer sr-only"
                required
              />
              <span className="sr-only">
                {n} {n === 1 ? "ster" : "sterren"}: {ratingLabels[n - 1]}
              </span>
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="rounded-md text-bronze peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze"
              >
                <path
                  d={STAR_PATH}
                  fill={n <= shown ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          ))}
        </div>
        <span className="text-sm text-muted-2" aria-hidden="true">
          {shown ? ratingLabels[shown - 1] : ""}
        </span>
      </div>
      <FieldError id="rating-error" message={error} />
    </fieldset>
  );
}

/** Prefills the treatment from links like /review?behandeling=pedicure-spa. Render inside <Suspense>. */
export function ReviewFormWithParams({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const slug = useSearchParams().get("behandeling");
  const initialService = services.some((s) => s.slug === slug) ? slug! : "";
  return <ReviewForm turnstileSiteKey={turnstileSiteKey} initialService={initialService} />;
}

export function ReviewForm({
  turnstileSiteKey,
  initialService = "",
}: {
  turnstileSiteKey?: string;
  initialService?: string;
}) {
  const [state, action] = useActionState<ReviewFormState, FormData>(submitReview, { status: "idle" });
  // React resets the form after each action; remounting the fields with the
  // submitted values as defaults keeps what the client typed.
  const attempt = state.status === "error" ? state.attempt : 0;
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  useEffect(() => {
    if (state.status === "success") track("review_submitted");
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-bronze-deep text-white">
          <Icon name="check" size={24} strokeWidth={2} />
        </span>
        <h2 className="font-serif text-[34px] font-normal">Dank u wel!</h2>
        <p className="text-base leading-relaxed text-muted">
          Uw review is ontvangen en wordt na controle door Nataly op de website geplaatst.
        </p>
        <Link href="/" className="mt-2 text-sm">
          Terug naar de homepage
        </Link>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-[14px] border border-error/40 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {state.message}
        </p>
      )}

      <div key={attempt} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="name" className={label}>
            Uw naam*
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={60}
            defaultValue={values.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : "name-hint"}
            className={cn(field, "h-[52px]")}
          />
          <p id="name-hint" className="text-[13px] text-muted-2">
            Op de website tonen we alleen uw voornaam en de eerste letter van uw achternaam.
          </p>
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="service" className={label}>
            Welke behandeling heeft u gehad?*
          </label>
          <select
            id="service"
            name="service"
            required
            defaultValue={values.service ?? initialService}
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "service-error" : undefined}
            className={cn(
              field,
              "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394683F%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] h-[52px] cursor-pointer appearance-none bg-[length:14px] bg-[right_16px_center] bg-no-repeat pr-10",
            )}
          >
            <option value="" disabled>
              Kies een behandeling
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          <FieldError id="service-error" message={errors.service} />
        </div>

        <StarInput defaultValue={values.rating} error={errors.rating} />

        <div className="flex flex-col gap-2.5">
          <label htmlFor="text" className={label}>
            Uw ervaring*
          </label>
          <textarea
            id="text"
            name="text"
            rows={5}
            required
            minLength={20}
            maxLength={800}
            defaultValue={values.text}
            aria-invalid={!!errors.text}
            aria-describedby={errors.text ? "text-error" : undefined}
            placeholder="Hoe was uw behandeling? Wat viel u op?"
            className={cn(field, "resize-y py-3.5 leading-relaxed")}
          />
          <FieldError id="text-error" message={errors.text} />
        </div>

        {/* Honeypot: hidden from people, tempting for bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-body">
            <input
              type="checkbox"
              name="consent"
              required
              defaultChecked={values.consent === "on"}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-bronze-deep"
            />
            <span>
              Ik geef toestemming om mijn review met mijn voornaam en eerste letter van mijn achternaam op de
              website te publiceren. Lees ons <Link href="/privacy">privacybeleid</Link>.
            </span>
          </label>
          <FieldError id="consent-error" message={errors.consent} />
        </div>
      </div>

      {/* A new attempt number gives a fresh (single-use) Turnstile token. */}
      <Turnstile siteKey={turnstileSiteKey} resetKey={attempt} />

      <SubmitButton />
    </form>
  );
}
