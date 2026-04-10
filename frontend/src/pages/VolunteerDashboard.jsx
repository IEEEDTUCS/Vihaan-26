import { useState, useEffect, useRef } from "react";
import QrScanner from 'qr-scanner';
import { useAuth } from "../context/AuthContext";

export default function VolunteerDashboard() {
  /* State */
  const scannerRef = useRef(null);
  const { checkUserByQr,
      linkUserQr,
      markUserPresent,
      updateUserFoodCount,
      decreaseUserFoodCount,
      updateUserBeddingTaken,
      unCheckInUser,
  } = useAuth();

  const [qrCode, setQrCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [rsvpCode, setRsvpCode] = useState("");
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalCallBack, setModalCallBack] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Scanner Setup */

  /* Functions */
  const openUser = (userData) => {
    setUser(userData);
    // setPresent(userData.present || false);
    // setFoodCount(userData.foodCount || 0);
    setShowModal(true);
  };

const handleScan = async (qrValue) => {
    const qr = qrValue || qrCode;
    
    // --- 1. QR CODE FRONTEND CHECK ---
    if (!qr || qr.trim() === "") {
      return setError("Please scan the qr code properly.");
    }

   
    if (qr.trim().length !== 8) {
      return setError("Invalid QR format: Length too short. only 8 characters allowed.");
    }

    setLoading(true);
    setError("");
    setShowRSVP(false); // Reset RSVP view on new scan

    try {
      const userData = await checkUserByQr(qr.trim());
      if (userData && userData.user) {
        openUser(userData.user);
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
    }, [isScanning, handleScan]); // Re-run effect when isScanning changes

 const handleRSVP = async () => {
    // --- 1. QR HASH CHECK ---
    if (!qrCode || qrCode.trim() === "") {
      return setError("QR Hash missing hai! Please scan the badge again.");
    }

    // --- 2. RSVP CODE FRONTEND CHECK ---
    if (!rsvpCode || rsvpCode.trim() === "") {
      return setError("Please enter an RSVP code.");
    }

    // Clean the code: remove spaces and make uppercase (e.g. " vihaan 123 " -> "VIHAAN123")
    const cleanRsvp = rsvpCode.trim().toUpperCase().replace(/\s+/g, '');

    // Basic format check (assuming RSVP codes are at least 5 chars long)
    if (cleanRsvp.length !== 8) {
      return setError("Invalid RSVP Code format. It should be exactly 8 characters.");
    }

    setLoading(true);
    setError("");

    try {
      const data = await linkUserQr(qrCode, cleanRsvp);

      setShowRSVP(false);
      setRsvpCode(""); 
      openUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await markUserPresent(user.qr_hash);
            setUser(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addFood = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await updateUserFoodCount(user.qr_hash);
            setUser(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const reduceFood = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await decreaseUserFoodCount(user.qr_hash);
            setUser(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const updateBedding = async (taken) => {
        setLoading(true);
        setError("");
        try {
            const data = await updateUserBeddingTaken(user.qr_hash, taken);
            setUser(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const unCheckIn = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await unCheckInUser(user.qr_hash);
            setUser(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openConfirmModal = (content, callback) => {
        setModalContent(content);
        setModalCallBack(() => callback);
        setShowConfirmModal(true);
    }

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

          {showRSVP && (
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-100 mb-4">
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
                      className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg cursor-pointer hover:bg-slate-800"
                  >
                      Link-User
                  </button>
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
            min={8}
            max={8}
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

      </div>

        { showConfirmModal && (

            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-70">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                    <h2 className="text-xl font-black text-slate-900">Confirm Action</h2>
                    <p className="text-sm font-bold text-slate-500 mb-5">{modalContent}</p>
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 py-3 rounded-xl font-bold transition-all bg-red-100 text-red-700 ring-2 ring-red-500">
                            No
                        </button>
                        <button
                            onClick={() => {
                                modalCallBack.call()
                                setShowConfirmModal(false)
                            }}
                            className="flex-1 py-3 rounded-xl font-bold transition-all bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500">
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        )

        }

      {/* USER MODAL */}
      {showModal && user && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
            <h2 className="text-2xl font-black text-slate-900">{user.username}</h2>
              <p className="text-sm font-bold text-slate-500">{user.role || "No Team Name Available"}</p>
              <p className="text-sm font-semibold text-slate-500">{user.team_name || "No Team Name Available"}</p>
            <p className="text-sm text-slate-500 mb-6">{user.college_name || "No College Listed"}</p>
            <div className="flex gap-3 mb-6">
              <button
                  disabled={user.is_present}
                onClick={() => openConfirmModal("Do you want to mark this user present?", markAttendance)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  user.is_present ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500" : "bg-emerald-500 text-white"
                }`}
              >
                {user.is_present ? "✓ Checked In" : "Check In"}
              </button>
                {user.is_present && (<button
                    onClick={() => openConfirmModal("Do you want to mark this user absent?", unCheckIn)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                        user.is_present ? "bg-red-100 text-red-700 ring-2 ring-red-500" : "bg-red-500 text-white"
                    }`}
                >
                    {user.is_present ? "Un-check in" : "Check In"}
                </button> )}
            </div>

            {user.is_present && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                    <button disabled={user.food_count === 0} onClick={() => openConfirmModal("Do you want to decrease food count?", reduceFood)} className="bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-300 text-indigo-700 px-4 py-2 rounded-lg font-bold">-</button>
                  <span className="font-semibold">Meals: {user.food_count}</span>
                  <button onClick={() => openConfirmModal("Do you want increase food count?", addFood)} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold">+</button>
                </div>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                      <button disabled={!user.bedsheet_taken} onClick={() => {openConfirmModal("Do you want to mark bedsheet as taken?", () => updateBedding(false))}} className="bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-300 text-indigo-700 px-4 py-2 rounded-lg font-bold">-</button>
                      <span className="font-semibold">Beddings: {user.bedsheet_taken ? "Taken" : "Not Taken"}</span>
                      <button disabled={user.bedsheet_taken} onClick={() => {openConfirmModal("Do you want to mark bedsheet as not taken?", () => updateBedding(true))}} className="bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-300 text-indigo-700 px-4 py-2 rounded-lg font-bold">+</button>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                      <span className="font-semibold">Room Allotted: {user.room_allot}</span>
                  </div>              </div>
            )}

            <button onClick={() => setShowModal(false)} className="mt-6 w-full text-slate-400 font-bold py-3">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}