import Link from "next/link";
import { getService } from "@/content/services";
import { getApprovedReviews } from "@/lib/reviews/queries";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/reviews/Stars";

/** Real client reviews. Renders nothing until the first review is approved. */
export async function ReviewsSection() {
  const reviews = await getApprovedReviews();
  if (reviews.length === 0) return null;

  return (
    <section
      id="ervaringen"
      aria-labelledby="ervaringen-title"
      className="bg-ivory px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,120px)]"
    >
      <div className="mx-auto flex max-w-[1192px] flex-col gap-12">
        <div className="flex flex-col gap-[18px]">
          <Eyebrow>Ervaringen</Eyebrow>
          <h2
            id="ervaringen-title"
            className="text-[clamp(34px,4.2vw,54px)] leading-[1.08] font-normal tracking-[-0.015em]"
          >
            Wat <Accent>cliënten</Accent> zeggen
          </h2>
        </div>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
          {reviews.map((r) => (
            <li key={r.id}>
              <figure className="flex h-full flex-col gap-5 rounded-card border border-line-soft bg-cream p-7">
                <Stars rating={r.rating} className="text-bronze" />
                <blockquote className="flex-1 font-serif text-[21px] leading-snug text-pretty text-ink italic">
                  “{r.text}”
                </blockquote>
                <figcaption className="flex flex-col gap-0.5 border-t border-line-softer pt-4">
                  <span className="text-[15px] font-medium">{r.name}</span>
                  <span className="text-[13px] text-muted-2">{getService(r.serviceSlug)?.title}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[560px] text-[13px] leading-relaxed text-muted-2">
            Reviews worden geschreven door cliënten na hun behandeling en door Nataly gecontroleerd voordat ze
            online komen.
          </p>
          <Link href="/review" className="flex items-center gap-2 text-sm hover:text-bronze-darkest">
            Bent u bij Nataly geweest? Deel uw ervaring <Icon name="arrow" size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
