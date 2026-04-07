import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function VolunteerDashboard() {
  /* State */
  const scannerRef = useRef(null);

  const [qrCode, setQrCode] = useState("");
  const [rsvpCode, setRsvpCode] = useState("");

  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);

  const [present, setPresent] = useState(false);
  const [foodCount, setFoodCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "http://localhost:9000/api/user";

  /*  Scanner*/
  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          setQrCode(decodedText);
          handleScan(decodedText);

          if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
          }
        },
        () => {} // Suppress noisy frame errors
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  /* functions */
  const handleScan = async (qrValue) => {
    const qr = qrValue || qrCode;
    if (!qr) return setError("Please enter or scan a QR code.");

    setLoading(true);
    setError("");

    try {
      // Encode URL to prevent express routing crashes
      const res = await fetch(`${API}/scan/${encodeURIComponent(qr)}`, {
        method: "GET",
      });

      if (!res.ok) {
        setShowRSVP(true);
      } else {
        const data = await res.json();
        openUser(data.user);
      }
    } catch {
      setError("Failed to communicate with the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!rsvpCode) return setError("Please enter an RSVP code.");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/link-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrHash: qrCode, rsvpCode }),
      });

      if (!res.ok) throw new Error("Invalid RSVP Code");

      const data = await res.json();
      setShowRSVP(false);
      setRsvpCode(""); // Clear input on success
      openUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openUser = (u) => {
    setUser(u);
    setPresent(u.is_present); // Mapped correctly to backend
    setFoodCount(u.food_count || 0); // Mapped correctly to backend
    setShowModal(true);
  };

  const markAttendance = async (status) => {
    if (status === false) {
      alert("The system currently only supports Check-Ins (Present).");
      return;
    }

    setPresent(true);
    try {
      await fetch(`${API}/present/${encodeURIComponent(user.qr_hash)}`, {
        method: "POST",
      });
    } catch {
      setError("Failed to mark attendance.");
    }
  };

  const addFood = async () => {
    const nextCount = foodCount + 1;
    setFoodCount(nextCount);

    try {
      await fetch(`${API}/update/${encodeURIComponent(user.qr_hash)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodCountInc: nextCount }),
      });
    } catch {
      setError("Failed to update food count.");
    }
  };

  const assignRoom = async () => {
    const roomName = prompt("Enter Room Number:");
    if (!roomName) return;

    try {
      const res = await fetch(`${API}/update/${encodeURIComponent(user.qr_hash)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomAllot: roomName }),
      });

      if (!res.ok) throw new Error("Failed to assign room");
      alert(`Successfully assigned to Room ${roomName}!`);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ui*/
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 font-sans text-slate-800">
      
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-8 tracking-tight">
          Volunteer Dashboard
        </h1>

        {/* ERROR TOAST */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6 animate-pulse">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* SCANNER CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-slate-100">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Scan Badge</h2>

          <div 
            id="reader" 
            className="w-full overflow-hidden rounded-xl border-2 border-dashed border-slate-300 mb-4 bg-slate-50"
          ></div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or enter manually</span>
            </div>
          </div>

          <input
            className="w-full border border-slate-300 p-3 rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="e.g. http://en.m.wikipedia.org"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />

          <button
            onClick={() => handleScan(qrCode)}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg mt-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Submit Code"}
          </button>
        </div>

        {/* RSVP CARD */}
        {showRSVP && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-2 text-slate-800">Unregistered QR</h2>
            <p className="text-sm text-slate-500 mb-4">This badge is blank. Enter the guest's RSVP code to link it to their profile.</p>

            <input
              className="w-full border border-slate-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. GUEST-001"
              value={rsvpCode}
              onChange={(e) => setRsvpCode(e.target.value)}
            />

            <button
              onClick={handleRSVP}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-70"
            >
              {loading ? "Linking..." : "Link User"}
            </button>
          </div>
        )}
      </div>

      {/* USER MODAL */}
      {showModal && user && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all scale-100">
            
            {/* Backend uses username, not name */}
            <h2 className="text-2xl font-black text-slate-900 mb-1">{user.username}</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">{user.college_name || "Guest"}</p>

            {/* Attendance Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => markAttendance(true)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  present 
                    ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500" 
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                }`}
              >
                {present ? "✓ Checked In" : "Check In"}
              </button>

              <button
                onClick={() => markAttendance(false)}
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 rounded-xl font-bold transition-all"
              >
                Absent
              </button>
            </div>

            {/* Operations (Unlocked when present) */}
            {present && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">Meals Served: {foodCount}</span>
                  <button
                    onClick={addFood}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-bold transition-colors"
                  >
                    + Add
                  </button>
                </div>

                <button
                  onClick={assignRoom}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Assign Room
                </button>

                {user.role === "leader" && (
                  <button className="w-full border-2 border-indigo-100 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
                    Leader: Toggle Mattress
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full text-slate-500 hover:text-slate-800 font-bold py-3 rounded-xl transition-colors"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}