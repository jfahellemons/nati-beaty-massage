import type { Metadata } from "next";
import { Suspense } from "react";
import { getService } from "@/content/services";
import { getReviewById } from "@/lib/reviews/queries";
import { verifyModerationToken } from "@/lib/reviews/tokens";
import { Stars } from "@/components/reviews/Stars";
import { ModerationForm } from "./ModerationForm";

export const metadata: Metadata = {
  title: "Review beoordelen",
  robots: { index: false, follow: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="flex w-full max-w-[520px] flex-col gap-5 rounded-[30px] border border-line-soft bg-ivory p-8">
        {children}
      </div>
    </main>
  );
}

async function Moderation({ searchParams }: { searchParams: PageProps<"/review/beheer">["searchParams"] }) {
  const { token } = await searchParams;
  const verified = typeof token === "string" ? verifyModerationToken(token) : null;
  if (!verified) {
    return (
      <Shell>
        <h1 className="font-serif text-3xl">Link ongeldig</h1>
        <p className="text-muted">Deze link is ongeldig of verlopen.</p>
      </Shell>
    );
  }

  const review = await getReviewById(verified.reviewId);
  if (!review) {
    return (
      <Shell>
        <h1 className="font-serif text-3xl">Review niet gevonden</h1>
        <p className="text-muted">Deze review bestaat niet (meer).</p>
      </Shell>
    );
  }

  const approve = verified.action === "approve";
  return (
    <Shell>
      <span className="text-[11px] tracking-[0.24em] text-bronze-deep uppercase">Review beoordelen</span>
      <h1 className="font-serif text-3xl leading-tight">
        {approve ? "Deze review publiceren?" : "Deze review verwijderen?"}
      </h1>
      <figure className="flex flex-col gap-3 rounded-2xl border border-line bg-cream p-5">
        <Stars rating={review.rating} className="text-bronze" />
        <blockquote className="font-serif text-lg leading-snug italic">“{review.text}”</blockquote>
        <figcaption className="text-sm text-muted-2">
          {review.name} · {getService(review.service_slug)?.title}
        </figcaption>
      </figure>
      <p className="text-sm text-muted-2">
        Huidige status:{" "}
        {review.status === "approved"
          ? "gepubliceerd"
          : review.status === "rejected"
            ? "verwijderd"
            : "wacht op beoordeling"}
      </p>
      <ModerationForm token={token as string} approve={approve} />
    </Shell>
  );
}

export default function ModerationPage({ searchParams }: PageProps<"/review/beheer">) {
  return (
    <Suspense
      fallback={
        <Shell>
          <p className="text-muted">Laden…</p>
        </Shell>
      }
    >
      <Moderation searchParams={searchParams} />
    </Suspense>
  );
}
