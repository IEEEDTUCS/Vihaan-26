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

//panel dropdown
function PanelDropdown({ value, onChange, allRooms }) {
  const [open, setOpen] = useState(false);

  const triggerLabel = value
    ? `Panel ${value}`
    : "-- Select Panel --";

  return (
    <div style={{ position: "relative", width: "100%", marginTop: 6, marginBottom: 12 }}>
      
      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid #444",
          borderRadius: open ? "0.4rem 0.4rem 0 0" : "0.4rem",
          padding: "8px 10px",
          color: value ? "#fff" : "#666",
          fontFamily: "Edu TAS Beginner, sans-serif",
          fontSize: "0.9rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{triggerLabel}</span>
        <span style={{ fontSize: "0.7rem", color: "#888" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown */}
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
            zIndex: 9999,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {allRooms.map((room) => {
            const isSelected = room.room_number === value;

            return (
              <div
                key={room.room_number}
                onClick={() => {
                  onChange(room.room_number);
                  setOpen(false);
                }}
                style={{
                  padding: "10px 12px",
                  color: isSelected ? "#9CA802" : "#fff",
                  fontFamily: "Edu TAS Beginner, sans-serif",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  background: isSelected ? "rgba(156,168,2,0.1)" : "transparent",
                  borderBottom: "1px solid #222",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected
                    ? "rgba(156,168,2,0.1)"
                    : "transparent";
                }}
              >
                Room {room.room_number}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

//room dropdown
//allRooms: [{ room_number: string, availability: number }]
//currentRoomNumber: the room the team is currently assigned to 
function RoomDropdown({ value, onChange, allRooms, currentRoomNumber }) {
  const [open, setOpen] = useState(false);

  const selectedRoom = allRooms.find((r) => r.room_number === value);
  const triggerLabel =
  value === "UNASSIGNED"
    ? "No Room Assigned"
    : selectedRoom
    ? `Room ${selectedRoom.room_number} (${selectedRoom.availability} left)`
    : value
    ? `Room ${value}`
    : "Select Room";

  return (
    <div style={{ position: "relative", width: "100%", marginTop: 6, marginBottom: 12 }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid #444",
          borderRadius: open ? "0.4rem 0.4rem 0 0" : "0.4rem",
          padding: "8px 10px",
          color: value ? "#fff" : "#666",
          fontFamily: "Edu TAS Beginner, sans-serif",
          fontSize: "0.9rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
          boxSizing: "border-box",
        }}
      >
        <span>{triggerLabel}</span>
        <span style={{ fontSize: "0.7rem", color: "#888" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown list */}
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
            zIndex: 9999,
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {/* Unassign */}
          <div
            onClick={() => {
              onChange("UNASSIGNED");
              setOpen(false);
            }}
            style={{
              padding: "10px 12px",
              color: value === "UNASSIGNED" ? "#9CA802" : "#aaa",
              fontFamily: "Edu TAS Beginner, sans-serif",
              fontSize: "0.85rem",
              cursor: "pointer",
              background: value === "UNASSIGNED" ? "rgba(156,168,2,0.1)" : "transparent",
              borderBottom: "1px solid #222",
              fontStyle: "italic",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = value === "UNASSIGNED" ? "rgba(156,168,2,0.1)" : "transparent")
            }
          >
            Unassign Room
          </div>

          {allRooms.map((room) => {
            const isCurrentRoom = room.room_number === currentRoomNumber;
            const isFull = room.availability === 0 && !isCurrentRoom;
            const isSelected = room.room_number === value;

            return (
              <div
                key={room.room_number}
                onClick={() => {
                  if (isFull) return; //blocked
                  onChange(room.room_number);
                  setOpen(false);
                }}
                style={{
                  padding: "10px 12px",
                  color: isFull ? "#555" : isSelected ? "#9CA802" : "#fff",
                  fontFamily: "Edu TAS Beginner, sans-serif",
                  fontSize: "0.85rem",
                  cursor: isFull ? "not-allowed" : "pointer",
                  background: isSelected ? "rgba(156,168,2,0.1)" : "transparent",
                  borderBottom: "1px solid #222",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: isFull ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isFull) e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected ? "rgba(156,168,2,0.1)" : "transparent";
                }}
              >
                <span>
                  Room {room.room_number}
                  {isCurrentRoom && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: "0.7rem",
                        color: "#bba75d",
                        fontStyle: "italic",
                      }}
                    >
                      (current)
                    </span>
                  )}
                </span>

                {/* Right: availability badge */}
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "0.3rem",
                    background: isFull
                      ? "rgba(255,68,68,0.15)"
                      : room.availability <= 2
                      ? "rgba(255,140,26,0.2)"
                      : "rgba(156,168,2,0.15)",
                    color: isFull ? "#ff4444" : room.availability <= 2 ? "#FF8C1A" : "#9CA802",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isFull ? "FULL" : `${room.availability} left`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── TEAM DETAILS MODAL ────────────────────────────────────────────────────────
// allRooms: array of { room_number, availability } from backend
export default function TeamDetailsModal({ team, onClose, onSave, token, allRooms = [] }) {
  const [editedTeam, setEditedTeam] = useState({
    room_number: team.room_number ?? "UNASSIGNED",
    panel_number: "",
    avg_points: 0,
    stars: 0,
    ...team, // spread existing team data over the defaults
  });
  const [saving, setSaving] = useState(false);
  const originalRoomNumber = team.room_number ?? null;

  const handleFieldChange = (field, value) => {
    let validatedValue = value;

    if (field === "stars") {
      if (value === "") validatedValue = 0;
      else validatedValue = Math.max(0, Math.min(5, parseInt(value, 10) || 0));
    } else if (field === "avg_points") {
      if (value === "") validatedValue = 0;
      else validatedValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
    }

    setEditedTeam((prev) => ({ ...prev, [field]: validatedValue }));
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
    boxSizing: "border-box",
  };

  const readonlyInputStyle = {
    ...inputStyle,
    background: "rgba(255,255,255,0.02)",
    color: "#666",
    cursor: "not-allowed",
    pointerEvents: "none",
  };

  const labelStyle = {
    fontFamily: "Bangers",
    fontSize: "0.9rem",
    color: "#9CA802",
    letterSpacing: "0.1em",
    display: "block",
  };

  const formatIST = (dateStr) => {
  const d = new Date(dateStr);

  // 🔧 Fix: subtract 5.5 hours (reverse unwanted shift)
  const corrected = new Date(d.getTime() - (5.5 * 60 * 60 * 1000));

  return corrected.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
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
        {/* Header */}
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

        {/* ── Team Details ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Bangers", fontSize: "1.2rem", color: "#bba75d", marginBottom: 12, letterSpacing: "0.1em" }}>
            Team Details
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Team ID — readonly */}
            <div>
              <label style={labelStyle}>Team ID</label>
              <input type="text" value={editedTeam.team_id ?? ""} readOnly style={readonlyInputStyle} />
            </div>

            {/* Type — readonly */}
            <div>
              <label style={labelStyle}>Type</label>
              <input type="text" value={editedTeam.type ?? ""} readOnly style={readonlyInputStyle} />
            </div>

            {/* ── ROOM DROPDOWN ── */}
            <div>
              <label style={labelStyle}>Room No.</label>
              <RoomDropdown
                value={editedTeam.room_number ?? null}
                onChange={(val) => handleFieldChange("room_number", val)}
                allRooms={allRooms}
                currentRoomNumber={originalRoomNumber}
              />
            </div>

            {/* Panel Number */}
            <div>
              <label style={labelStyle}>Panel No.</label>
              <PanelDropdown
                value={editedTeam.panel_number ?? ""}
                onChange={(val) => handleFieldChange("panel_number", val)}
                allRooms={allRooms}
              />
            </div>

            {/* Avg Points */}
            <div>
              <label style={labelStyle}>Avg Points</label>
              <input
                type="number"
                value={editedTeam.avg_points ?? 0}
                onChange={(e) => handleFieldChange("avg_points", e.target.value)}
                min={0}
                max={100}
                style={inputStyle}
              />
            </div>

            {/* Stars */}
            <div>
              <label style={labelStyle}>Stars (1–5)</label>
              <input
                type="number"
                value={editedTeam.stars ?? 0}
                onChange={(e) => handleFieldChange("stars", e.target.value)}
                min={0}
                max={5}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Repo / Image Link — readonly */}
          <label style={{ ...labelStyle, marginTop: 12 }}>Repo / Image Link</label>
          <input
            type="url"
            value={editedTeam.repo_or_image_link || ""}
            readOnly
            style={readonlyInputStyle}
          />

          {/* Description — readonly */}
          <label style={labelStyle}>Description</label>
          <textarea
            value={editedTeam.description || ""}
            readOnly
            style={{
              ...readonlyInputStyle,
              resize: "vertical",
              minHeight: 80,
            }}
          />
        </div>

        {/* ── Checkpoints ──────────────────────────────────────────────────── */}
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
                  {cp.checkpoint_time
                    ? formatIST(cp.checkpoint_time)
                    : "No Date Provided"}
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

        {/* ── Save / Cancel ─────────────────────────────────────────────────── */}
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
