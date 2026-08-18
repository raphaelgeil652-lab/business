import React from "react";
import { Composition } from "remotion";
import { KfzPromoAd, KFZ_TOTAL_FRAMES } from "./kfz/KfzPromoAd";
import { kfzPromoSchema } from "./kfz/types";
import { aufbereitungBeispiel, folierungBeispiel } from "./kfz/presets";

// Jede <Composition> = ein renderbares Video.
// Neuer Kunde -> neue Composition mit eigenem Preset (defaultProps).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KfzAufbereitung"
        component={KfzPromoAd}
        durationInFrames={KFZ_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        schema={kfzPromoSchema}
        defaultProps={aufbereitungBeispiel}
      />
      <Composition
        id="KfzFolierung"
        component={KfzPromoAd}
        durationInFrames={KFZ_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        schema={kfzPromoSchema}
        defaultProps={folierungBeispiel}
      />
    </>
  );
};
