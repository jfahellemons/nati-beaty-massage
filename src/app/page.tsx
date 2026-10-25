import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileCtaBar, WhatsAppFab } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader overlay />
      <main id="main">
        <Hero />
        <TrustBar />
        <ServicesSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <SiteFooter withMobileBar />
      <MobileCtaBar />
      <WhatsAppFab raised />
    </div>
  );
}
