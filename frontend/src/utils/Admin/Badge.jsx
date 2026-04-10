import React from "react";

// ── BADGE COMPONENT ───────────────────────────────────────────────────────────
export default function Badge({ label, value, active, color }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 14px",
        background: active ? `rgba(${color},0.15)` : "rgba(255,255,255,0.05)",
        border: `2px solid ${active ? color : "#444"}`,
        borderRadius: "0.5rem",
        minWidth: 80,
      }}
    >
      <span
        style={{
          fontFamily: "Bangers",
          fontSize: "clamp(1rem, 3vw, 1.5rem)",
          color: active ? color : "#888",
          letterSpacing: "0.1em",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "Edu TAS Beginner, sans-serif",
          fontSize: "0.7rem",
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}