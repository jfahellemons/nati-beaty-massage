import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  service: string;
  rating: number;
  text: string;
  approveUrl: string;
  rejectUrl: string;
};

const colors = {
  cream: "#FAF5EF",
  ivory: "#FFFDFA",
  ink: "#2A211C",
  bronze: "#94683F",
  muted: "#6B5C50",
  line: "#EADFD3",
};

export function ReviewModerationEmail({ name, service, rating, text, approveUrl, rejectUrl }: Props) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return (
    <Html lang="nl">
      <Head />
      <Preview>
        Nieuwe review van {name} ({stars})
      </Preview>
      <Body
        style={{
          backgroundColor: colors.cream,
          fontFamily: "Helvetica, Arial, sans-serif",
          color: colors.ink,
        }}
      >
        <Container style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
          <Heading as="h1" style={{ fontSize: 24, fontWeight: 400, margin: "0 0 8px" }}>
            Nieuwe review
          </Heading>
          <Text style={{ color: colors.muted, margin: "0 0 20px" }}>
            Deze review staat nog niet online. Kies hieronder of hij gepubliceerd mag worden.
          </Text>
          <Section
            style={{
              backgroundColor: colors.ivory,
              border: `1px solid ${colors.line}`,
              borderRadius: 16,
              padding: "20px 22px",
            }}
          >
            <Text style={{ color: colors.bronze, fontSize: 20, margin: "0 0 8px", letterSpacing: 2 }}>
              {stars}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: "24px", fontStyle: "italic", margin: "0 0 14px" }}>
              “{text}”
            </Text>
            <Text style={{ fontSize: 14, margin: 0 }}>
              <strong>{name}</strong> · {service}
            </Text>
          </Section>
          <Section style={{ marginTop: 24 }}>
            <Button
              href={approveUrl}
              style={{
                backgroundColor: colors.bronze,
                color: "#fff",
                padding: "14px 26px",
                borderRadius: 999,
                fontSize: 15,
                marginRight: 10,
              }}
            >
              Publiceren
            </Button>
            <Button
              href={rejectUrl}
              style={{
                border: `1px solid ${colors.bronze}`,
                color: colors.bronze,
                padding: "13px 24px",
                borderRadius: 999,
                fontSize: 15,
              }}
            >
              Verwijderen
            </Button>
          </Section>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 28 }}>
            Na het klikken vraagt de website nog één keer om bevestiging. De links zijn 30 dagen geldig.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
