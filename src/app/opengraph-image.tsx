import { ImageResponse } from "next/og";

export const alt = "CTRLstudio — Visual Experiences Powered by Technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image, generated as a real PNG at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(60% 60% at 50% 30%, #18162a 0%, #060507 70%)",
          color: "#f4f4f6",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
            CTRL
          </span>
          <span style={{ fontSize: 22, letterSpacing: 6, color: "#c4c9ff" }}>
            STUDIO
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -2,
            textTransform: "uppercase",
            maxWidth: 900,
          }}
        >
          Visual experiences powered by technology
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#a2a2ad" }}>
          Content · Technology · Space
        </div>
      </div>
    ),
    { ...size },
  );
}
