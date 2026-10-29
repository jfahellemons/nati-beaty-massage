import { SiteHeader } from "@/components/layout/SiteHeader";
import { MinimalFooter } from "@/components/layout/SiteFooter";
import { Accent } from "@/components/ui/Eyebrow";
import { PillLink } from "@/components/ui/PillLink";
import { PageTransition } from "@/components/motion/PageTransition";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <SiteHeader />
      <PageTransition>
        <main id="main" className="flex flex-1 items-center px-[clamp(20px,5vw,64px)] py-24">
          <div className="mx-auto flex max-w-[640px] flex-col items-start gap-6">
            <span className="font-serif text-[80px] leading-none text-sand-muted">404</span>
            <h1 className="text-[clamp(34px,4.2vw,54px)] leading-[1.08] font-normal">
              Deze pagina <Accent>bestaat niet</Accent>
            </h1>
            <p className="text-base leading-relaxed text-muted">
              De pagina die u zoekt is verplaatst of bestaat niet meer.
            </p>
            <PillLink href="/" variant="deep" size="md">
              Naar de homepage
            </PillLink>
          </div>
        </main>
      </PageTransition>
      <MinimalFooter />
    </div>
  );
}
