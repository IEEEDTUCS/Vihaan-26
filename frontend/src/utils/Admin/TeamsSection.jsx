import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../Admin/Badge";
import DarkSelect from "../Admin/DarkSelect";
import TeamDetailsModal from "../Admin/TeamDetailsModal";

// ── TEAMS SECTION ─────────────────────────────────────────────────────────────
export default function TeamsSection({ allTeams, loading, onSave, token }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [sortBy, setSortBy] = useState("team_name");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // ── CLEAR FILTERS LOGIC ─────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearchTerm("");
    setFilterType(null);
    setFilterCategory(null);
    setSortBy("team_name");
    setPage(1);
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    allTeams.forEach((team) => {
      team.category?.forEach((cat) => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [allTeams]);

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return allTeams.filter((team) => {
      const matchSearch =
        searchTerm === "" ||
        team.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.team_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = filterType === null || team.type === filterType;
      const matchCategory =
        filterCategory === null || team.category?.includes(filterCategory);

      return matchSearch && matchType && matchCategory;
    });
  }, [allTeams, searchTerm, filterType, filterCategory]);

  // Sorted teams
  const sortedTeams = useMemo(() => {
    const sorted = [...filteredTeams];
    if (sortBy === "avg_points") {
      sorted.sort((a, b) => (b.avg_points || 0) - (a.avg_points || 0));
    } else if (sortBy === "stars") {
      sorted.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else {
      sorted.sort((a, b) => a.team_name.localeCompare(b.team_name));
    }
    return sorted;
  }, [filteredTeams, sortBy]);

  const paginatedTeams = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedTeams.slice(start, start + itemsPerPage);
  }, [sortedTeams, page]);

  const totalPages = Math.ceil(sortedTeams.length / itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Bangers", fontSize: "2rem", color: "#bba75d", letterSpacing: "0.15em", margin: 0 }}>
          Teams Management
        </h2>

        {/* Clear Filters Button */}
        {(searchTerm || filterType || filterCategory || sortBy !== "team_name") && (
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
            Reset All
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search team name or ID..."
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
          value={filterType || ""}
          onChange={(val) => {
            setFilterType(val || null);
            setPage(1);
          }}
          options={["WOMEN", "FRESHERS", "IEEE", "SOFTWARE", "HARDWARE"]}
          placeholder="-- Type --"
        />
        <DarkSelect
          value={filterCategory || ""}
          onChange={(val) => {
            setFilterCategory(val || null);
            setPage(1);
          }}
          options={categories}
          placeholder="-- Category --"
        />
        <DarkSelect
          value={sortBy}
          onChange={setSortBy}
          options={["team_name", "avg_points", "stars"]}
          placeholder="-- Sort --"
        />
      </div>

      {/* Grid of Teams */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontFamily: "Edu TAS Beginner, sans-serif" }}>
          Loading teams...
        </div>
      ) : paginatedTeams.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontFamily: "Edu TAS Beginner, sans-serif" }}>
          No teams found.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            {paginatedTeams.map((team) => (
              <motion.div
                key={team.team_id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTeam(team)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid #333",
                  borderRadius: "0.5rem",
                  padding: 16,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#9CA802";
                  e.currentTarget.style.background = "rgba(156,168,2,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                  <div>
                    <h3 style={{ fontFamily: "Bangers", fontSize: "1.1rem", color: "#9CA802", letterSpacing: "0.1em", margin: 0 }}>
                      {team.team_name}
                    </h3>
                    <span style={{ fontFamily: "Edu TAS Beginner, sans-serif", fontSize: "0.75rem", color: "#888" }}>
                      ID: {team.team_id}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Bangers",
                      fontSize: "0.8rem",
                      color: "#000",
                      background: team.type === "WOMEN" ? "#FF69B4" : team.type === "HARDWARE" ? "#FF8C1A" : "#4a90e2",
                      padding: "4px 10px",
                      borderRadius: "0.3rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {team.type}
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontFamily: "Edu TAS Beginner, sans-serif", fontSize: "0.8rem", color: "#aaa", margin: "4px 0" }}>
                    Room: <strong style={{ color: "#fff" }}>{team.room_number || "—"}</strong>
                  </p>
                  <p style={{ fontFamily: "Edu TAS Beginner, sans-serif", fontSize: "0.8rem", color: "#aaa", margin: "4px 0" }}>
                    Panel: <strong style={{ color: "#fff" }}>{team.panel_number || "—"}</strong>
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <Badge label="Avg Pts" value={team.avg_points || 0} active={team.avg_points > 0} color="156,168,2" />
                  <Badge label="Stars" value={team.stars || 0} active={team.stars > 0} color="187,167,93" />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {team.category?.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      style={{
                        fontFamily: "Edu TAS Beginner, sans-serif",
                        fontSize: "0.65rem",
                        color: "#fff",
                        background: "rgba(74,144,226,0.3)",
                        padding: "2px 8px",
                        borderRadius: "0.2rem",
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                  {team.category?.length > 2 && (
                    <span style={{ fontFamily: "Edu TAS Beginner, sans-serif", fontSize: "0.65rem", color: "#888" }}>
                      +{team.category.length - 2}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTeam(team);
                  }}
                  style={{
                    fontFamily: "Bangers",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    color: "#000",
                    background: "#bba75d",
                    border: "none",
                    borderRadius: "0.3rem",
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginTop: 10,
                    width: "100%",
                  }}
                >
                  View Details
                </button>
              </motion.div>
            ))}
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
                background: page === 1 ? "#444" : "#bba75d",
                color: page === 1 ? "#666" : "#000",
                border: "none",
                borderRadius: "0.3rem",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Prev
            </button>
            <span style={{ fontFamily: "Edu TAS Beginner, sans-serif", color: "#aaa" }}>
              Page {page} of {totalPages} ({sortedTeams.length} teams)
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                fontFamily: "Bangers",
                fontSize: "0.9rem",
                padding: "8px 14px",
                background: page === totalPages ? "#444" : "#bba75d",
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

      {/* Team Details Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <TeamDetailsModal
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onSave={onSave}
            token={token}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}