import React, { useState } from "react";

// ── DARK SELECT DROPDOWN ──────────────────────────────────────────────────────
export default function DarkSelect({ value, onChange, options, placeholder, style }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", ...style }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid #444",
          borderRadius: open ? "0.4rem 0.4rem 0 0" : "0.4rem",
          padding: "10px 12px",
          color: value ? "#fff" : "#666",
          fontFamily: "Edu TAS Beginner, sans-serif",
          fontSize: "0.95rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <span>{value || placeholder}</span>
        <span style={{ fontSize: "0.7rem", color: "#888" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#111",
            border: "1px solid #444",
            borderTop: "none",
            borderRadius: "0 0 0.4rem 0.4rem",
            zIndex: 999,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                padding: "10px 12px",
                color: opt === value ? "#9CA802" : "#fff",
                fontFamily: "Edu TAS Beginner, sans-serif",
                fontSize: "0.95rem",
                cursor: "pointer",
                background: opt === value ? "rgba(156,168,2,0.1)" : "transparent",
                borderBottom: "1px solid #222",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = opt === value ? "rgba(156,168,2,0.1)" : "transparent")
              }
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}