import { useState, useRef, useEffect } from "react";
// import Sponsor from "./components/Sponsors/Sponsor.jsx";
import Lenis from "lenis";
import Prizes from "../components/prizes/prizes.jsx";
import SubscribeGate from "../utils/SubscribeGate.jsx";
import Landing from "../components/Landing/Landing.jsx";
import Intro from "../components/Loader.jsx";
import Tracks from "../components/Tracks/Tracks.jsx";
import Landing2 from "../components/Landing2.jsx";
import Faqs from "../components/Faqs/faqs.jsx";
import Team from "../components/Team/team.jsx";
import Gallery from "../components/Gallery/Gallery.jsx";
import Schedule from "../components/Schedule/Schedule.jsx";
import Footer from "../components/Footer/Footer.jsx";

import { Volume2, VolumeX } from "lucide-react";

const setNotifCookie = (name, value, days=5) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  //store in localStorage as fall back if cookies are blocked
  localStorage.setItem(name, value);
};

const getNotifCookie = (name) => {
  //try from localStorage first
  const lsValue = localStorage.getItem(name);
  if (lsValue) return lsValue;
  
  //fall back to cookies
  return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split("=")[1];
};

function home() {
  const subscriptionStatus = getNotifCookie("push_subscription_status");
  
  const [showGate, setShowGate] = useState(!subscriptionStatus); // Show gate only if no cookie
  const [showIntro, setShowIntro] = useState(!!subscriptionStatus); // Show intro only if cookie exists
  const [autoStartIntro, setAutoStartIntro] = useState(false); // Only auto-start after gate response
  const [showPrizes, setShowPrizes] = useState(true);
  const [glowTrigger, setGlowTrigger] = useState(0);

  const [muted, setMuted] = useState(
    () => localStorage.getItem("bg-muted") === "true"
  );

  const introAudioRef = useRef(new Audio("/audio/intro.mp3"));
  const bgAudioRef = useRef(new Audio("/audio/bg-audio.mp3"));

  /* Cleanup intro audio */
  useEffect(() => {
    return () => {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    };
  }, []);

  /* 🔊 Background audio lifecycle */
  useEffect(() => {
    if (!showGate && !showIntro) {
      const bgAudio = bgAudioRef.current;

      bgAudio.loop = true;
      bgAudio.volume = muted ? 0 : 0.25;
      bgAudio.currentTime = 0;

      bgAudio.play().catch(() => {});
    }

    return () => {
      bgAudioRef.current.pause();
      bgAudioRef.current.currentTime = 0;
    };
  }, [showGate, showIntro, muted]);

  /* Persist mute state */
  useEffect(() => {
    localStorage.setItem("bg-muted", muted);
    bgAudioRef.current.volume = muted ? 0 : 0.25;
  }, [muted]);

  /* Initialize Lenis for smooth scrolling */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#000" }}>
   
      {!showGate && !showIntro && (
        <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute background audio" : "Mute background audio"}
        className="
          fixed 
          top-6 left-[calc(35%-9px)]
          z-[9999]
          flex items-center justify-center
          w-9 h-9 rounded-full
          bg-black/50 backdrop-blur-md
          text-white hover:bg-black/70
          transition
        "
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      )}

      {/* SUBSCRIBE GATE */}
      {showGate && (
        <SubscribeGate
          setNotifCookie={(status) => setNotifCookie("push_subscription_status", status)}
          
          onContinue={() => {

            introAudioRef.current.currentTime = 0;
            introAudioRef.current.volume = 0.5;
            introAudioRef.current.play().catch(() => {});

            setShowGate(false);
            setShowIntro(true);
            setAutoStartIntro(true); // Auto-start intro animation without START button
          }}
        />
      )}

      {/* INTRO / LOADER */}
      {showIntro && (
        <div id="loader">
          <Intro
            audioRef={introAudioRef}
            autoStart={autoStartIntro}
            onComplete={() => {
              introAudioRef.current.pause();
              introAudioRef.current.currentTime = 0;
              introAudioRef.current.volume = 0;

              setShowIntro(false);
            }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      {!showGate && !showIntro && (
        <>
          <div id="landing">
            <Landing showPrizes={showPrizes} setShowPrizes={setShowPrizes} glowTrigger={glowTrigger} setGlowTrigger={setGlowTrigger} />
          </div>

          <div id="about">
            <Landing2 />
          </div>

          <div id="schedule">
            <Schedule />
          </div>
          
          <div id="tracks">
            <Tracks />
          </div>

          <div id="gallery">
            <Gallery />
          </div>

          {/* <div id="sponsors">
            <Sponsor></Sponsor>
          </div> */}

          <div id="team">
            <Team />
          </div>

          <div id="faqs">
            <Faqs />
          </div>

          <div id="footer">
            <Footer />
          </div>

          <div id="prizes">
            <Prizes showPrizes={showPrizes} onHide={() => setShowPrizes(false)} glowTrigger={glowTrigger} />
          </div>
        </>
      )}
    </div>
  );
}

export default home;

