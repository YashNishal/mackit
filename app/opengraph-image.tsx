import { ImageResponse } from "next/og";

export const alt = "MacKit: pick your Mac apps and install them with one command";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1c1c1f";

function Tile({ faded = false }: { faded?: boolean }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: INK,
        opacity: faded ? 0.45 : 1,
      }}
    />
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#f3f3f5",
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 32,
              background: "#f5a524",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 5 }}>
              <Tile />
              <Tile />
              <Tile faded />
            </div>
            <div style={{ width: 100, height: 9, borderRadius: 9, background: INK }} />
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1.5 }}>MacKit</div>
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Set up your Mac in one go.
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#5c5c63", maxWidth: 1010 }}>
          Pick your apps, copy one command, and let Terminal handle the rest.
        </div>
      </div>
    ),
    size,
  );
}
