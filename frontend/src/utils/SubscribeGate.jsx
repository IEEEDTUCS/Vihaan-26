import { useState } from "react";
import { motion } from "framer-motion";
import PWAInstallPrompt from "./PWAInstallPrompt.jsx";

export default function SubscribeGate({ setNotifCookie, onContinue }) {
  const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_VIHAAN || "http://localhost:3000";

  const [loading, setLoading] = useState(false);

  // Helper: convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Timeout helper
  const withTimeout = (promise, ms) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), ms)
      ),
    ]);
  };

  const handleSubscribeAndContinue = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");

      return;
    }

    try {
      setLoading(true);

      // 1. Request permission
      let permission;
      try {
        permission = await withTimeout(Notification.requestPermission(), 5000);
      } catch (e) {
        console.warn("Notification permission timeout or denied");
        return;
      }

      if (permission !== "granted") {
        alert("You denied permission for notifications.");
        return;
      }

      // 2. Wait for service worker
      let registration;
      try {
        registration = await withTimeout(navigator.serviceWorker.ready, 8000);
      } catch (e) {
        console.warn("Service worker registration timeout");
        return;
      }

      // 3. Subscribe
      let subscription;
      try {
        subscription = await withTimeout(
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
          }),
          8000
        );
      } catch (e) {
        console.warn("Push subscription failed:", e);
        return;
      }

      // 4. Save subscription to backend
      try {
        const isSameOrigin = new URL(BACKEND_URL).origin === window.location.origin;

        const res = await withTimeout(
          fetch(`${BACKEND_URL}/subs/subscribe`, {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: isSameOrigin ? "omit" : "include",
          }),
          8000
        );

        if (res.status === 400) {
          alert("You are already subscribed!");
          setNotifCookie("true");
        } else if (res.status === 201) {
          alert("You are now subscribed to event reminders!");
          setNotifCookie("true");
        } else {
          setNotifCookie("true");
        }
      } catch (error) {
        //endpoint does not exist yet, but still marking as subscribed for testing purposes
        setNotifCookie("true");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
      alert("An error occurred while subscribing. Please try again.");
    } finally {
      setLoading(false);
      onContinue(); // 🚀 always continue to intro
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ backgroundColor: "#000" }}
      className="fixed inset-0 z-99999 bg-black/80 backdrop-blur-md flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-black border border-[#ffffff] rounded-xl p-8 w-[90%] max-w-md text-center shadow-[0_0_30px_rgba(156,168,2,0.4)]"
      >
        <h2 className="heading text-3xl mb-4 text-white">
          VIHAAN 9.0 Updates
        </h2>

        <p className="text-gray-300 mb-6">
          Subscribe to get notified about schedules, prizes & announcements.
        </p>

        <div className="flex flex-col gap-3">
          {/* NOTIFY ME */}
          <button
            className="bg-white text-black py-2 rounded-md font-bold hover:scale-105 transition disabled:opacity-60"
            onClick={handleSubscribeAndContinue}
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Notify Me"}
          </button>

          {/* SKIP */}
          <button
            className="text-gray-400 text-sm hover:text-white transition"
            onClick={() => {
              alert("You can subscribe later from the homepage!");
              onContinue();
            }}
            disabled={loading}
          >
            Continue without subscribing
          </button>
        </div>
      </motion.div>
      <PWAInstallPrompt></PWAInstallPrompt>
    </motion.div>
  );
}