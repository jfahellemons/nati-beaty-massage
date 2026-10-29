import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileCtaBar, WhatsAppFab } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { PageTransition } from "@/components/motion/PageTransition";

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader overlay />
      <PageTransition>
        <main id="main">
          <Hero />
          <TrustBar />
          <ServicesSection />
          <ReviewsSection />
          <ContactSection />
        </main>
      </PageTransition>
      <SiteFooter withMobileBar />
      <MobileCtaBar />
      <WhatsAppFab raised />
    </div>
  );
}
