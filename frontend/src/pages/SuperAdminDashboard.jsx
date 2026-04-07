import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ComicAlert from "../utils/ComicAlert.jsx";
import mockData from "./mockData.json";

//-------------------------*************----****--------------
//PLZ DONT FORGET TO UPDATE API ENDPOIINTS IN THIS FILE WHEN REAL BACKEND FUNCTIONALITIES USED HERE ARE READY
//-------------------------*************----****--------------

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

  const token = localStorage.getItem("authTokenAdmin") || "DEMO_TOKEN";
  const isTestMode = localStorage.getItem("ADMIN_TEST_MODE") === "true";
  const displayAdmin = admin || (isTestMode ? { id: "debug", name: "Test Admin", role: "SUPER_ADMIN" } : null);

  // Mock data for development/testing
  // const mockUsers = [
  //   { _id: "1", username: "alice_dev", team_name: "Team Alpha", role: "LEADER", college_name: "DTU", email: "alice@dtu.ac.in", rsvp_code: "RSVP001", is_present: true, room_allot: "101", food_count: 2, bedsheet_taken: true },
  //   { _id: "2", username: "bob_code", team_name: "Team Alpha", role: "MEMBER", college_name: "BITS", email: "bob@bits.ac.in", rsvp_code: "RSVP002", is_present: true, room_allot: "101", food_count: 1, bedsheet_taken: false },
  //   { _id: "3", username: "charlie_dev", team_name: "Team Beta", role: "LEADER", college_name: "IIT Delhi", email: "charlie@iit.ac.in", rsvp_code: "RSVP003", is_present: false, room_allot: null, food_count: 0, bedsheet_taken: false },
  //   { _id: "4", username: "diana_hack", team_name: "Team Beta", role: "MEMBER", college_name: "VIT", email: "diana@vit.ac.in", rsvp_code: "RSVP004", is_present: true, room_allot: "102", food_count: 2, bedsheet_taken: true },
  //   { _id: "5", username: "evan_code", team_name: "Team Gamma", role: "LEADER", college_name: "DTU", email: "evan@dtu.ac.in", rsvp_code: "RSVP005", is_present: true, room_allot: "103", food_count: 1, bedsheet_taken: true },
  // ];

  // const mockTeams = [
  //   { team_id: "T001", team_name: "Team Alpha", type: "SOFTWARE", category: ["FinTech", "AI"], description: "Financial AI Platform", repo_or_image_link: "https://github.com/team-alpha/repo", room_number: "101", panel_number: "P1", avg_points: 85, stars: 4, checkpoints: [
  //     { round_num: 1, checkpoint_time: new Date("2026-04-11T23:00:00"), submit_link: "https://github.com/team-alpha/commit/abc123", submitted_at: new Date("2026-04-11T23:15:00"), status: "VERIFIED" },
  //     { round_num: 2, checkpoint_time: new Date("2026-04-12T01:00:00"), submit_link: "https://github.com/team-alpha/commit/def456", submitted_at: new Date("2026-04-12T01:10:00"), status: "VERIFIED" },
  //     { round_num: 3, checkpoint_time: new Date("2026-04-12T05:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //     { round_num: 4, checkpoint_time: new Date("2026-04-12T09:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //   ]},
  //   { team_id: "T002", team_name: "Team Beta", type: "HARDWARE", category: ["IoT"], description: "Smart Home System", repo_or_image_link: "https://example.com/hardware.jpg", room_number: "102", panel_number: "P2", avg_points: 92, stars: 5, checkpoints: [
  //     { round_num: 1, checkpoint_time: new Date("2026-04-11T23:00:00"), submit_link: "https://example.com/image1.jpg", submitted_at: new Date("2026-04-11T23:20:00"), status: "VERIFIED" },
  //     { round_num: 2, checkpoint_time: new Date("2026-04-12T01:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //     { round_num: 3, checkpoint_time: new Date("2026-04-12T05:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //     { round_num: 4, checkpoint_time: new Date("2026-04-12T09:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //   ]},
  //   { team_id: "T003", team_name: "Team Gamma", type: "FRESHERS", category: ["WebDev"], description: "E-commerce Platform", repo_or_image_link: "https://github.com/team-gamma/repo", room_number: "103", panel_number: "P1", avg_points: 78, stars: 3, checkpoints: [
  //     { round_num: 1, checkpoint_time: new Date("2026-04-11T23:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //     { round_num: 2, checkpoint_time: new Date("2026-04-12T01:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //     { round_num: 3, checkpoint_time: new Date("2026-04-12T05:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //     { round_num: 4, checkpoint_time: new Date("2026-04-12T09:00:00"), submit_link: null, submitted_at: null, status: "PENDING" },
  //   ]},
  // ];

  // ── TEMPORARY: Using mock data from mockData.json for local testing ──
  // TO DELETE: Remove these lines when switching back to actual API calls
  const usersData = mockData.users;
  const teamsData = mockData.teams;

  // Fetch all users
  const fetchUsers = useCallback(async () => {

    // ── ACTUAL CODE (COMMENTED OUT FOR LOCAL TESTING) ──

    // try {
    //   const res = await fetch(`${BACKEND}/api/admin/users`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.error || "Failed to fetch users");
    //   setAllUsers(data.users || []);
    // } catch (err) {
    //   // Fallback to mock data
    //   console.log("Using mock user data for testing");
    //   setAllUsers(mockUsers);
    // }

    // ── DUMMY CODE FOR LOCAL TESTING ──

    console.log("Fetching users from mockData.json");
    setAllUsers(usersData);
  }, [usersData]);

  // Fetch all teams
  const fetchTeams = useCallback(async () => {

    // ── ACTUAL CODE (COMMENTED OUT FOR LOCAL TESTING) ──
    
    // try {
    //   const res = await fetch(`${BACKEND}/api/admin/teams`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.error || "Failed to fetch teams");
    //   setAllTeams(data.teams || []);
    // } catch (err) {
    //   // Use mock data for development
    //   console.log("Using mock team data for testing");
    //   setAllTeams(mockTeams);
    // }

    // ── DUMMY CODE FOR LOCAL TESTING ──
    console.log("Fetching teams from mockData.json");
    setAllTeams(teamsData);
  }, [teamsData]);

  // Load data on mount
  useEffect(() => {
    if (!authLoading && !admin && !isTestMode) {
      navigate("/login");
    }
  }, [authLoading, admin, navigate, isTestMode]);

  useEffect(() => {
    if ((admin || isTestMode) && token) {
      setLoading(true);
      Promise.all([fetchUsers(), fetchTeams()]).finally(() => setLoading(false));
    }
  }, [admin, token, fetchUsers, fetchTeams, isTestMode]);

  // Save team changes
  const handleSaveTeam = async (editedTeam, token) => {
    // ── ACTUAL CODE (COMMENTED OUT FOR LOCAL TESTING) ──
    // try {
    //   const res = await fetch(`${BACKEND}/api/admin/teams/${editedTeam.team_id}`, {

    //     method: "PUT",    //---------------------------------assuming the API uses PUT for updates; change to PATCH if needed
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //       panel_number: editedTeam.panel_number,
    //       avg_points: editedTeam.avg_points,
    //       stars: editedTeam.stars,
    //       checkpoints: editedTeam.checkpoints,
    //     }),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.error || "Failed to save team");
    //   setAlerts([
    //     {
    //       message: "Team updated successfully",
    //       severity: 0,
    //     },
    //   ]);
    //   fetchTeams();
    // } catch (err) {
    //   setAlerts([{ message: err.message, severity: 2 }]);
    // }

    // ── DUMMY CODE FOR LOCAL TESTING ──
    console.log("Saving team data to mock storage (not persisted):", editedTeam);
    setAlerts([
      {
        message: "✅ Team data saved locally (demo mode - changes not persisted)",
        severity: 0,
      },
    ]);
    //in real scenario, fetchTeams() would be called here to refresh data
  };

  const handleLogout = () => {
    localStorage.removeItem("ADMIN_TEST_MODE");
    logout();
    navigate("/login");
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
              onMouseEnter={(e) => {
                if (activeSection !== section) {
                  e.currentTarget.style.borderColor = "#9CA802";
                  e.currentTarget.style.color = "#9CA802";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section) {
                  e.currentTarget.style.borderColor = "#444";
                  e.currentTarget.style.color = "#aaa";
                }
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
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,68,68,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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