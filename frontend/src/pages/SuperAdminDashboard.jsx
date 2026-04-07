import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ComicAlert from "../utils/ComicAlert.jsx";

//-------------------------*************----****--------------
//PLZ DONT FORGET TO UPDATE API ENDPOIINTS IN THIS FILE WHEN REAL BACKEND FUNCTIONALITIES USED HERE ARE READY
//-------------------------*************----****--------------

//----ENDPOINTS HAVE BEEN UPDATED

// Import Refactored Sections
import UsersSection from "../utils/Admin/UsersSection";
import TeamsSection from "../utils/Admin/TeamsSection";

const BACKEND = import.meta.env.VITE_BACKEND_URL_VIHAAN || "http://localhost:3000";

// ── MAIN SUPER ADMIN DASHBOARD ────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const { admin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("teams");
  const [allUsers, setAllUsers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const token = localStorage.getItem("authTokenAdmin");
  const displayAdmin = admin;

  // Fetch all users
  const fetchUsers = useCallback(async () => {

    try {
      const res = await fetch(`${BACKEND}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");
      setAllUsers(data.users || []);
    } catch (err) {
      setAlerts([{ message: err.message, severity: 2 }]);
    }

  }, [token]);

  // Fetch all teams
  const fetchTeams = useCallback(async () => {
    
    try {
      const res = await fetch(`${BACKEND}/api/admin/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch teams");
      setAllTeams(data.teams || []);
    } catch (err) {
      setAlerts([{ message: err.message, severity: 2 }]);
    }

  }, [token]);

  // Load data on mount
  useEffect(() => {
    if (!authLoading && admin === null) {
      navigate("/admin");
    }
  }, [authLoading, admin, navigate]);

  useEffect(() => {
    if (admin && token) {
      setLoading(true);
      Promise.all([fetchUsers(), fetchTeams()]).finally(() => setLoading(false));
    }
  }, [admin, token, fetchUsers, fetchTeams]);

  // Save team changes
  const handleSaveTeam = async (editedTeam, token) => {
    console.log("Saving team data:", editedTeam);

    try {
      const updateDetailsReq = fetch(`${BACKEND}/api/admin/team/${editedTeam.team_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_number: editedTeam.room_number,
          ppt_link: editedTeam.ppt_link,
          panel_number: editedTeam.panel_number,
          avg_points: editedTeam.avg_points,
          stars: editedTeam.stars,
        }),
      });

      const checkpointReqs = editedTeam.checkpoints.map((cp) =>
        fetch(`${BACKEND}/api/admin/team/${editedTeam.team_id}/checkpoint`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            round_num: cp.round_num,
            status: cp.status,
          }),
        })
      );

      const allResponses = await Promise.all([updateDetailsReq, ...checkpointReqs]);

      for (const res of allResponses) {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Update failed");
        }
      }

      setAlerts([{ message: "Team & Checkpoints updated successfully! 🎯", severity: 0 }]);
      fetchTeams();
    } catch (err) {
      setAlerts([{ message: err.message, severity: 2 }]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <span className="heading" style={{ fontSize: "2rem", color: "#9CA802" }}>
          Loading...
        </span>
      </div>
    );
  }

  if (!displayAdmin) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans" style={{ background: "#0d0d0d" }}>
      {/* ── Background decorative elements ── */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: "22vw",
          height: "100%",
          backgroundImage: "url(/Faqs/SpotPattern.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "200% 60%",
          backgroundPosition: "0 10%",
          opacity: 0.45,
        }}
      />
      <div
        className="absolute z-0 pointer-events-none"
        style={{
          top: 0,
          right: 0,
          width: "22vw",
          height: "100%",
          backgroundImage: "url(/Faqs/SpotPattern.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "200% 60%",
          backgroundPosition: "100% 10%",
          opacity: 0.45,
        }}
      />

      {/* ── Glowing stars ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[
          { pos: "left-6 top-14", size: "2.2rem", delay: 0 },
          { pos: "right-10 top-20", size: "3rem", delay: 0.4 },
          { pos: "left-[15%] top-[38%]", size: "1.8rem", delay: 0.8 },
          { pos: "right-[18%] top-[22%]", size: "2.5rem", delay: 1.2 },
        ].map((s, i) => (
          <motion.img
            key={i}
            src="/star.svg"
            className={`absolute ${s.pos}`}
            style={{ width: s.size, opacity: 0.45 }}
            animate={{ opacity: [0.2, 0.65, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          />
        ))}
      </div>

      {/* ── Skyline ── */}
      <div className="absolute bottom-0 left-0 w-full flex items-end z-0 pointer-events-none h-44 lg:h-64">
        <img src="/Schedule/skyline1.png" alt="" className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]" />
        <img src="/Schedule/skyline1.png" alt="" className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-0 min-h-screen">
        {/* ── SIDEBAR ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            maxWidth: "200px",
            background: "rgba(0,0,0,0.4)",
            borderRight: "1px solid #333",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Bangers", fontSize: "1.2rem", color: "#9CA802", letterSpacing: "0.15em", marginBottom: 4 }}>
              Admin Panel
            </h3>
            <p style={{ fontFamily: "Edu TAS Beginner, sans-serif", fontSize: "0.8rem", color: "#aaa" }}>
              {displayAdmin.name}
            </p>
          </div>

          {["teams", "users"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                fontFamily: "Bangers",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "10px 14px",
                background: activeSection === section ? "rgba(156,168,2,0.2)" : "transparent",
                color: activeSection === section ? "#9CA802" : "#aaa",
                border: activeSection === section ? "2px solid #9CA802" : "1px solid #444",
                borderRadius: "0.4rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {section === "teams" ? "🎯 Teams" : "👥 Users"}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <button
            onClick={handleLogout}
            style={{
              fontFamily: "Bangers",
              fontSize: "0.95rem",
              letterSpacing: "0.1em",
              color: "#ff4444",
              border: "2px solid #ff4444",
              borderRadius: "0.4rem",
              padding: "8px 14px",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Logout
          </button>
        </motion.div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: "24px", overflowY: "auto", pb: 300 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} key={activeSection}>
            {activeSection === "users" ? (
              <UsersSection allUsers={allUsers} loading={loading} />
            ) : (
              <TeamsSection allTeams={allTeams} loading={loading} onSave={handleSaveTeam} token={token} />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Alerts ── */}
      <ComicAlert alerts={alerts} onClose={() => setAlerts([])} />
    </div>
  );
}