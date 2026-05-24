import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "KYSH / charts";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: "#6b6b6b",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 32,
              height: 48,
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 0,
                width: 4,
                height: 48,
                background: "#ffb000",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 4,
                top: 12,
                width: 24,
                height: 24,
                background: "#ffb000",
              }}
            />
          </div>
          KYSH / charts
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#f5f5f5",
            letterSpacing: -2,
          }}
        >
          the chart doesnt care what you think
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#ffb000",
            letterSpacing: 1,
          }}
        >
          free data. candles, levels, nothing else.
        </div>
      </div>
    ),
    { ...size },
  );
}
