import { motion, AnimatePresence } from "framer-motion";

// severity: 0 = info, 1 = orange, 2 = orange-red, 3 = red
const severityColor = {
  0: "#9CA802",
  1: "#FF8C1A",
  2: "#FF4500",
  3: "#FF0000",
};

const severityLabel = {
  0: "INFO",
  1: "WARNING",
  2: "ALERT",
  3: "FLAGGED",
};

export default function ComicAlert({ alerts, onClose }) {
  // alerts: [{ message: string, severity: 0|1|2|3 }]
  if (!alerts || alerts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="comic-alert"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 24,
          zIndex: 99999,
          width: "min(480px, 92vw)",
          background: "#0d0d0d",
          border: `2px solid ${severityColor[Math.max(...alerts.map((a) => a.severity))]}`,
          borderRadius: "0.5rem",
          overflow: "hidden",
          boxShadow: `0 0 24px ${severityColor[Math.max(...alerts.map((a) => a.severity))]}55`,
        }}
      >
        {/* Dot texture background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/Schedule/bg-texture.png')",
            backgroundSize: "cover",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "transparent",
            border: `1px solid #555`,
            borderRadius: "50%",
            width: 28,
            height: 28,
            color: "#aaa",
            cursor: "pointer",
            fontFamily: "Bangers",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          ✕
        </button>

        <div style={{ position: "relative", zIndex: 1, padding: "14px 44px 14px 16px" }}>
          {alerts.map((alert, i) => {
            const color = severityColor[alert.severity] || severityColor[1];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: i < alerts.length - 1 ? 10 : 0,
                  paddingBottom: i < alerts.length - 1 ? 10 : 0,
                  borderBottom: i < alerts.length - 1 ? "1px solid #222" : "none",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    width: 4,
                    minHeight: 36,
                    borderRadius: 2,
                    background: color,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontFamily: "Bangers",
                      fontSize: "0.85rem",
                      letterSpacing: "0.15em",
                      color,
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    {severityLabel[alert.severity]}
                  </span>
                  <span
                    style={{
                      fontFamily: "Edu TAS Beginner, sans-serif",
                      fontSize: "0.9rem",
                      color: "#ddd",
                      lineHeight: 1.4,
                    }}
                  >
                    {alert.message}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
