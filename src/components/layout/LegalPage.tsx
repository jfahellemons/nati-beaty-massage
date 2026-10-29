import { SiteHeader } from "./SiteHeader";
import { MinimalFooter } from "./SiteFooter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageTransition } from "@/components/motion/PageTransition";

/** Shared shell for long-form text pages (privacy, terms). */
export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <PageTransition>
        <main id="main" className="px-[clamp(20px,5vw,64px)] pt-[clamp(48px,7vw,96px)]">
          <article className="mx-auto flex max-w-[720px] flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="text-[clamp(36px,4.6vw,56px)] leading-[1.06] font-normal tracking-[-0.02em]">
              {title}
            </h1>
            <p className="text-[13px] text-muted-2">Laatst bijgewerkt: {updated}</p>
            <div className="flex flex-col gap-4 text-base leading-[1.7] text-body [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-ink [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
              {children}
            </div>
          </article>
        </main>
      </PageTransition>
      <MinimalFooter />
    </div>
  );
}
