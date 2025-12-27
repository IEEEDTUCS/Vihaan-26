import { useState } from "react";
import { motion } from "framer-motion";

export default function SubscribeGate({ onContinue }) {
  const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  const handleSubscribeAndContinue = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported in this browser.");
      onContinue();
      return;
    }

    try {
      setLoading(true);

      // 1. Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("You denied permission for notifications.");
        onContinue();
        return;
      }

      // 2. Wait for service worker
      const registration = await navigator.serviceWorker.ready;

      // 3. Subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      // 4. Save subscription to backend
      const res = await fetch(`${BACKEND_URL}/subs/subscribe`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 400) {
        console.log("already subbed");
        alert("You are already subscribed!");
      } else if (res.status === 201) {
        alert("You are now subscribed to event reminders!");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
    } finally {
      setLoading(false);
      onContinue(); // 🚀 always continue to intro
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center"
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
            onClick={onContinue}
            disabled={loading}
          >
            Continue without subscribing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
