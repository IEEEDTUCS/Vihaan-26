import React, { useState, useEffect } from "react";
import "./Tracks.css";

const Tracks = () => {
  const [activeTrack, setActiveTrack] = useState(null);

  // ESC key close (optional but pro)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setActiveTrack(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
<div className="relative w-full overflow-hidden">
  {/* LEFT SPOT */}
  <div
    className="absolute z-0 pointer-events-none"
    style={{
      top: "10vh",
      left: "0vw",
      width: "50vw",
      height: "40vh",
      backgroundImage: "url(/Faqs/SpotPattern.svg)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "75vw 75vh",
      backgroundPosition: "-10vw -25vh",
    }}
  />

  {/* RIGHT SPOT */}
  <div
    className="absolute z-0 pointer-events-none"
    style={{
      top: "10vh",
      right: "0vw",
      width: "50vw",
      height: "40vh",
      backgroundImage: "url(/Faqs/SpotPattern.svg)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "50vw 75vh",
      backgroundPosition: "0 -25vh",
    }}
  />

  {/* BACKGROUND IMAGE (behind text) */}
  <img
    src="/about_us.svg"
    alt=""
    className="
      absolute inset-0
      mx-auto
      z-5
      w-[70vw] max-w-[900px]
      opacity-80
      pointer-events-none
      md:-top-20
      top-10
 "
  />

  {/* HEADING (TOP MOST) */}
  <h1
    className="relative z-10 heading text-white w-full mt-20 mx-auto text-center"
    style={{ fontSize: "clamp(48px, 10vw, 100px)" }}
  >
    Tracks:
  </h1>
</div>


      {/* CAROUSEL */}
      <div className="banner">
        
      <img
        src="/aboutUsBorder.svg"
        alt="Decorative Border"
        className="pointer-events-none absolute bottom-0 right-0 -z-1 w-[40%] h-[30%]"
      />
        <div className="slider" style={{ "--quantity": 7 }}>
          {[...Array(7)].map((_, index) => (
            <div
              className="item"
              style={{ "--position": index + 1 }}
              key={index}
              onClick={() => setActiveTrack(index)}
            >

              <div className="click-text heading">
                Track {index + 1} 
                <br />
             
                Coming Soon...
              </div>

              <img src="/Track/card.svg" alt={`Track ${index + 1}`} />

              <div className="click-indicator">
                <span className="arrow heading">⌄</span>
              </div>

            </div>
          ))}
        </div>

        <div className="content">
          <div className="model"></div>
        </div>
      </div>

      {/* DIVIDER */}
      <hr
        className="
          glow-hr
          border-0 h-[8px] w-full
          bg-gradient-to-r from-transparent via-[#bba75d] to-transparent
        "
      />

      {/* MODAL */}
      {activeTrack !== null && (
        <div
          className="track-modal"
          onClick={() => setActiveTrack(null)}
        >
          <div className={`track-flip `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* FRONT */}
            <div className="track-face track-front">
              <img src="/Track/card.svg" alt="Track Front" />
            </div>

            {/* BACK */}
            <div className="track-face track-back">
              <button
                className="track-close"
                onClick={() => setActiveTrack(null)}
                aria-label="Close"
              >
                ✕
              </button>

              <h2>Track {activeTrack + 1}</h2>
              <p>Details coming soon…</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tracks;
