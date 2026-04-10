import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WebsiteMentionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Positioned middle-left
          className="absolute left-0 top-[20%] -translate-y-1/2 z-5000 flex items-center overflow-visible"
          
          // Framer Motion Animation
          initial={{ x: '-100%', opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}       
          exit={{ x: '-100%', opacity: 0, transition: { duration: 0.2 } }}    
          transition={{ type: 'spring', stiffness: 120, damping: 15 }} // Slightly snappier spring
        >
          {/* Main Card Container */}
          <div 
            className="relative flex items-center gap-3 sm:gap-4 p-4 pr-10 sm:p-5 sm:pr-12 rounded-r-2xl border-y-4 border-r-4 border-black"
            style={{
              // Tighter, more dynamic sizing
              width: 'fit-content',
              maxWidth: '85vw',
              
              /* User Background Asset */
              backgroundImage: `url('/popup-bg.png')`, // REPLACE THIS PATH
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#1a1a1a', 
              
              /* Hard comic-book drop shadow (offset to the bottom right) */
              boxShadow: '6px 6px 0px rgba(0, 0, 0, 1)',
            }}
          >
            {/* Dark tint to ensure text readability */}
            <div className="absolute inset-0 bg-black/40 rounded-r-xl pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-4 h-4 sm:w-5 sm:h-6 flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300"
              aria-label="Close"
            >
              <img 
                src="/cross-button.svg" // REPLACE THIS PATH
                alt="Close" 
                className="w-full h-full drop-shadow-md"
              />
            </button>

            {/* Content Container */}
            <div className="relative z-500 flex items-center gap-3 sm:gap-4">
              
              {/* Trophy Emoji - Scaled down for better proportion */}
              <motion.span 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 200 }} // Pops in right after sliding
                className="text-4xl sm:text-5xl" 
                style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,1))' }}
                role="img" 
                aria-label="Trophy"
              >
                🏆
              </motion.span>

              {/* Text Layout */}
              <div className="flex flex-col justify-center mt-1">
                <h2 
                  className="font-black italic text-[#fef041] leading-none uppercase tracking-wide"
                  style={{
                    fontSize: "clamp(20px, 4vw, 28px)",
                    WebkitTextStroke: isMobile ? "none" : "1px black",
                    textShadow: isMobile ? "none" : "2px 2px 0px #000, 4px 4px 0px rgba(0,0,0,0.6)"
                  }}
                >
                  BEST WEBSITE
                </h2>
                
                <p 
                  className="font-extrabold italic text-white leading-tight uppercase tracking-wider mt-1"
                  style={{
                    fontSize: "clamp(14px, 2.5vw, 18px)",
                    WebkitTextStroke: isMobile ? "none" : "1px black",
                    textShadow: isMobile ? "none" : "2px 2px 0px #000"
                  }}
                >
                  IN WD CATEGORY
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WebsiteMentionPopup;