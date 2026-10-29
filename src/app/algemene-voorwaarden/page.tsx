import type { Metadata } from "next";
import { site } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: `Voorwaarden voor afspraken bij ${site.name}, inclusief annuleren en wijzigen.`,
  alternates: { canonical: "/algemene-voorwaarden" },
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Voorwaarden" title="Algemene voorwaarden" updated="26 oktober 2026">
      <p>
        Deze voorwaarden gelden voor alle afspraken en behandelingen bij {site.name} in {site.city}.
      </p>

      <h2>Afspraak aanvragen en bevestigen</h2>
      <ul>
        <li>
          U vraagt een afspraak aan via de website. U kiest daarbij de behandeling, de duur, een datum en een
          tijd.
        </li>
        <li>
          Uw aanvraag is pas definitief nadat Nataly deze heeft bevestigd. U ontvangt de bevestiging, met het
          adres van de salon, per e-mail.
        </li>
        <li>
          Kan Nataly u op het gekozen moment niet ontvangen, dan krijgt u daarover een e-mail. Een aanvraag
          die niet binnen 24 uur wordt bevestigd, vervalt; ook dan krijgt u een e-mail.
        </li>
      </ul>

      <h2>Annuleren en wijzigen</h2>
      <ul>
        <li>
          <strong>Annuleren of wijzigen kan kosteloos tot 24 uur voor uw afspraak</strong>, via de link in uw
          bevestigingsmail, telefonisch ({site.phone.display}) of via WhatsApp.
        </li>
        <li>
          Binnen 24 uur voor de afspraak kan annuleren niet meer online, alleen telefonisch of via WhatsApp.
        </li>
      </ul>

      <h2>Prijzen en betaling</h2>
      <ul>
        <li>Alle prijzen zijn in euro&apos;s.</li>
        <li>De prijs hangt af van de behandeling en de duur die u kiest.</li>
      </ul>

      <h2>Gezondheid</h2>
      <ul>
        <li>
          Meld vóór de behandeling eventuele klachten, blessures, medicijngebruik of andere zaken die van
          belang kunnen zijn. Nataly kan een behandeling aanpassen of afraden als dat beter is voor uw
          gezondheid.
        </li>
        <li>
          Een massage is geen vervanging voor medische zorg. Raadpleeg bij medische klachten uw huisarts.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Vragen over deze voorwaarden? Neem contact op via <a href={`mailto:${site.email}`}>{site.email}</a> of{" "}
        {site.phone.display}.
      </p>
    </LegalPage>
  );
}
