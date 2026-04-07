import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Tracks.css";

// Mapped the exact image filenames from your screenshot to the correct Track data
const trackDetails = [
  { img: "card1.png", title: "Health Tech", desc: "Innovate healthcare solutions, from telemedicine to wearable tech and predictive diagnostics." },
  { img: "card2.png", title: "Fin Tech", desc: "Build the future of finance with decentralized systems, smart payments, and financial inclusion." },
  { img: "card3.png", title: "E-Mobility", desc: "Drive the shift towards sustainable transportation, EV infrastructure, and smart transit." },
  { img: "card4.png", title: "Sustainability", desc: "Tackle climate change, resource management, and eco-friendly technologies for a greener earth." },
  { img: "card12.png", title: "Security", desc: "Enhance cybersecurity, data privacy, and robust defense mechanisms against digital threats." },
  { img: "card11.png", title: "Esports", desc: "Revolutionize competitive gaming, fan engagement, and the global gaming ecosystem." },
  { img: "card10.png", title: "Women Safety", desc: "Develop tech-driven solutions to empower and protect women in public and private spaces." },
  { img: "card5.png", title: "Education", desc: "Transform the learning experience through ed-tech, accessible learning, and immersive platforms." },
  { img: "card9.png", title: "Smart City & Civic", desc: "Optimize urban living, infrastructure, and citizen services for better communities." },
  { img: "card8.png", title: "Web-3 & Blockchain", desc: "Pioneer decentralized apps, smart contracts, and the next iteration of the internet." },
  { img: "card6.png", title: "Agri Tech", desc: "Modernize agriculture with IoT, predictive analytics, and sustainable farming solutions." },
  { img: "card7.png", title: "IoT", desc: "Connect the physical and digital worlds with smart devices and automated tracking systems." }
];

const Tracks = () => {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setActiveTrack(null);
        setIsFlipped(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const openTrack = (index) => {
    setActiveTrack(index);
    setIsFlipped(false); 
  };

  const closeTrack = () => {
    setActiveTrack(null);
    setTimeout(() => setIsFlipped(false), 300); 
  };

  return (
    <>
      <motion.div
        className="relative w-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute z-0 pointer-events-none" style={{ top: "10vh", left: "0vw", width: "50vw", height: "40vh", backgroundImage: "url(/Faqs/SpotPattern.svg)", backgroundRepeat: "no-repeat", backgroundSize: "75vw 75vh", backgroundPosition: "-10vw -25vh" }} />
        <div className="absolute z-0 pointer-events-none" style={{ top: "10vh", right: "0vw", width: "50vw", height: "40vh", backgroundImage: "url(/Faqs/SpotPattern.svg)", backgroundRepeat: "no-repeat", backgroundSize: "50vw 75vh", backgroundPosition: "0 -25vh" }} />

        <img src="/Faqs/ActionBubble.svg" alt="comic-slap" className="absolute inset-0 mx-auto z-5 w-[50vw] max-w-[600px] opacity-80 pointer-events-none md:-top-30 top-5" />

        <h1 className="relative z-5 mb-5 heading text-white w-full mt-20 mx-auto text-center" style={{ fontSize: "clamp(48px, 10vw, 100px)" }}>
          Tracks:
        </h1>
      </motion.div>

      {/* CAROUSEL */}
      <motion.div className="banner">
        <img src="/aboutUsBorder.svg" alt="Decorative Border" className="pointer-events-none absolute bottom-0 right-0 z-2 w-[40%] h-[30%]" />
        <div className="slider" style={{ "--quantity": 12 }}>
          {trackDetails.map((track, index) => (
            <motion.div
              className="item"
              style={{ "--position": index + 1 }}
              key={index}
              onClick={() => openTrack(index)}
            >
              {/* <div className="click-text heading">{track.title}</div> */}
              {/* Using the explicit filename from the array now */}
              <img src={`/Track/${track.img}`} alt={track.title} />
              <div className="click-indicator"><span className="arrow heading">⌄</span></div>
            </motion.div>
          ))}
        </div>
        <div className="content"><div className="model"></div></div>
      </motion.div>

      {/* DIVIDER */}
      <motion.hr className="glow-hr border-0 h-2 w-full bg-linear-to-r from-transparent via-[#bba75d] to-transparent" />

      {/* MODAL */}
      <AnimatePresence>
        {activeTrack !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTrack}
          >
            <div 
              className="relative w-72 h-[420px] sm:w-80 sm:h-[480px] cursor-pointer" 
              style={{ perspective: "1000px" }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
            >
              <motion.div 
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ scale: 0.5, rotateY: 0 }}
                animate={{ scale: 1, rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
              >
                
                {/* FRONT FACE */}
                <div 
                  className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#bba75d]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Using the explicit filename for the modal too */}
                  <img 
                    src={`/Track/${trackDetails[activeTrack].img}`} 
                    alt="Track Front" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 w-full text-center text-white/80 text-sm font-bold bg-black/50 py-1 heading-invert">
                    CLICK TO FLIP
                  </div>
                </div>

                {/* BACK FACE */}
                <div 
                  className="absolute w-full h-full rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center border-4 border-[#bba75d] bg-[#1a1a1a]"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <button 
                    className="absolute top-3 right-4 text-white hover:text-red-500 text-2xl font-bold transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTrack();
                    }}
                  >
                    ✕
                  </button>
                  
                  <div className="flex flex-col items-center text-center space-y-6">
                    <h2 className="heading mb-2" style={{ fontSize: "2.5rem" }}>
                      {trackDetails[activeTrack].title}
                    </h2>
                    <hr className="w-16 border-[#bba75d]/50" />
                    <p className="text-white/90 text-lg leading-relaxed font-medium">
                      {trackDetails[activeTrack].desc}
                    </p>
                  </div>

                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Tracks;