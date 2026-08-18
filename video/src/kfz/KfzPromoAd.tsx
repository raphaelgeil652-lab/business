import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";
import type { KfzPromoProps } from "./types";
import { HookScene } from "./scenes/HookScene";
import { BeforeAfterScene } from "./scenes/BeforeAfterScene";
import { OfferScene } from "./scenes/OfferScene";
import { CtaScene } from "./scenes/CtaScene";

// Weicher Ein-/Ausblender an den Szenengrenzen.
const Fade: React.FC<{ children: React.ReactNode; duration: number }> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 10, duration - 10, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Timings bei 30 fps (Gesamt: 450 Frames = 15,0 s).
// Szenen stoßen ohne Überlappung aneinander -> Übergang = Blende durch Schwarz
// (jede Szene blendet aus, die nächste blendet ein). Kein Text-über-Text.
const HOOK = 100;
const BA = 160;
const OFFER = 100;
const CTA = 90;

const AT_BA = HOOK;
const AT_OFFER = HOOK + BA;
const AT_CTA = HOOK + BA + OFFER;

export const KfzPromoAd: React.FC<KfzPromoProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.ink }}>
      <Sequence durationInFrames={HOOK}>
        <Fade duration={HOOK}>
          <HookScene {...props} />
        </Fade>
      </Sequence>

      <Sequence from={AT_BA} durationInFrames={BA}>
        <Fade duration={BA}>
          <BeforeAfterScene {...props} />
        </Fade>
      </Sequence>

      <Sequence from={AT_OFFER} durationInFrames={OFFER}>
        <Fade duration={OFFER}>
          <OfferScene {...props} />
        </Fade>
      </Sequence>

      <Sequence from={AT_CTA} durationInFrames={CTA}>
        <Fade duration={CTA}>
          <CtaScene {...props} />
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};

// Gesamtdauer für die Composition-Registrierung.
export const KFZ_TOTAL_FRAMES = HOOK + BA + OFFER + CTA;
