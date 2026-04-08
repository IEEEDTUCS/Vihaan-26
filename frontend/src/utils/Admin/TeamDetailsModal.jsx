import React, { useState } from "react";
import { motion } from "framer-motion";
import DarkSelect from "../Admin/DarkSelect";

// ── STATUS COLOR MAP ──────────────────────────────────────────────────────────
const statusColors = {
  PENDING: "#FF8C1A",
  VERIFIED: "#9CA802",
  FLAGGED: "#ff6633",
  SUSPICIOUS: "#ff4444",
};

// ── TEAM DETAILS MODAL ────────────────────────────────────────────────────────
export default function TeamDetailsModal({ team, onClose, onSave, token }) {
  const [editedTeam, setEditedTeam] = useState({
  room_number: "",
  ppt_link: "",
  panel_number: "",
  avg_points: 0,
  stars: 0,
  ...team //spreading existing team data over the defaults
});
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    let validatedValue = value;

    if (field === "stars") {
      if (value === "") validatedValue = 0;
      else validatedValue = Math.max(0, Math.min(5, parseInt(value, 10) || 0));
    }
    else if (field === "avg_points") {
      if (value === "") validatedValue = 0; 
      else validatedValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
    }
    else {
      validatedValue = value;
    }

    // console.log(`Updating ${field} to:`, validatedValue)

    setEditedTeam((prev) => ({
      ...prev,
      [field]: validatedValue
    }));
  };

  const handleCheckpointStatusChange = (roundNum, newStatus) => {
    setEditedTeam((prev) => ({
      ...prev,
      checkpoints: prev.checkpoints.map((cp) =>
        cp.round_num === roundNum ? { ...cp, status: newStatus } : cp
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // console.log("Saving team data:", editedTeam);
      await onSave(editedTeam, team, token);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #444",
    borderRadius: "0.4rem",
    padding: "8px 10px",
    color: "#fff",
    fontFamily: "Edu TAS Beginner, sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    marginTop: 6,
    marginBottom: 12,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111",
          border: "2px solid #9CA802",
          borderRadius: "0.5rem",
          padding: 24,
          maxWidth: 700,
          maxHeight: "85vh",
          overflowY: "auto",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "Bangers", fontSize: "1.8rem", color: "#9CA802", letterSpacing: "0.1em" }}>
            {editedTeam.team_name}
          </h2>
          <button
            onClick={onClose}
            style={{
              fontFamily: "Bangers",
              fontSize: "1.5rem",
              background: "transparent",
              border: "none",
              color: "#888",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Team Details */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Bangers", fontSize: "1.2rem", color: "#bba75d", marginBottom: 12, letterSpacing: "0.1em" }}>
            Team Details
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Team ID", "team_id", true],
              ["Type", "type", true],
              ["Room No.", "room_number", false],
              ["PPT Link", "ppt_link", false],
              ["Panel No.", "panel_number", false],
              ["Avg Points", "avg_points", false],
              ["Stars (1-5)", "stars", false],
            ].map(([label, field, readonly]) => (
              <div key={field}>
                <label style={{ fontFamily: "Bangers", fontSize: "0.9rem", color: "#9CA802", letterSpacing: "0.1em" }}>
                  {label}
                </label>
                <input
                  type={["avg_points", "stars"].includes(field) ? "number" : "text"}
                  value={editedTeam[field] ?? ""} // Use nullish coalescing
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  readOnly={readonly}
                  style={{
                    ...inputStyle,
                    background: readonly ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                    color: readonly ? "#666" : "#fff",
                    pointerEvents: readonly ? "none" : "auto", // Added to ensure no interaction on readonly
                    cursor: readonly ? "not-allowed" : "text",
                  }}
                />
              </div>
            ))}
          </div>

          <label style={{ fontFamily: "Bangers", fontSize: "0.9rem", color: "#9CA802", letterSpacing: "0.1em", display: "block", marginTop: 12 }}>
            Repo/Image Link
          </label>
          <input
            type="url"
            value={editedTeam.repo_or_image_link || ""}
            onChange={(e) => handleFieldChange("repo_or_image_link", e.target.value)}
            readOnly
            style={{ ...inputStyle, background: "rgba(255,255,255,0.02)", color: "#666", cursor: "not-allowed" }}
          />

          <label style={{ fontFamily: "Bangers", fontSize: "0.9rem", color: "#9CA802", letterSpacing: "0.1em", display: "block" }}>
            Description
          </label>
          <textarea
            value={editedTeam.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            readOnly
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: 80,
              background: "rgba(255,255,255,0.02)",
              color: "#666",
              cursor: "not-allowed",
            }}
          />
        </div>

        {/* Checkpoints */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Bangers", fontSize: "1.2rem", color: "#bba75d", marginBottom: 12, letterSpacing: "0.1em" }}>
            Checkpoints
          </h3>
          {editedTeam.checkpoints?.map((cp) => (
            <div
              key={cp.round_num}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${statusColors[cp.status]}`,
                borderRadius: "0.4rem",
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "Bangers", fontSize: "1rem", color: "#fff", letterSpacing: "0.1em" }}>
                  Round {cp.round_num}
                </span>
                <span style={{ fontFamily: "Edu TAS Beginner, sans-serif", fontSize: "0.75rem", color: "#888" }}>
                  {cp.checkpoint_time ? (
                    new Date(cp.checkpoint_time).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  ) : (
                    "No Date Provided"
                  )}
                </span>
              </div>
              {cp.submit_link && (
                <a
                  href={cp.submit_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "Edu TAS Beginner, sans-serif",
                    fontSize: "0.8rem",
                    color: "#4a90e2",
                    textDecoration: "underline",
                    display: "block",
                    marginBottom: 8,
                    wordBreak: "break-all",
                  }}
                >
                  {cp.submit_link}
                </a>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontFamily: "Bangers", fontSize: "0.8rem", color: "#9CA802" }}>Status:</label>
                <DarkSelect
                  value={cp.status}
                  onChange={(val) => handleCheckpointStatusChange(cp.round_num, val)}
                  options={["PENDING", "VERIFIED", "FLAGGED", "SUSPICIOUS"]}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save/Cancel Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontFamily: "Bangers",
              fontSize: "1rem",
              letterSpacing: "0.15em",
              color: "#000",
              background: saving ? "#666" : "#9CA802",
              border: "none",
              borderRadius: "0.4rem",
              padding: "10px 20px",
              cursor: saving ? "not-allowed" : "pointer",
              flex: 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: "Bangers",
              fontSize: "1rem",
              letterSpacing: "0.15em",
              color: "#ff4444",
              background: "transparent",
              border: "2px solid #ff4444",
              borderRadius: "0.4rem",
              padding: "8px 20px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}