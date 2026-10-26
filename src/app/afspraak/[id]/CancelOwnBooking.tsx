"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { cancelOwnBooking, type CancelState } from "@/lib/booking/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 cursor-pointer rounded-full border border-error/50 px-6 text-[15px] text-error hover:bg-error/5 disabled:opacity-60"
    >
      {pending ? "Bezig…" : "Ja, annuleer mijn afspraak"}
    </button>
  );
}

export function CancelOwnBooking({
  id,
  token,
  cutoffHours,
}: {
  id: string;
  token: string;
  cutoffHours: number;
}) {
  const [state, action] = useActionState<CancelState, FormData>(cancelOwnBooking, { status: "idle" });
  const [confirming, setConfirming] = useState(false);

  if (state.status === "done") {
    return (
      <p role="status" className="rounded-2xl border border-line bg-ivory p-4 text-[15px]">
        {state.message}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">Annuleren kan online tot {cutoffHours} uur voor de afspraak.</p>
      {confirming ? (
        <form action={action} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="token" value={token} />
          <Submit />
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="cursor-pointer text-sm text-muted"
          >
            Toch niet
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="h-12 cursor-pointer self-start rounded-full border border-line-strong px-6 text-[15px] text-bronze-deep hover:bg-chip-soft"
        >
          Afspraak annuleren
        </button>
      )}
      {state.status === "error" && (
        <p role="alert" className="text-sm text-error">
          {state.message}
        </p>
      )}
    </div>
  );
}
