import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, fontFamily } from "../../theme";
import type { KfzPromoProps } from "../types";

const Badge: React.FC<{ text: string; color: string; left?: boolean }> = ({
  text,
  color,
  left,
}) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      [left ? "left" : "right"]: 60,
      backgroundColor: color,
      color: theme.white,
      fontFamily,
      fontSize: 40,
      fontWeight: 900,
      letterSpacing: 3,
      padding: "16px 34px",
      borderRadius: 999,
    }}
  >
    {text}
  </div>
);

export const BeforeAfterScene: React.FC<KfzPromoProps> = ({
  vorherBild,
  nachherBild,
}) => {
  const frame = useCurrentFrame();
  const { width, durationInFrames } = useVideoConfig();

  // Slider fährt zweimal hin und her, ruht am Ende bei ~92% (Nachher dominiert).
  const t = frame / durationInFrames;
  const raw = 0.5 - 0.42 * Math.cos(t * Math.PI * 2.5);
  const settle = interpolate(frame, [durationInFrames - 30, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pos = raw * (1 - settle) + 0.92 * settle; // 0..1
  const x = pos * width;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ink }}>
      {/* NACHHER als Basis */}
      <Img
        src={staticFile(nachherBild)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* VORHER darüber, per clip-path abgeschnitten */}
      <AbsoluteFill style={{ clipPath: `inset(0 ${width - x}px 0 0)` }}>
        <Img
          src={staticFile(vorherBild)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.55) brightness(0.8)" }}
        />
      </AbsoluteFill>

      {/* Trennlinie + Griff */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: x - 3,
          width: 6,
          height: "100%",
          backgroundColor: theme.white,
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: x - 46,
          width: 92,
          height: 92,
          marginTop: -46,
          borderRadius: "50%",
          backgroundColor: theme.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
          color: theme.ink,
          fontWeight: 900,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        ⟺
      </div>

      <Badge text="VORHER" color={theme.slate} left />
      <Badge text="NACHHER" color={theme.orange} />
    </AbsoluteFill>
  );
};
