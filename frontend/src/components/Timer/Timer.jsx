import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-04-11T10:00:00");

function getTimeLeft() {
  const now = new Date();
  const diff = TARGET_DATE - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// 📱 track screen width
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );

  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return width;
}

// 📏 responsive scaling helper
function scale(width, min, max, minW = 320, maxW = 1200) {
  const w = Math.min(Math.max(width, minW), maxW);
  return min + ((w - minW) / (maxW - minW)) * (max - min);
}

function FlipTile({ value, label, sz }) {
  const display = String(value).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: sz.gap }}>
      <div
        style={{
          width: sz.tileW,
          height: sz.tileH,
          background: "linear-gradient(145deg, #4a4a36, #1a1a12)",
          borderRadius: sz.radius,
          border: `${sz.border}px solid #5a5a40`,
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 6px rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: sz.innerPad,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, #050505 0%, #1a1a1a 50%, #050505 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: sz.numFont,
              fontWeight: "600",
              color: "#ffb300",
              textShadow:
                "0 0 10px rgba(255,170,0,0.9), 0 0 3px #fff",
              letterSpacing: sz.letterSpacing,
            }}
          >
            {display}
          </span>
        </div>
      </div>

      <span
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: sz.labelFont,
          letterSpacing: "1px",
          color: "#a8a480",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Timer() {
  const [time, setTime] = useState(getTimeLeft());
  const width = useWindowWidth();

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // 📏 responsive sizes
  const sz = {
    tileW: scale(width, 50, 90),
    tileH: scale(width, 40, 70),
    numFont: scale(width, 18, 36),
    labelFont: scale(width, 8, 12),
    gap: scale(width, 4, 8),
    innerPad: scale(width, 3, 6),
    radius: scale(width, 3, 6),
    border: width < 500 ? 1.5 : 2,
    letterSpacing: scale(width, 1, 3),
    containerPadX: scale(width, 10, 20),
    containerPadY: scale(width, 8, 14),
    titleFont: scale(width, 18, 32),
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", opacity: 0.95, height: "40px" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600&family=Oswald:wght@700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          background: "linear-gradient(180deg, #3a3a2e 0%, #1c1c14 100%)",
          border: "3px solid #6b6b50",
          borderRadius: "9px",
          paddingBottom: sz.containerPadY,
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.08),
            inset 0 -3px 6px rgba(0,0,0,0.9),
            0 10px 30px rgba(0,0,0,0.9)
          `,
          maxWidth: "95%",
        }}
      >
        {/* TOP BAR */}
          <div
            style={{
              background:
                "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 60%, #000000 100%)",
              borderBottom: "3px solid #2a2a2a",
              padding: `${sz.containerPadY}px ${sz.containerPadX}px`,
              textAlign: "center",
              boxShadow: "inset 0 2px 2px rgba(255,255,255,0.1)",
            }}
          >
            <span className="
                  heading
                  
                  border-b-2
                  border-dotted
                  border-white/40
                "
                style={{ filter: "drop-shadow(1px 0 1px white)", fontSize: sz.tileH }}
              
            >
              TIME LEFT
            </span>
          </div>

          {/* TILES */}
        <div
          style={{
            display: "flex",
            gap: sz.gap,
            padding: `${sz.containerPadY}px ${sz.containerPadX}px`,
            justifyContent: "center",
            flexWrap: "nowrap",
          }}
        >
          <FlipTile value={time.days} label="DAYS" sz={sz} />
          <FlipTile value={time.hours} label="HOURS" sz={sz} />
          <FlipTile value={time.minutes} label="MINUTES" sz={sz} />
          <FlipTile value={time.seconds} label="SECONDS" sz={sz} />
        </div>
      </div>
    </div>
  );
}