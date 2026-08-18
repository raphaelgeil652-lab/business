import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, fontFamily } from "../../theme";
import type { KfzPromoProps } from "../types";

export const HookScene: React.FC<KfzPromoProps> = ({
  betrieb,
  ort,
  modulLabel,
  hook,
  nachHook,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandIn = spring({ frame, fps, config: { damping: 200 } });
  const hookIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const nachIn = interpolate(frame, [34, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.ink,
        fontFamily,
        justifyContent: "center",
        padding: "0 90px",
      }}
    >
      {/* Warmer Lichtschein oben */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 800px at 50% 12%, ${theme.orangeDark}55, transparent 60%)`,
        }}
      />

      {/* Betrieb · Ort */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 90,
          opacity: brandIn,
          transform: `translateY(${(1 - brandIn) * -20}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            color: theme.amber,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {modulLabel}
        </div>
        <div style={{ color: theme.white, fontSize: 52, fontWeight: 800, marginTop: 8 }}>
          {betrieb} · {ort}
        </div>
      </div>

      {/* Haupt-Hook */}
      <div
        style={{
          transform: `scale(${0.9 + hookIn * 0.1})`,
          opacity: hookIn,
        }}
      >
        <div
          style={{
            color: theme.white,
            fontSize: 108,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          {hook}
        </div>
      </div>

      {/* Nach-Hook */}
      <div
        style={{
          marginTop: 40,
          opacity: nachIn,
          transform: `translateY(${(1 - nachIn) * 24}px)`,
        }}
      >
        <div style={{ color: theme.orange, fontSize: 56, fontWeight: 800, lineHeight: 1.15 }}>
          {nachHook}
        </div>
      </div>
    </AbsoluteFill>
  );
};
