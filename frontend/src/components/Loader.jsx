import { useState, useEffect } from "react";
import { motion , useAnimationControls } from "framer-motion";
import img1 from '../assets/image1.png';
import img from '../assets/image.png';
import img3 from '../assets/image3.png';
import img4 from '../assets/image4.png';
import img6 from '../assets/image6.png';
import img7 from '../assets/image7.png';
import img9 from '../assets/image9.png';

const heroImages = [
  img1, img3, img4, img6, img7, img9, img
];

const FINAL_TEXT = "VIHAAN 9.0";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

function getRandomString(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    const char = FINAL_TEXT[i] === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
    str += char;
  }
  return str;
}

function Intro({ onComplete }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [prevPage, setPrevPage] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showDecryption, setShowDecryption] = useState(false);
  const [decrypted, setDecrypted] = useState("");
  const logoControls = useAnimationControls();


  useEffect(() => {
    let loaded = 0;
    heroImages.forEach(src => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === heroImages.length) setImagesLoaded(true);
      };
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const sequence = async () => {
      for (let i = 0; i < heroImages.length; i++) {
        setPrevPage(i === 0 ? null : i - 1);
        setCurrentPage(i);
        if (i === heroImages.length - 1) {
          setShowDecryption(true);
        }
        await new Promise(resolve => setTimeout(resolve, 700));
      }
    };
    sequence();
  }, [imagesLoaded, logoControls]);

  // Decryption effect (all letters scramble together, then solve)
  useEffect(() => {
    if (!showDecryption) return;
    let cycles = 0;
    const maxCycles = 5;
    let interval = setInterval(() => {
      if (cycles < maxCycles) {
        setDecrypted(getRandomString(FINAL_TEXT.length));
      } else {
        setDecrypted(FINAL_TEXT);
        clearInterval(interval);
        setTimeout(onComplete, 1400); 
      }
      cycles++;
    }, 200); 
    return () => clearInterval(interval);
  }, [showDecryption, onComplete]);

  const fadeDuration = 0.5; 

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden z-50 bg-black">
      {!showDecryption && (
        <>
          <motion.div
            key={`blur-bg-${currentPage}`}
            className="fixed inset-0 w-screen h-screen bg-cover bg-center scale-110 filter blur-lg"
            style={{
              backgroundImage: `url(${heroImages[currentPage]})`
            }}
            initial={{ opacity: prevPage === null ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: fadeDuration, ease: "easeInOut" }}
          />
          {prevPage !== null && (
            <motion.div
              key={`blur-bg-prev-${prevPage}`}
              className="fixed inset-0 w-screen h-screen bg-cover bg-center scale-110 filter blur-lg"
              style={{
                backgroundImage: `url(${heroImages[prevPage]})`
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: fadeDuration, ease: "easeInOut" }}
            />
          )}
          <motion.div
            key={`curr-${currentPage}`}
            className="fixed inset-0 w-screen h-screen bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${heroImages[currentPage]})`
            }}
            initial={{ opacity: prevPage === null ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: fadeDuration, ease: "easeInOut" }}
          />
          {prevPage !== null && (
            <motion.div
              key={`prev-${prevPage}`}
              className="fixed inset-0 w-screen h-screen bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: `url(${heroImages[prevPage]})`
              }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: fadeDuration, ease: "easeInOut" }}
            />
          )}
        </>
      )}
      {showDecryption && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-50">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center scale-110 filter blur-lg"
            style={{
              backgroundImage: `url(${heroImages[heroImages.length - 1]})`
            }}
          />
          <div
            className="absolute inset-0 w-full h-full bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${heroImages[heroImages.length - 1]})`
            }}
          />
          {/* Decryption text */}
          <span
            className="absolute inset-0 flex mt-10 items-center justify-center text-[13vw] md:text-[11vw] font-extrabold tracking-wider bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_3px_8px_rgba(0,0,0.7,0.8)] font-bangers select-none font-mono z-50"
            style={{
              WebkitTextStroke: "2px rgba(0,0,0.7,0.9)",
              textStroke: "4px rgba(0,0,0.7,0.9)"
            }}
          >
            {decrypted}
          </span>
        </div>
      )}
    </div>
  );
}

export default Intro;