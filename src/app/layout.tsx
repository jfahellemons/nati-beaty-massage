import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/content/site";
import { services, lowestPrice } from "@/content/services";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingQueryHandler } from "@/components/booking/BookingQueryHandler";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { motionInitScript } from "@/components/motion/initScript";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Massage & pedicure in ${site.city}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: site.name,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1E1713",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone.e164,
  email: site.email,
  image: `${site.url}/opengraph-image`,
  priceRange: "€35 – €95",
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "NL" },
  sameAs: [site.instagram.url],
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.description },
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: lowestPrice(s),
      priceCurrency: "EUR",
    },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `data-motion` is added by the inline script before hydration.
    <html
      lang="nl"
      className={`${jost.variable} ${cormorant.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[300] rounded-full bg-ink px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Naar de inhoud
        </a>
        <BookingProvider>
          {children}
          <Suspense fallback={null}>
            <BookingQueryHandler />
          </Suspense>
        </BookingProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <RevealObserver />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
