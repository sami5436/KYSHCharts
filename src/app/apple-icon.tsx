import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 90,
            height: 144,
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 41,
              top: 0,
              width: 8,
              height: 144,
              background: "#ffb000",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 36,
              width: 90,
              height: 72,
              background: "#ffb000",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
