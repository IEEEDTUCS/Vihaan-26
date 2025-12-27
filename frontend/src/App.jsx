import { useState, useRef, useEffect } from "react";
import SubscribeGate from "./utils/SubscribeGate.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Intro from "./components/Loader.jsx";
import Tracks from "./components/Tracks/Tracks.jsx";
import Landing2 from "./components/Landing2.jsx";
import Faqs from "./components/Faqs/faqs.jsx";
import Gallery from "./components/Gallery/Gallery.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./App.css";

function App() {
  const [showGate, setShowGate] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  const introAudioRef = useRef(new Audio("/audio/intro.mp3"));

  useEffect(() => {
    return () => {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    };
  }, []);

  return (
    <>
      {/* SUBSCRIBE GATE */}
      {showGate && (
        <SubscribeGate
          onContinue={() => {
            introAudioRef.current.currentTime = 0;
            introAudioRef.current.volume = 0.1;
            introAudioRef.current.play().catch(() => {});

            setShowGate(false);
            setShowIntro(true);
          }}
        />
      )}

      {/* INTRO / LOADER */}
      {showIntro && (
        <div id="loader">
          <Intro
            audioRef={introAudioRef}
            onComplete={() => {
              console.log("Intro complete!");

              introAudioRef.current.pause();
              introAudioRef.current.currentTime = 0;
              introAudioRef.current.volume = 0;

              setShowIntro(false);
            }}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      {!showIntro && (
        <>
          <div id="landing">
            <Landing />
          </div>

          <div id="about">
            <Landing2 />
          </div>

          <div id="tracks">
            <Tracks />
          </div>

          <div id="gallery">
            <Gallery />
          </div>

          <div id="faqs">
            <Faqs />
          </div>

          <div id="footer">
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default App;
