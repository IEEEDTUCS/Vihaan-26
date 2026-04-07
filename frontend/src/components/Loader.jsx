import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import styles from '../utils/button/button.module.css';
import clickEffect from "/Faqs/ButtonClicks/ClickEffect.svg";
import PWAInstallPrompt from "../utils/PWAInstallPrompt.jsx";

// Images
import img1 from "/Gallerysvgs/c1-1.webp";
import img2 from "/Gallerysvgs/c2-1.webp";
import img3 from "/Gallerysvgs/c3-1.webp";
import img4 from "/Gallerysvgs/c4-1.webp";
import img5 from "/Gallerysvgs/c5-1.webp";
import img6 from "/Gallerysvgs/c6-1.webp";
import img7 from "/Gallerysvgs/c7-1.webp";
import img8 from "/Gallerysvgs/c13-1.webp";
import img9 from "/Gallerysvgs/c14-1.webp";
import img from "../assets/image.webp"; // Final Image

const actionPanels = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const finalImage = img;

const FINAL_TEXT = "VIHAAN 9.0";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*{}/<>";

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

function Intro({ onComplete, audioRef, autoStart = false }) {
  const allImages = useMemo(() => [...actionPanels, finalImage], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFinalState, setIsFinalState] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showDecryption, setShowDecryption] = useState(false);
  const [decryptedText, setDecryptedText] = useState("");
  const [isTextDone, setIsTextDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(autoStart); // Auto-start if cookie exists
  const [showClickEffect, setShowClickEffect] = useState(false);

  const hasCompletedRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  /* PRELOAD IMAGES */
  useEffect(() => {
    let loadedCount = 0;
    const checkLoad = () => {
      loadedCount++;
      if (loadedCount === allImages.length) setImagesLoaded(true);
    };

    allImages.forEach((src) => {
      const imgObj = new Image();
      imgObj.src = src;
      imgObj.onload = checkLoad;
      imgObj.onerror = checkLoad;
    });
  }, [allImages]);

  /* Auto-trigger start if autoStart is true */
  useEffect(() => {
    if (autoStart && imagesLoaded) {
      setCurrentImageIndex(0);
      setIsFinalState(false);
      setShowDecryption(false);
      setDecryptedText("");
      setIsTextDone(false);
    }
  }, [autoStart, imagesLoaded]);
  /* IMAGE FLIPPING */
  useEffect(() => {
    if (!imagesLoaded || !hasStarted) return;

    const FLIP_INTERVAL = isMobile ? 220 : 150;

    const flipInterval = setInterval(() => {
      if (!isFinalState) {
        setCurrentImageIndex((prev) => (prev + 1) % actionPanels.length);
      }
    }, FLIP_INTERVAL);

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
  }, [imagesLoaded, isFinalState, hasStarted]);

  useEffect(() => {
    if (!showDecryption || !hasStarted) return;

    let iterations = 0;
    const DECRYPT_INTERVAL = isMobile ? 60 : 50;

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
    }, DECRYPT_INTERVAL);

    return () => clearInterval(interval);
  }, [showDecryption, hasStarted, onComplete]);

  if (!imagesLoaded) return null;

  const safeComplete = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete();
  };

  const handleStart = () => {
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    setShowClickEffect(true);
    
    clickTimeoutRef.current = setTimeout(() => {
      setShowClickEffect(false);
      setHasStarted(true);
    }, 350);

    setCurrentImageIndex(0);
    setIsFinalState(false);
    setShowDecryption(false);
    setDecryptedText("");
    setIsTextDone(false);
    hasCompletedRef.current = false;

    audioRef?.current?.play?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
      {/* STRIP CONTAINER */}
      <motion.div
        initial={{ height: "40vh" }}
        animate={{ height: hasStarted ? "70vh" : "40vh" }}
        transition={{ duration: 7, ease: "easeInOut" }}
        className="relative w-full border-y-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-gray-900 overflow-hidden"
      >
        {/* IMAGE LAYER */}
        <motion.div
          className="w-full h-full relative will-change-transform"
          animate={{
            filter: isFinalState
              ? "brightness(1)"
              : showDecryption
              ? isMobile
                ? "brightness(0.85) blur(8px)" //NO BLUR ON MOBILE
                : "blur(8px) brightness(0.6)"
              : "brightness(1)",
          }}
          transition={{ duration: 1.5 }}
        >
          {allImages.map((src, index) => {
            const isActive = index === currentImageIndex;
            return (
              <motion.div
                key={src}
                className="absolute inset-0 w-full h-full will-change-opacity"
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
      {hasStarted && (
        <motion.h1
          onClick={safeComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed top-6 right-6 z-[101] text-white text-xl md:text-2xl hover:scale-110 transition-transform active:scale-95"
          style={{
            fontFamily: '"Bangers", system-ui',
            WebkitTextStroke: "1px black",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          SKIP &gt;&gt;
        </motion.h1>
      )}

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

      {/* start btn overlay */}
      {!hasStarted && (
        <div className="absolute bg-black inset-0 z-[10] bg-black flex items-center justify-center">
          {!autoStart && (
            <>
            <div className={styles.centre} style={{ transform: 'scale(1.4)', position: 'relative' }}>
              <button
                type="button"
                className={styles.commonbutton}
                style={{ cursor: 'pointer', position: 'relative', overflow: 'visible' }}
                onClick={handleStart}
              >
                {showClickEffect && (
                  <img
                    src={clickEffect}
                    alt=""
                    style={{
                      position: 'absolute',
                      marginTop: '-1.5rem',
                      transform: 'scale(0)',
                      pointerEvents: 'none',
                      zIndex: 11,
                      animation: 'comicClickPop 0.35s ease-out',
                    }} />
                )}
                <div className={styles.top} style={{ background: 'linear-gradient(180deg, #FF8C1A 0%, #FFD23F 100%)', color: 'black' }}>START</div>
                <div className={styles.bottom} style={{ background: 'linear-gradient(180deg, #FF8C1A 0%, #FFD23F 100%)' }}></div>
              </button>
            </div>
            <PWAInstallPrompt></PWAInstallPrompt>
            </>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes comicClickPop {
            0% {
              transform: scale(1.3);
              opacity: 0;
            }
            50% {
              transform: scale(2);
              opacity: 1;
            }
            100% {
              transform: scale(1.7);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Intro;
