import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { site } from "@/content/site";

export const alt = `${site.name} · Massage & pedicure in ${site.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoSrc = `data:image/png;base64,${await readFile(
  join(process.cwd(), "src/assets/images/logo-n.png"),
  "base64",
)}`;

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        background: "#1E1713",
        color: "#FFFDFA",
        fontFamily: "serif",
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={logoSrc} width={170} height={153} />
      <div style={{ display: "flex", fontSize: 76 }}>{site.shortName}</div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 10,
          textTransform: "uppercase",
          color: "#E2C7A6",
        }}
      >
        {site.tagline}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#E9CFAE", fontStyle: "italic", marginTop: 10 }}>
        Massage &amp; pedicure in {site.city}
      </div>
    </div>,
    size,
  );
}
