import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  // Check dev mode - DISABLED FOR PRODUCTION
  useEffect(() => {
    setIsDevMode(false);
    // Dev mode disabled - relies on real beforeinstallprompt event only
  }, []);

  // Check if app is already installed
  useEffect(() => {
    const checkIfInstalled = async () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        // console.log('✅ App running in standalone mode');
        setIsInstalled(true);
        return;
      }

      // For iOS - check if it's running as a web app
      if (window.navigator.standalone === true) {
        // console.log('✅ App running on iOS standalone');
        setIsInstalled(true);
        return;
      }

      
      // console.log('ℹ️ No installation detected, ready to show prompt');
    };

    checkIfInstalled();
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // console.log('✅ beforeinstallprompt event fired!');
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    // console.log('👂 PWA: Listening for beforeinstallprompt event...');

    // Cleanup
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Show popup when beforeinstallprompt fires
  useEffect(() => {
    if (!deferredPrompt) return;

    const timer = setTimeout(() => {
      // console.log('Showing PWA install prompt');
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [deferredPrompt]);

  // Handle install click
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.warn('No deferred prompt available');
      return;
    }

    setIsLoading(true);

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        // console.log('User accepted PWA installation');
        localStorage.setItem('pwa_installed', 'true');
        localStorage.setItem('pwa_install_time', Date.now().toString());
        setIsInstalled(true);
        setIsVisible(false);
        
        // Show success message
        alert('App installed successfully! You can now use VIHAAN offline.');
      } else {
        // User clicked "Not now" - just hide popup for this session
        // Will show again on next visit
        setIsVisible(false);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('PWA installation error:', error);
      alert('Installation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    // Hide popup for this session only
    // Will show again on next visit
    setIsVisible(false);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug state - commented out for production
  // useEffect(() => {
  //   console.log('PWA Prompt State:', {
  //     isInstalled,
  //     isVisible,
  //     hasDeferred: !!deferredPrompt,
  //     isLoading,
  //   });
  // }, [isInstalled, isVisible, deferredPrompt, isLoading]);

  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute left-0 top-[35%] -translate-y-1/2 z-5000 flex items-center overflow-visible"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        >
          {/* Main Card Container */}
          <div
            className="relative flex items-center gap-3 sm:gap-4 p-4 pr-10 sm:p-5 sm:pr-12 rounded-r-2xl border-y-4 border-r-4 border-black"
            style={{
              width: 'fit-content',
              maxWidth: '85vw',
              backgroundImage: `url('/popup-bg.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#1a1a1a',
              boxShadow: '6px 6px 0px rgba(0, 0, 0, 1)',
            }}
          >
            {/* Dark tint */}
            <div className="absolute inset-0 bg-black/40 rounded-r-xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              disabled={isLoading}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-4 h-4 sm:w-5 sm:h-6 flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 disabled:opacity-50"
              aria-label="Close"
            >
              <img
                src="/cross-button.svg"
                alt="Close"
                className="w-full h-full drop-shadow-md"
              />
            </button>

            {/* Content Container */}
            <div className="relative z-500 flex items-center gap-3 sm:gap-4">
              {/* Download Icon */}
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="text-4xl sm:text-5xl"
                style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,1))' }}
                role="img"
                aria-label="Download"
              >
                ⬇️
              </motion.span>

              {/* Text Layout */}
              <div className="flex flex-col justify-center mt-1">
                <h2
                  className="font-black italic text-[#2255ff] leading-none uppercase tracking-wide"
                  style={{
                    fontSize: 'clamp(16px, 3.5vw, 24px)',
                    WebkitTextStroke: isMobile ? 'none' : '1px black',
                    textShadow: isMobile ? 'none' : '2px 2px 0px #000, 4px 4px 0px rgba(0,0,0,0.6)',
                  }}
                >
                  Install App
                </h2>

                <p
                  className="font-extrabold italic text-white leading-tight uppercase tracking-wider mt-1"
                  style={{
                    fontSize: 'clamp(10px, 2.5vw, 13px)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  Use offline anytime
                </p>
              </div>

              {/* Install Button */}
              <motion.button
                onClick={handleInstall}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 ml-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold uppercase text-xs sm:text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #FF8C1A 0%, #FFD23F 100%)',
                  color: '#000',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.5)',
                }}
              >
                {isLoading ? 'Installing...' : 'Install'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
