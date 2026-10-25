import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MinimalFooter } from "@/components/layout/SiteFooter";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { Suspense } from "react";
import { ReviewForm, ReviewFormWithParams } from "@/components/reviews/ReviewForm";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export const metadata: Metadata = {
  title: "Deel uw ervaring",
  description: "Bent u bij Nataly geweest? Laat een review achter over uw behandeling.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/review" },
};

export default function ReviewPage() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <main id="main" className="px-[clamp(20px,5vw,64px)] pt-[clamp(48px,7vw,96px)]">
        <div className="mx-auto grid max-w-[1192px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,6vw,88px)]">
          <div className="flex flex-col gap-[22px] md:sticky md:top-28">
            <Eyebrow>Uw ervaring</Eyebrow>
            <h1 className="text-[clamp(38px,4.8vw,62px)] leading-[1.05] font-normal tracking-[-0.02em]">
              Hoe was uw <Accent>behandeling?</Accent>
            </h1>
            <p className="max-w-[440px] text-base leading-[1.65] text-pretty text-muted">
              Fijn dat u bij Nataly bent geweest. Met uw review helpt u anderen om de behandeling te kiezen
              die bij hen past. Het invullen duurt minder dan een minuut.
            </p>
            <p className="max-w-[440px] text-[13px] leading-relaxed text-muted-2">
              Reviews worden door Nataly gecontroleerd voordat ze online komen. Ook kritische reviews zijn
              welkom.
            </p>
          </div>
          <div className="rounded-[30px] border border-line-soft bg-ivory p-[clamp(24px,4vw,44px)]">
            <Suspense fallback={<ReviewForm turnstileSiteKey={turnstileSiteKey} />}>
              <ReviewFormWithParams turnstileSiteKey={turnstileSiteKey} />
            </Suspense>
          </div>
        </div>
      </main>
      <MinimalFooter />
    </div>
  );
}
