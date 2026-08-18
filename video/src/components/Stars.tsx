import React from "react";
import { theme } from "../theme";

// Volle Sterne (Playbook-Trust-Regel: Sterne voll anzeigen, Zahl max. 4,9).
export const Stars: React.FC<{ size?: number }> = ({ size = 44 }) => {
  return (
    <div style={{ display: "flex", gap: size * 0.12 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <path
            fill={theme.amber}
            d="M12 2l2.9 6.26L21.8 9.3l-5 4.87 1.2 6.83L12 17.77 6 21l1.2-6.83-5-4.87 6.9-1.04L12 2z"
          />
        </svg>
      ))}
    </div>
  );
};
