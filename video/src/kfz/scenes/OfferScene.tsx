import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, fontFamily } from "../../theme";
import { Stars } from "../../components/Stars";
import type { KfzPromoProps } from "../types";

export const OfferScene: React.FC<KfzPromoProps> = ({
  offerTitel,
  offerZusatz,
  bewertung,
  bewertungenAnzahl,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({ frame, fps, config: { damping: 200 } });
  const badgeIn = spring({ frame: frame - 10, fps, config: { damping: 12, mass: 0.6 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.ink2,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: theme.white,
          borderRadius: 44,
          padding: "80px 60px",
          textAlign: "center",
          transform: `translateY(${(1 - cardIn) * 60}px) scale(${0.94 + cardIn * 0.06})`,
          opacity: cardIn,
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* GRATIS-Stempel */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: theme.green,
            color: theme.white,
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 3,
            padding: "14px 40px",
            borderRadius: 999,
            transform: `scale(${badgeIn}) rotate(${(1 - badgeIn) * -12}deg)`,
          }}
        >
          GRATIS
        </div>

        <div
          style={{
            color: theme.ink,
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1.05,
            marginTop: 40,
            letterSpacing: -1,
          }}
        >
          {offerTitel}
        </div>
        <div style={{ color: theme.slate, fontSize: 46, fontWeight: 600, marginTop: 24 }}>
          {offerZusatz}
        </div>

        {/* Trust */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 40,
            borderTop: `2px solid ${theme.mist}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Stars size={52} />
          <div style={{ color: theme.ink, fontSize: 40, fontWeight: 800 }}>
            {bewertung.toLocaleString("de-DE")} von 5 · {bewertungenAnzahl} Bewertungen
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
