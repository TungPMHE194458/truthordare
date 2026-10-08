import { ImageResponse } from "next/og";

export const alt = "Truth or Dare — Fun Party Game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          background: "radial-gradient(circle at 15% 10%, #24356b, #15121f 55%)",
          color: "#f6f3ff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 300,
            height: 420,
            padding: 14,
            gap: 14,
            borderRadius: 32,
            background: "#fffaf2",
            transform: "rotate(-6deg)",
          }}
        >
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 22, background: "#e9efff", color: "#2a5fd6", fontSize: 48, fontWeight: 900 }}>
            TRUTH
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 22, background: "#ffece6", color: "#c93a24", fontSize: 48, fontWeight: 900 }}>
            DARE
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontWeight: 900, lineHeight: 0.95 }}>
          <span style={{ fontSize: 120, color: "#8fb0ff" }}>TRUTH</span>
          <span style={{ fontSize: 56, color: "#a7a1c2" }}>or</span>
          <span style={{ fontSize: 120, color: "#ff9a85" }}>DARE</span>
          <span style={{ fontSize: 32, marginTop: 28, color: "#a7a1c2", fontWeight: 600 }}>Fun party card game</span>
        </div>
      </div>
    ),
    size,
  );
}
