"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { moderateReview, type ModerationState } from "@/lib/reviews/actions";

function Submit({ approve }: { approve: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[50px] cursor-pointer rounded-full bg-bronze-deep px-7 text-[15px] font-medium text-white hover:bg-bronze-darker disabled:opacity-70"
    >
      {pending ? "Bezig…" : approve ? "Ja, publiceren" : "Ja, verwijderen"}
    </button>
  );
}

export function ModerationForm({ token, approve }: { token: string; approve: boolean }) {
  const [state, action] = useActionState<ModerationState, FormData>(moderateReview, { status: "idle" });

  if (state.status === "done") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <p className="text-base text-ink">{state.message}</p>
        <Link href="/#ervaringen" className="text-sm">
          Bekijk de website
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-error">
          {state.message}
        </p>
      )}
      <Submit approve={approve} />
    </form>
  );
}
