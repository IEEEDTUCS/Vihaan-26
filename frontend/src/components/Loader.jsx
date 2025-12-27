import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// Images
import img1 from "/loadingsvgs/img1.svg";
import img2 from "/loadingsvgs/img2.svg";
import img3 from "/loadingsvgs/img3.svg";
import img4 from "/loadingsvgs/img4.svg";
import img5 from "/loadingsvgs/img5.svg";
import img6 from "/loadingsvgs/img6.svg";
import img7 from "/loadingsvgs/img7.svg";
import img8 from "/loadingsvgs/img8.svg";
import img9 from "/loadingsvgs/img9.svg";
import img from "../assets/image.png"; // Final Image

const actionPanels = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const finalImage = img;

const FINAL_TEXT = "VIHAAN 9.0";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*{}/<>";

function Intro({ onComplete, audioRef }) {
  const allImages = useMemo(() => [...actionPanels, finalImage], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFinalState, setIsFinalState] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showDecryption, setShowDecryption] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const [isTextDone, setIsTextDone] = useState(false);
  const hasCompletedRef = useRef(false);


useEffect(() => {
  const audioEl = audioRef.current;
  if (!audioEl) return;

  const handleEnded = () => {
    audioEl.currentTime = 0;
  };

  audioEl.addEventListener("ended", handleEnded);

  return () => {
    audioEl.removeEventListener("ended", handleEnded);
  };
}, [audioRef]);


  // Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const checkLoad = () => {
      loadedCount++;
      if (loadedCount === allImages.length) setImagesLoaded(true);
    };

    allImages.forEach((src) => {
      const imgObj = new window.Image();
      imgObj.src = src;
      imgObj.onload = checkLoad;
      imgObj.onerror = checkLoad;
    });
  }, [allImages]);

  // Master Timeline
  useEffect(() => {
    if (!imagesLoaded) return;

    const flipInterval = setInterval(() => {
      if (!isFinalState) {
        setCurrentImageIndex((prev) => (prev + 1) % actionPanels.length);
      }
    }, 150);

    const textTimer = setTimeout(() => setShowDecryption(true), 3000);

    const finishTimer = setTimeout(() => {
      clearInterval(flipInterval);
      setCurrentImageIndex(actionPanels.length);
      setIsFinalState(true);
    }, 7000);

    return () => {
      clearInterval(flipInterval);
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [imagesLoaded, isFinalState]);

  // Text Decryption Logic
  useEffect(() => {
    if (!showDecryption) return;

    let iterations = 0;
    const interval = setInterval(() => {
      setDecryptedText(() => {
        let currentString = "";
        const currentProgress = Math.floor(iterations);
        for (let i = 0; i < FINAL_TEXT.length; i++) {
          if (i < currentProgress) currentString += FINAL_TEXT[i];
          else if (i === currentProgress)
            currentString += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        return currentString;
      });

      if (iterations > FINAL_TEXT.length) {
        clearInterval(interval);
        setIsTextDone(true);
        setTimeout(onComplete, 1500);
      }
      iterations += 1 / 8;
    }, 50);

    return () => clearInterval(interval);
  }, [showDecryption, onComplete]);

  if (!imagesLoaded) return <div className="fixed inset-0 bg-black z-50" />;

  const safeComplete = () => {
  if (hasCompletedRef.current) return;
  hasCompletedRef.current = true;
  onComplete();
};


  return (
    <>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-50 bg-black flex flex-col justify-center items-center">
        {/* STRIP CONTAINER */}
        <motion.div
          initial={{ height: "40vh" }}
          animate={{ height: "70vh" }}
          transition={{ duration: 7, ease: "easeInOut" }}
          className="relative w-full border-y-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-gray-900 overflow-hidden"
        >
          {/* IMAGE LAYER */}
          <motion.div
            className="w-full h-full relative"
            animate={{
              filter: isFinalState
                ? "blur(0px) brightness(1)"
                : showDecryption
                ? "blur(8px) brightness(0.6)"
                : "blur(0px) brightness(1)",
            }}
            transition={{ duration: 1.5 }}
          >
            {allImages.map((src, index) => {
              const isActive = index === currentImageIndex;
              return (
                <motion.div
                  key={src}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                  />
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain z-10"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* SKIP */}
        <motion.h1
          onClick={() => {
            safeComplete();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed top-6 right-6 z-100 text-white text-xl md:text-2xl hover:scale-110 transition-transform active:scale-95"
          style={{
            fontFamily: '"Bangers", system-ui',
            WebkitTextStroke: "1px black",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          SKIP &gt;&gt;
        </motion.h1>

        {/* TEXT */}
        {showDecryption && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative transform -skew-x-12"
            >
              <span
                className="select-none z-50 block text-6xl md:text-8xl lg:text-9xl xl:text-10xl 2xl:text-11xl"
                style={{
                  fontFamily: '"Bangers", system-ui',
                  backgroundImage:
                    "linear-gradient(to bottom, #FFD700 30%, #FF8C00 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  WebkitTextStroke: "1px black",
                  filter: "drop-shadow(8px 8px 0px #000000)",
                  textAlign: "center",
                  lineHeight: "1",
                  letterSpacing: "0.05em",
                }}
              >
                {decryptedText}
                {!isTextDone && (
                  <span className="animate-pulse text-white ml-2">_</span>
                )}
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

export default Intro;
