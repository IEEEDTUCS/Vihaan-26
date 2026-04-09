import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DarkSelect from "../Admin//DarkSelect";
import * as XLSX from "xlsx";

// ── USERS TABLE ───────────────────────────────────────────────────────────────
export default function UsersSection({ allUsers, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPresent, setFilterPresent] = useState(null); // null = all, true = present, false = absent
  const [filterRole, setFilterRole] = useState(null); // null = all, "LEADER", "MEMBER"
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;


  const thStyle = {
    padding: "12px",
    textAlign: "left",
    color: "#9CA802",
    fontSize: "0.9rem",
    fontWeight: 600,
  };

  const tdStyle = {
    padding: "10px 12px",
    color: "#ccc",
    fontSize: "0.85rem",
  };

  // ── CLEAR FILTERS LOGIC ─────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchTerm("");
    setFilterPresent(null);
    setFilterRole(null);
    setPage(1);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchSearch =
        searchTerm === "" ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.college_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPresent = filterPresent === null || user.is_present === filterPresent;
      const matchRole = filterRole === null || user.role === filterRole;

      return matchSearch && matchPresent && matchRole;
    });
  }, [allUsers, searchTerm, filterPresent, filterRole]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, page]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const downloadExcel = () => {
    if (allUsers.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(allUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "All_Users_Data.xlsx");
  };

  const isFilterActive = searchTerm || filterPresent !== null || filterRole !== null;
  const showDownload = !isFilterActive && allUsers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Bangers", fontSize: "2rem", color: "#9CA802", letterSpacing: "0.15em", margin: 0 }}>
          Users Directory
        </h2>

        <div style={{ display: "flex", gap: "10px" }}>
           {/* ── DOWNLOAD BUTTON ── */}
           {showDownload && (
            <button
              onClick={downloadExcel}
              style={{
                fontFamily: "Bangers",
                fontSize: "0.9rem",
                color: "#000",
                background: "#bba75d",
                border: "none",
                padding: "4px 12px",
                borderRadius: "0.3rem",
                cursor: "pointer",
                letterSpacing: "0.05em"
              }}>Download Excel</button>
          )}
        
        {/* Clear Filters Button */}
        {isFilterActive && (
          <button
            onClick={clearFilters}
            style={{
              fontFamily: "Bangers",
              fontSize: "0.9rem",
              color: "#ff4444",
              background: "transparent",
              border: "1px solid #ff4444",
              padding: "4px 12px",
              borderRadius: "0.3rem",
              cursor: "pointer",
              letterSpacing: "0.05em"
            }}
          >
            Clear All
          </button>
        )}
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search name, team, college..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid #444",
            borderRadius: "0.4rem",
            padding: "10px 12px",
            color: "#fff",
            fontFamily: "Edu TAS Beginner, sans-serif",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
        <DarkSelect
          value={filterPresent === null ? "" : filterPresent ? "Present" : "Absent"}
          onChange={(val) => {
            if (val === "Present") setFilterPresent(true);
            else if (val === "Absent") setFilterPresent(false);
            else setFilterPresent(null);
            setPage(1);
          }}
          options={["Present", "Absent"]}
          placeholder="-- Presence --"
        />
        <DarkSelect
          value={filterRole || ""}
          onChange={(val) => {
            setFilterRole(val || null);
            setPage(1);
          }}
          options={["LEADER", "MEMBER"]}
          placeholder="-- Role --"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontFamily: "Edu TAS Beginner, sans-serif" }}>
          Loading users...
        </div>
      ) : paginatedUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontFamily: "Edu TAS Beginner, sans-serif" }}>
          No users found.
        </div>
      ) : (
        <>
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #333",
              borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Edu TAS Beginner, sans-serif",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #444", backgroundColor: "rgba(156,168,2,0.08)" }}>
                  <th style={thStyle}> Username </th>
                  <th style={thStyle}> Team </th>
                  <th style={thStyle}> Team ID </th>
                  <th style={thStyle}> Role </th>
                  <th style={thStyle}> College </th>
                  <th style={thStyle}> Email </th>
                  <th style={thStyle}> RSVP </th>
                  <th style={thStyle}> Present </th>
                  <th style={thStyle}> Room </th>
                  <th style={thStyle}> Food </th>
                  <th style={thStyle}> Bedsheet </th>
                  <th style={thStyle}> QR Hash </th>
                  <th style={thStyle}> Created At </th>
                  <th style={thStyle}> Updated At </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, idx) => (
                  <tr
                    key={user._id || idx}
                    style={{
                      borderBottom: "1px solid #222",
                      backgroundColor: idx % 2 === 0 ? "rgba(47, 47, 47, 0.7)" : "rgb(0, 0, 0, 0.7)",
                    }}
                  >
                    <td style={tdStyle}>{user.username}</td>
                    <td style={tdStyle}>{user.team_name || "—"}</td>
                    <td style={tdStyle}>{user.team_id}</td>

                    <td style={tdStyle}>
                      <span style={{ color: user.role === "LEADER" ? "#bba75d" : "#888", fontWeight: 600 }}>
                        {user.role}
                      </span>
                    </td>

                    <td style={tdStyle}>{user.college_name || "—"}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.rsvp_code || "—"}</td>

                    <td style={tdStyle}>
                      <span style={{ color: user.is_present ? "#9CA802" : "#ff4444", fontWeight: 600 }}>
                        {user.is_present ? "✓" : "✗"}
                      </span>
                    </td>

                    <td style={tdStyle}>{user.room_allot || "—"}</td>
                    <td style={tdStyle}>{user.food_count ?? "—"}</td>
                    <td style={tdStyle}>{user.bedsheet_taken ? "✓" : "✗"}</td>

                    <td style={tdStyle}>{user.qr_hash || "—"}</td>
                    <td style={tdStyle}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                    </td>
                    <td style={tdStyle}>
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                fontFamily: "Bangers",
                fontSize: "0.9rem",
                padding: "8px 14px",
                background: page === 1 ? "#444" : "#9CA802",
                color: page === 1 ? "#666" : "#000",
                border: "none",
                borderRadius: "0.3rem",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Prev
            </button>
            <span style={{ fontFamily: "Edu TAS Beginner, sans-serif", color: "#aaa" }}>
              Page {page} of {totalPages} ({filteredUsers.length} users)
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                fontFamily: "Bangers",
                fontSize: "0.9rem",
                padding: "8px 14px",
                background: page === totalPages ? "#444" : "#9CA802",
                color: page === totalPages ? "#666" : "#000",
                border: "none",
                borderRadius: "0.3rem",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}