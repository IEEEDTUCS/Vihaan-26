import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ComicAlert from "../utils/ComicAlert.jsx";

const BACKEND = import.meta.env.VITE_BACKEND_URL_VIHAAN || "http://localhost:3000";

const WINDOWS = {
  initial: {
    open: new Date("2026-04-11T14:00:00+05:30"),
    close: new Date("2026-04-11T15:30:00+05:30"),
  },
  1: {
    open: new Date("2026-04-11T16:00:00+05:30"),
    close: new Date("2026-04-11T17:00:00+05:30"),
  },
  2: {
    open: new Date("2026-04-11T21:00:00+05:30"),
    close: new Date("2026-04-11T22:00:00+05:30"),
  },
  3: {
    open: new Date("2026-04-12T00:00:00+05:30"),
    close: new Date("2026-04-12T01:00:00+05:30"),
  },
  4: {
    open: new Date("2026-04-12T04:00:00+05:30"),
    close: new Date("2026-04-12T06:00:00+05:30"),
  },
};

const isWindowOpen = (w) => { const n = Date.now(); return n >= w.open.getTime() && n <= w.close.getTime(); };
const fmtTime = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
const fmtWindow = (w) => `${fmtTime(w.open)} – ${fmtTime(w.close)}`;

function Section({ title, borderColor, bgColor, textColor, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
      style={{ border: open ? "none" : "0.3em solid #f9f9f9", borderRadius: "0.5rem", width: "90%", margin: "14px auto" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px",
          backgroundColor: bgColor, border: open ? `0.3em solid ${borderColor}` : "none",
          borderRadius: open ? "0.5rem 0.5rem 0 0" : "0", cursor:"pointer", userSelect:"none",
          position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url('/Schedule/bg-texture.png')", backgroundSize:"cover", opacity:0.07, pointerEvents:"none" }} />
        <span className="heading" style={{ fontSize:"clamp(1rem,3vw,1.7rem)", letterSpacing:"0.2rem",
          WebkitTextStroke:`1px ${borderColor}`, WebkitTextFillColor:textColor,
          filter:"drop-shadow(3px 3px 1px rgba(0,0,0,1))", backgroundImage:"none", position:"relative", zIndex:1 }}>
          {title}
        </span>
        <div style={{ width:36, height:36, background:"black", borderRadius:"7mm", display:"flex",
          alignItems:"center", justifyContent:"center", color:textColor, fontSize:"1.4rem",
          fontFamily:"Bangers", flexShrink:0, transition:"transform 0.2s",
          transform: open ? "rotate(180deg)" : "none", position:"relative", zIndex:1 }}>⌄</div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }}
            style={{ overflow:"hidden", border:`0.3em solid ${borderColor}`, borderTop:"none",
              borderRadius:"0 0 0.5rem 0.5rem", backgroundColor:bgColor, position:"relative" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"url('/Schedule/bg-texture.png')", backgroundSize:"cover", opacity:0.04, pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:0, left:0, width:"18%", height:"100%", backgroundImage:"url(/Faqs/SpotPattern.svg)", backgroundRepeat:"no-repeat", backgroundSize:"200% 100%", backgroundPosition:"0 center", opacity:0.3, pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:0, right:0, width:"18%", height:"100%", backgroundImage:"url(/Faqs/SpotPattern.svg)", backgroundRepeat:"no-repeat", backgroundSize:"200% 100%", backgroundPosition:"100% center", opacity:0.3, pointerEvents:"none" }} />
            <div style={{ padding:"18px 20px", position:"relative", zIndex:1 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Badge({ label, value, active }) {
  return (
    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:4,
      padding:"8px 14px", background: active ? "rgba(156,168,2,0.15)" : "rgba(255,255,255,0.05)",
      border:`2px solid ${active ? "#9CA802" : "#444"}`, borderRadius:"0.5rem", minWidth:80 }}>
      <span style={{ fontFamily:"Bangers", fontSize:"clamp(1rem,3vw,1.5rem)", color: active ? "#9CA802" : "#888", letterSpacing:"0.1em" }}>{value}</span>
      <span style={{ fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.7rem", color:"#aaa", textTransform:"uppercase", textAlign:"center" }}>{label}</span>
    </div>
  );
}

function WindowBanner({ window: w, label }) {
  const now = Date.now();
  const open = isWindowOpen(w);
  const upcoming = now < w.open.getTime();
  const color = open ? "#9CA802" : upcoming ? "#bba75d" : "#555";
  const msg = open ? `Open now: ${fmtWindow(w)}` : upcoming ? `Opens at ${fmtTime(w.open)}` : `Closed (was ${fmtWindow(w)})`;
  return (
    <div style={{ fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.85rem", color, marginBottom:14,
      padding:"6px 10px", border:`1px solid ${color}`, borderRadius:"0.3rem", display:"inline-block" }}>
      {label}: {msg}
    </div>
  );
}

function CheckpointRow({ cp, token, onAlert, isLeader, teamType }) {
  const statusColor = { PENDING:"#888", VERIFIED:"#9CA802", SUSPICIOUS:"#ff4444" };
  const w = WINDOWS[cp.round_num];
  const windowOpen = w ? isWindowOpen(w) : false;
  const alreadyDone = !!cp.submit_link;

  const [commitLink, setCommitLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isHardware = teamType === "HARDWARE";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 VALIDATION
    if (isHardware) {
      if (!imageFile) {
        onAlert({ flags:["Please upload an image for hardware submission"], severity:3 });
        return;
      }
    } else {
      if (!commitLink.trim()) return;
      if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/commit\/[a-f0-9]{7,40}$/.test(commitLink.trim())) {
        onAlert({ flags:["Please provide a valid GitHub commit URL"], severity:3 });
        return;
      }
    }

    setSubmitting(true);

    try {
      let res;

      if (isHardware) {
        const fd = new FormData();
        fd.append("image", imageFile);
        fd.append("round_num", cp.round_num);

        res = await fetch(`${BACKEND}/api/user/submit/checkpoint`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

      } else {
        res = await fetch(`${BACKEND}/api/user/submit/checkpoint`, {
          method: "POST",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          },
          body: JSON.stringify({ round_num: cp.round_num, commit_link: commitLink }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      onAlert(data.githubCheck);
      window.location.reload();

    } catch (err) {
      onAlert({ flags:[err.message || "Submission failed"], severity:3 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding:"12px 14px", marginBottom:10, background:"rgba(255,255,255,0.04)", border:"1px solid #333", borderRadius:"0.4rem" }}>
      <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, marginBottom:6 }}>
        <span style={{ fontFamily:"Bangers", fontSize:"1.1rem", color:"#fff", letterSpacing:"0.1em" }}>Round {cp.round_num}</span>
        {w && <span style={{ fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.75rem", color:"#aaa" }}>{fmtWindow(w)}</span>}
        <span style={{ fontFamily:"Bangers", fontSize:"0.95rem", color:statusColor[cp.status]||"#888",
          border:`1px solid ${statusColor[cp.status]||"#888"}`, borderRadius:"0.3rem", padding:"2px 8px" }}>{cp.status}</span>
        {cp.submit_link && <a href={cp.submit_link} target="_blank" rel="noreferrer"
          style={{ fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.8rem", color:"#9CA802", textDecoration:"underline" }}>View</a>}
      </div>
      {isLeader && !alreadyDone && windowOpen && (
        <form onSubmit={handleSubmit} style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {isHardware ? (
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              style={{ flex:1, minWidth:180, background:"rgba(255,255,255,0.05)", border:"1px solid #444",
                borderRadius:"0.4rem", padding:"8px 10px", color:"#fff",
                fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.85rem", outline:"none" }} />
          ) : (
            <input type="url" placeholder="https://github.com/owner/repo/commit/sha"
              value={commitLink} onChange={e => setCommitLink(e.target.value)}
              style={{ flex:1, minWidth:180, background:"rgba(255,255,255,0.05)", border:"1px solid #444",
                borderRadius:"0.4rem", padding:"8px 10px", color:"#fff",
                fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.85rem", outline:"none" }} />
          )}
          <button type="submit" disabled={submitting}
            style={{ fontFamily:"Bangers", fontSize:"1rem", letterSpacing:"0.15em", color:"#000",
              background: submitting ? "#666" : "#bba75d", border:"none", borderRadius:"0.4rem",
              padding:"8px 18px", cursor: submitting ? "not-allowed" : "pointer" }}>
            {submitting ? "Checking..." : "Submit"}
          </button>
        </form>
      )}
      {isLeader && !alreadyDone && !windowOpen && w && (
        <p style={{ fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.8rem", color:"#555", marginTop:4 }}>
          {Date.now() < w.open.getTime() ? `Opens at ${fmtTime(w.open)}` : "Window closed"}
        </p>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user, admin, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const token = localStorage.getItem("authTokenUser");

  const showAlerts = (githubCheck) => {
    if (!githubCheck || githubCheck.flags.length === 0) return;
    setAlerts(githubCheck.flags.map(msg => ({ message: msg, severity: githubCheck.severity })));
  };

  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND}/api/user/team`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setTeamData(d.team); }).catch(() => {});
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#0d0d0d" }}>
      <span className="heading" style={{ fontSize:"2rem" }}>Loading...</span>
    </div>
  );

  if (!user && !admin) { navigate("/login"); return null; }

  const activeUser = user;
  const isLeader = activeUser?.role === "LEADER";
  const team = teamData || null;
  const checkpoints = team?.checkpoints || [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans" style={{ background:"#0d0d0d" }}>
      <div className="absolute z-0 pointer-events-none" style={{ top:0, left:0, width:"22vw", height:"100%", backgroundImage:"url(/Faqs/SpotPattern.svg)", backgroundRepeat:"no-repeat", backgroundSize:"200% 60%", backgroundPosition:"0 10%", opacity:0.45 }} />
      <div className="absolute z-0 pointer-events-none" style={{ top:0, right:0, width:"22vw", height:"100%", backgroundImage:"url(/Faqs/SpotPattern.svg)", backgroundRepeat:"no-repeat", backgroundSize:"200% 60%", backgroundPosition:"100% 10%", opacity:0.45 }} />
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[{pos:"left-6 top-14",size:"2.2rem",delay:0},{pos:"right-10 top-20",size:"3rem",delay:0.4},
          {pos:"left-[15%] top-[38%]",size:"1.8rem",delay:0.8},{pos:"right-[18%] top-[22%]",size:"2.5rem",delay:1.2},
          {pos:"left-[8%] top-[60%]",size:"2rem",delay:0.3},{pos:"right-[6%] top-[50%]",size:"1.6rem",delay:1.5}
        ].map((s,i) => (
          <motion.img key={i} src="/star.svg" className={`absolute ${s.pos}`} style={{ width:s.size, opacity:0.45 }}
            animate={{ opacity:[0.2,0.65,0.2], scale:[1,1.2,1] }}
            transition={{ duration:2.4, repeat:Infinity, ease:"easeInOut", delay:s.delay }} />
        ))}
      </div>
      <div className="absolute top-0 left-0 z-10 pointer-events-none" style={{ width:"110px", height:"220px", mixBlendMode:"screen", opacity:0.45 }}>
        <img src="/Schedule/spider-new.png" alt="" className="w-full h-full object-contain rotate-180 opacity-75" />
      </div>
      <div className="absolute bottom-0 left-0 w-full flex items-end z-0 pointer-events-none h-44 lg:h-64">
        <img src="/Schedule/skyline1.png" alt="" className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]" />
        <img src="/Schedule/skyline1.png" alt="" className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-14 pb-72">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <motion.h1 className="heading" initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6 }} style={{ fontSize:"clamp(2rem,8vw,5rem)" }}>Dashboard</motion.h1>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ fontFamily:"Bangers", fontSize:"1.1rem", letterSpacing:"0.15em", color:"#ff4444",
              border:"2px solid #ff4444", borderRadius:"0.4rem", padding:"6px 18px",
              background:"transparent", cursor:"pointer" }}
            onMouseEnter={e => e.target.style.background="rgba(255,68,68,0.1)"}
            onMouseLeave={e => e.target.style.background="transparent"}>Logout</button>
        </div>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
          style={{ fontFamily:"Edu TAS Beginner, sans-serif", color:"#aaa", fontSize:"clamp(0.85rem,2vw,1rem)", marginBottom:"2rem", paddingLeft:4 }}>
          Hey <span style={{ color:"#9CA802" }}>{activeUser?.username || admin?.name}</span> 👋 &nbsp;·&nbsp;
          <span style={{ color:"#bba75d" }}>{activeUser?.role || admin?.role}</span>
        </motion.p>

        <Section title="01 · Initial Submission" borderColor="#9CA802" bgColor="rgba(156,168,2,0.08)" textColor="#c8d400" defaultOpen={isLeader}>
          <WindowBanner window={WINDOWS.initial} label="Submission window" />
          {isLeader
            ? <InitialSubmissionForm team={team} token={token} onAlert={showAlerts} windowOpen={isWindowOpen(WINDOWS.initial)} />
            : <ReadOnlyInitial team={team} />}
        </Section>

        <Section title="02 · Checkpoint Submissions" borderColor="#bba75d" bgColor="rgba(187,167,93,0.08)" textColor="#e8c96a">
          {checkpoints.length === 0
            ? <p style={{ fontFamily:"Edu TAS Beginner, sans-serif", color:"#888" }}>No checkpoints found.</p>
            : checkpoints.map(cp => <CheckpointRow key={cp.round_num} cp={cp} token={token} onAlert={showAlerts} isLeader={isLeader} teamType={team?.type}  />)}
        </Section>

        <Section title="03 · My Status" borderColor="#4a90e2" bgColor="rgba(74,144,226,0.08)" textColor="#7ab8f5">
          <StatusSection user={activeUser} team={team} />
        </Section>
      </div>

      <ComicAlert alerts={alerts} onClose={() => setAlerts([])} />
    </div>
  );
}

function DarkSelect({ value, onChange, options, placeholder, style }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative", ...style }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid #444",
          borderRadius: open ? "0.4rem 0.4rem 0 0" : "0.4rem", padding:"10px 12px",
          color: value ? "#fff" : "#666", fontFamily:"Edu TAS Beginner, sans-serif",
          fontSize:"0.95rem", cursor:"pointer", display:"flex", justifyContent:"space-between",
          alignItems:"center", userSelect:"none" }}>
        <span>{value || placeholder}</span>
        <span style={{ fontSize:"0.7rem", color:"#888" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#111",
          border:"1px solid #444", borderTop:"none", borderRadius:"0 0 0.4rem 0.4rem",
          zIndex:999, maxHeight:200, overflowY:"auto" }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{ padding:"10px 12px", color: opt===value ? "#9CA802" : "#fff",
                fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.95rem", cursor:"pointer",
                background: opt===value ? "rgba(156,168,2,0.1)" : "transparent", borderBottom:"1px solid #222" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = opt===value ? "rgba(156,168,2,0.1)" : "transparent"}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadOnlyInitial({ team }) {
  if (!team?.repo_or_image_link && !team?.description) {
    return <p style={{ fontFamily:"Edu TAS Beginner, sans-serif", color:"#888" }}>Leader hasn't submitted yet.</p>;
  }
  const s = { fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.9rem", color:"#ccc" };
  const lbl = { color:"#9CA802", fontFamily:"Bangers", letterSpacing:"0.1em" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {team.type && <p style={s}><span style={lbl}>Type: </span>{team.type}</p>}
      {team.category?.length > 0 && <p style={s}><span style={lbl}>Category: </span>{team.category.join(", ")}</p>}
      {team.description && <p style={s}><span style={lbl}>Description: </span>{team.description}</p>}
      {team.repo_or_image_link && (
        <p style={s}><span style={lbl}>Repo/Image: </span>
          <a href={team.repo_or_image_link} target="_blank" rel="noreferrer" style={{ color:"#9CA802", textDecoration:"underline" }}>View</a>
        </p>
      )}
    </div>
  );
}

function InitialSubmissionForm({ team, token, onAlert, windowOpen }) {
  const alreadySubmitted = !!(team?.repo_or_image_link || team?.description);
  const [repoLink, setRepoLink] = useState(team?.repo_or_image_link || "");
  const [description, setDescription] = useState(team?.description || "");
  const [type, setType] = useState(team?.type || "");
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState(team?.category?.join(", ") || "");
  const [saving, setSaving] = useState(false);
  const isHardware = type === "HARDWARE";

  const inputStyle = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid #444",
    borderRadius:"0.4rem", padding:"10px 12px", color:"#fff",
    fontFamily:"Edu TAS Beginner, sans-serif", fontSize:"0.95rem", outline:"none", marginTop:6, marginBottom:14 };
  const labelStyle = { fontFamily:"Bangers", fontSize:"1rem", letterSpacing:"0.15em", color:"#9CA802" };

  if (alreadySubmitted) return <ReadOnlyInitial team={team} />;
  if (!windowOpen) return <p style={{ fontFamily:"Edu TAS Beginner, sans-serif", color:"#888" }}>Submission window is not open yet.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!type || !category || !description) {
      onAlert({ flags:["Please fill in all required fields."], severity:3 });
      setSaving(false); return;
    }
    if (!isHardware && !repoLink) {
      onAlert({ flags:["Please provide a repo link."], severity:3 });
      setSaving(false); return;
    }

    if(!isHardware && repoLink !== "" && !/^https?:\/\/github\.com\/.+\/.+$/.test(repoLink)) {//github link validation (basic)
      onAlert({ flags: ["Please provide a valid URL for the repo link."], severity: 3 });
      setSaving(false);
      return;
    }
    if (isHardware && !imageFile) {
      onAlert({ flags:["Please upload a project image."], severity:3 });
      setSaving(false);
      return;
    }

    if (isHardware && imageFile && imageFile.size > 400 * 1024) {
      onAlert({ flags:["Image size should be less than 400 KB."], severity:3 });
      setSaving(false); return;
    }
    try {
      let finalRepoLink = repoLink;
      if (isHardware && imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const uploadRes = await fetch(`${BACKEND}/api/upload/image`, {
          method:"POST", headers:{ Authorization:`Bearer ${token}` }, body:fd,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        finalRepoLink = uploadData.url;
      }
      const categoryArray = category.split(",").map(c => c.trim()).filter(Boolean);
      if (categoryArray.length > 5) { onAlert({ flags:["Maximum 5 categories allowed"], severity:3 }); setSaving(false); return; }
      const res = await fetch(`${BACKEND}/api/user/submit/initial`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ type, category:categoryArray, description, repo_link:finalRepoLink }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      if (data.githubCheck) onAlert(data.githubCheck);
      else onAlert({ flags:["Submission saved successfully"], severity:0 });
      window.location.reload();
    } catch (err) {
      onAlert({ flags:[err.message || "Submission failed"], severity:3 });
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label style={labelStyle}>Track Type</label>
      <DarkSelect value={type} onChange={setType} options={["WOMEN","FRESHERS","IEEE","SOFTWARE","HARDWARE"]} placeholder="-- Select --" style={{ marginTop:6, marginBottom:14 }} />
      <label style={labelStyle}>Category / Domain</label>
      <input type="text" placeholder="e.g. FinTech, Health Tech (comma separated)" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />
      <label style={labelStyle}>Project Description</label>
      <textarea rows={3} placeholder="Brief description..." value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, resize:"vertical" }} />
      {isHardware ? (
        <>
          <label style={labelStyle}>Project Image (Hardware)</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ ...inputStyle, padding:"6px" }} />
          <p style={{ fontFamily:"Edu TAS Beginner, sans-serif", color:"#888", fontSize:"0.8rem", marginTop:-10, marginBottom:14 }}>Keep image between 300–400 KB.</p>
        </>
      ) : (
        <>
          <label style={labelStyle}>Repo Link</label>
          <input type="url" placeholder="https://github.com/your-team/repo" value={repoLink} onChange={e => setRepoLink(e.target.value)} style={inputStyle} />
          <p style={{ fontFamily:"Edu TAS Beginner, sans-serif", color:"#888", fontSize:"0.8rem", marginTop:-10, marginBottom:14 }}>Repo must be freshly created with zero commits.</p>
        </>
      )}
      <button type="submit" disabled={saving}
        style={{ fontFamily:"Bangers", fontSize:"1.2rem", letterSpacing:"0.2em", color:"#000",
          background: saving ? "#666" : "#9CA802", border:"none", borderRadius:"0.4rem",
          padding:"10px 28px", cursor: saving ? "not-allowed" : "pointer" }}>
        {saving ? "Checking..." : "Submit"}
      </button>
    </form>
  );
}
function StatusSection({ user, team }) {
  if (!user) return null;

  return (
    <div>
      {/* 🔹 STATUS BADGES */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Badge
          label="Present"
          value={user.is_present ? "✓ YES" : "✗ NO"}
          active={user.is_present}
        />

        <Badge
          label="Food"
          value={user.food_count ?? 0}
          active={(user.food_count ?? 0) > 0}
        />

        <Badge
          label="Bedsheet"
          value={user.bedsheet_taken ? "Taken" : "Not Yet"}
          active={!!user.bedsheet_taken}
        />

        <Badge
          label="Team Room"
          value={team?.room_number || "—"}
          active={!!team?.room_number}
        />

        <Badge
          label="QR"
          value={user.qr_hash ? "✓" : "✗"}
          active={!!user.qr_hash}
        />
      </div>

      {/* 🔹 TEAM INFO */}
      {team && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #333",
            borderRadius: "0.5rem",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              fontFamily: "Bangers",
              fontSize: "1.2rem",
              color: "#bba75d",
              letterSpacing: "0.15em",
              marginBottom: 10,
            }}
          >
            Team: {team.team_name}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "8px 16px",
            }}
          >
            {[
              ["Team ID", team.team_id],
              ["Type", team.type || "—"],
              ["Room No.", team.room_number || "—"],
              ["Panel", team.panel_number || "—"],
              ["Avg Points", team.avg_points ?? "—"],
              ["Stars", team.stars ?? "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <span
                  style={{
                    fontFamily: "Bangers",
                    fontSize: "0.85rem",
                    color: "#666",
                    letterSpacing: "0.1em",
                  }}
                >
                  {k}:{" "}
                </span>
                <span
                  style={{
                    fontFamily: "Edu TAS Beginner, sans-serif",
                    fontSize: "0.9rem",
                    color: "#ccc",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          {team.category?.length > 0 && (
            <p
              style={{
                fontFamily: "Edu TAS Beginner, sans-serif",
                fontSize: "0.85rem",
                color: "#888",
                marginTop: 8,
              }}
            >
              Categories: {team.category.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}