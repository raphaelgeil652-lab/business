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

export const CtaScene: React.FC<KfzPromoProps> = ({
  betrieb,
  ort,
  telefon,
  cta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inAnim = spring({ frame, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin(frame / 6) * 0.02;
  const phoneIn = interpolate(frame, [20, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.ink,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(1000px 900px at 50% 55%, ${theme.orangeDark}66, transparent 62%)`,
        }}
      />

      <div style={{ textAlign: "center", opacity: inAnim, transform: `translateY(${(1 - inAnim) * 30}px)` }}>
        <div style={{ color: theme.fog, fontSize: 44, fontWeight: 700 }}>
          {betrieb} · {ort}
        </div>

        {/* CTA-Button */}
        <div
          style={{
            marginTop: 44,
            display: "inline-block",
            background: `linear-gradient(180deg, ${theme.orange}, ${theme.orangeDark})`,
            color: theme.white,
            fontSize: 72,
            fontWeight: 900,
            padding: "44px 72px",
            borderRadius: 28,
            transform: `scale(${pulse})`,
            boxShadow: `0 20px 60px ${theme.orangeDark}88`,
            letterSpacing: -1,
          }}
        >
          {cta}
        </div>

        {/* Telefon */}
        <div
          style={{
            marginTop: 56,
            opacity: phoneIn,
            transform: `translateY(${(1 - phoneIn) * 20}px)`,
          }}
        >
          <div style={{ color: theme.fog, fontSize: 38, fontWeight: 600 }}>Jetzt anrufen</div>
          <div style={{ color: theme.white, fontSize: 78, fontWeight: 900, marginTop: 8 }}>
            ☎ {telefon}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
