import { useState, useEffect, useRef } from "react";
import QrScanner from 'qr-scanner';
import { useAuth } from "../context/AuthContext"; 
const backend_url = import.meta.env.VITE_BACKEND_URL_VIHAAN;

export default function VolunteerDashboard() {
  /* State */
  const scannerRef = useRef(null);
const { checkUserByQr, linkUserQr } = useAuth();

  const [qrCode, setQrCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [rsvpCode, setRsvpCode] = useState("");

  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);

  const [present, setPresent] = useState(false);
  const [foodCount, setFoodCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Scanner Setup */
useEffect(() => {
    // If not scanning, clean up and exit
    if (!isScanning) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
      return;
    }

    const videoElem = document.getElementById('qr-video');
    
    if (videoElem && !scannerRef.current) {
      scannerRef.current = new QrScanner(
        videoElem,
        (result) => {
          const decodedText = result.data.trim(); // Trim extra spaces
          setQrCode(decodedText);
          setIsScanning(false); // NEW: Turn off camera after scan
          handleScan(decodedText); 
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start().catch(err => {
        setError("Camera access denied or not found.");
        setIsScanning(false);
        console.error(err);
      });
    }

    // Cleanup on unmount or when isScanning becomes false
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [isScanning]); // Re-run effect when isScanning changes

  /* Functions */
  const openUser = (userData) => {
    setUser(userData);
    setPresent(userData.present || false);
    setFoodCount(userData.foodCount || 0);
    setShowModal(true);
  };

  const handleScan = async (qrValue) => {
    const qr = (qrValue || qrCode).trim();
    if (!qr) return setError("Please enter or scan a QR code.");

    setLoading(true);
    setError("");
    setShowRSVP(false);

    try {
      const data = await checkUserByQr(qr);
      if (data && data.user) {
        openUser(data.user);
      } else {
        setShowRSVP(true);
      }
    } catch (err) {
      setError("QR not linked to any user.");
      setShowRSVP(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    const cleanRSVP = rsvpCode.trim(); // FIX: Prevent Mongo space errors
    const cleanQR = qrCode.trim();

    if (!cleanRSVP) return setError("Please enter an RSVP code.");
    if (!cleanQR) return setError("Missing QR Code.");

    setLoading(true);
    setError("");

    try {
      const data = await linkUserQr(cleanQR, cleanRSVP);
      setShowRSVP(false);
      setRsvpCode(""); 
      openUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 const markAttendance = async (status) => {
    if (!status) {
      alert("The system currently only supports Check-Ins (Present).");
      return;
    }

    try {
      const res = await fetch(`${backend_url}/scan/${encodeURIComponent(user.qr_hash)}/present`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authTokenAdmin"),
        }
      });

      if (!res.ok) throw new Error("Failed");
      setPresent(true);
    } catch {
      setError("Failed to mark attendance.");
    }
  };

  const addFood = async () => {
    const nextCount = foodCount + 1;
    try {
      const res = await fetch(`${backend_url}/scan/${encodeURIComponent(user.qr_hash)}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authTokenAdmin"),
        },
        body: JSON.stringify({ foodCountInc: nextCount })
      });

      if (!res.ok) throw new Error("Failed");
      setFoodCount(nextCount);
    } catch {
      setError("Failed to update food count.");
    }
  };

  const assignRoom = async () => {
    const roomName = prompt("Enter Room Number:");
    if (!roomName) return;

    try {
      const res = await fetch(`${backend_url}/scan/${encodeURIComponent(user.qr_hash)}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authTokenAdmin"),
        },
        body: JSON.stringify({ roomAllot: roomName })
      });

      if (!res.ok) throw new Error("Failed");
      
      alert(`Successfully assigned to Room ${roomName}!`);
      setUser({ ...user, room_allot: roomName });
    } catch (err) {
      alert("Failed to assign room.");
    }
  };

  /* UI Render */
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 font-sans text-slate-800">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-8 tracking-tight">
          Volunteer Dashboard
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-slate-100">
         <h2 className="text-xl font-bold mb-4">Scan Badge</h2>
          
          {/* CAMERA TOGGLE UI */}
          {isScanning ? (
            <div className="rounded-lg overflow-hidden bg-black aspect-square mb-4 relative">
              <video id="qr-video" className="w-full h-full object-cover"></video>
              <button 
                onClick={() => setIsScanning(false)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md"
              >
                Cancel Scan
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsScanning(true)}
              className="rounded-lg bg-slate-100 aspect-square mb-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300"
            >
              <span className="text-4xl mb-2">📷</span>
              <span className="font-semibold text-slate-500">Tap to Scan QR</span>
            </div>
          )}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Manual Entry</span></div>
          </div>

          <input
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter QR Hash"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />

          <button
            onClick={() => handleScan(qrCode)}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg mt-3 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Code"}
          </button>
        </div>

        {showRSVP && (
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-100 animate-pulse">
            <h2 className="text-xl font-bold mb-2">Unlinked QR detected</h2>
            <p className="text-sm text-slate-500 mb-4">Link this badge to a guest RSVP code.</p>
            <input
              className="w-full border border-slate-300 p-3 rounded-lg mb-4"
              placeholder="e.g. RSVP-123"
              value={rsvpCode}
              onChange={(e) => setRsvpCode(e.target.value)}
            />
            <button
              onClick={handleRSVP}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg"
            >
              Link User
            </button>
          </div>
        )}
      </div>

      {/* USER MODAL */}
      {showModal && user && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
            <h2 className="text-2xl font-black text-slate-900">{user.username}</h2>
            <p className="text-sm text-slate-500 mb-6">{user.college_name || "Independent Guest"}</p>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => markAttendance(true)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  present ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500" : "bg-emerald-500 text-white"
                }`}
              >
                {present ? "✓ Checked In" : "Check In"}
              </button>
            </div>

            {present && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                  <span className="font-semibold">Meals: {foodCount}</span>
                  <button onClick={addFood} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold">+</button>
                </div>
                <button onClick={assignRoom} className="w-full bg-slate-100 py-3 rounded-xl font-semibold">
                  {user.room_allot ? `Room: ${user.room_allot}` : "Assign Room"}
                </button>
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="mt-6 w-full text-slate-400 font-bold py-3">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}