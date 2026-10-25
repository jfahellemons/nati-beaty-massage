import type { Metadata } from "next";
import { site } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: `Hoe ${site.name} omgaat met uw persoonsgegevens.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacybeleid" updated="25 oktober 2026">
      <p>
        {site.name} ({site.city}) gaat zorgvuldig om met uw persoonsgegevens. In dit privacybeleid leest u
        welke gegevens wij verwerken, waarom, en welke rechten u heeft. Vragen? Mail naar{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> of bel {site.phone.display}.
      </p>

      <h2>Afspraken maken</h2>
      <p>
        Afspraken worden gemaakt via <strong>Cal.com</strong>. Daarbij vragen wij uw naam, e-mailadres,
        telefoonnummer en eventuele opmerkingen. Deze gegevens gebruiken wij alleen om uw afspraak te plannen,
        te bevestigen en u indien nodig te bereiken. De afspraak wordt opgeslagen in de agenda van Nataly
        (Google Agenda). Vermeld in het opmerkingenveld geen medische gegevens; bespreek klachten liever
        persoonlijk tijdens de afspraak.
      </p>

      <h2>Reviews</h2>
      <p>
        Als u een review achterlaat, slaan wij uw naam, de behandeling, uw beoordeling en uw tekst op. Op de
        website tonen wij alleen uw voornaam en de eerste letter van uw achternaam, en alleen als u daar
        toestemming voor geeft. Elke review wordt eerst door Nataly gecontroleerd. U kunt uw review altijd
        laten verwijderen via <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Contact via WhatsApp, telefoon of e-mail</h2>
      <p>
        Neemt u contact op via WhatsApp, telefoon of e-mail, dan gebruiken wij uw gegevens alleen om uw vraag
        te beantwoorden.
      </p>

      <h2>Dienstverleners</h2>
      <p>Voor onze website en afspraken maken wij gebruik van de volgende dienstverleners (verwerkers):</p>
      <ul>
        <li>Cal.com: online afspraken plannen</li>
        <li>Google: agenda en e-mail</li>
        <li>Vercel: hosting van de website en anonieme bezoekersstatistieken</li>
        <li>Supabase: opslag van reviews</li>
        <li>Resend: verzenden van e-mailmeldingen over reviews</li>
        <li>Cloudflare Turnstile: bescherming van het reviewformulier tegen spam</li>
      </ul>

      <h2>Cookies en statistieken</h2>
      <p>
        Deze website plaatst geen tracking- of advertentiecookies. Wij meten bezoekersaantallen anoniem en
        zonder cookies. Wanneer u een afspraak maakt, laadt de website het boekingsvenster van Cal.com;
        Cal.com kan daarbij functionele cookies gebruiken die nodig zijn om de afspraak te maken.
      </p>

      <h2>Bewaartermijnen</h2>
      <p>
        Wij bewaren gegevens niet langer dan nodig. Afspraakgegevens bewaren wij zolang dat nodig is voor onze
        administratie. Reviews blijven online tot u vraagt ze te verwijderen.
      </p>

      <h2>Uw rechten</h2>
      <p>
        U heeft het recht om uw gegevens in te zien, te laten corrigeren of te laten verwijderen, en om
        bezwaar te maken tegen het gebruik ervan. Stuur hiervoor een e-mail naar{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Heeft u een klacht over hoe wij met uw gegevens
        omgaan, dan kunt u die ook indienen bij de Autoriteit Persoonsgegevens.
      </p>
    </LegalPage>
  );
}
