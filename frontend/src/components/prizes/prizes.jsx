import { useState, useEffect, useRef } from 'react';

export default function Prizes({ showPrizes = true, onHide = () => {}, glowTrigger = 0 }) {
    const [animationStep, setAnimationStep] = useState(0); 
    const [isVisible, setIsVisible] = useState(showPrizes);
    const [shouldGlow, setShouldGlow] = useState(false);
    const prevGlowTriggerRef = useRef(glowTrigger);

    // Handle initial visibility on first load
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Handle show/hide based on showPrizes prop
    useEffect(() => {
        if (showPrizes && !isVisible) {
            setIsVisible(true);
            setAnimationStep(0);
        }
    }, [showPrizes, isVisible]);

    // Handle glow trigger when PRIZES is clicked while already visible
    useEffect(() => {
        if (glowTrigger !== prevGlowTriggerRef.current && isVisible) {
            setShouldGlow(true);
            const glowTimer = setTimeout(() => setShouldGlow(false), 500);
            prevGlowTriggerRef.current = glowTrigger;
            return () => clearTimeout(glowTimer);
        }
        prevGlowTriggerRef.current = glowTrigger;
    }, [glowTrigger, isVisible]);

    // Handle auto-hide after animation completes
    useEffect(() => {
        if (animationStep === 2) {
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
                setAnimationStep(0); // Reset for next trigger
                onHide();
            }, 5000); // 5 seconds after animation completes
            
            return () => clearTimeout(hideTimer);
        }
    }, [animationStep, onHide]);

    const handleReveal = () => {
        if (animationStep !== 0) return; 
        
        setAnimationStep(1); // Trigger money fall
        
        setTimeout(() => {
            setAnimationStep(2); // Show text and coins
        }, 700);
    };

    return (
        // Shifted up to bottom-16 so the absolute coins have room to appear underneath
        <div className={`fixed bottom-10 left-10 sm:bottom-9 sm:left-9 transition-all duration-1000 z-5000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${shouldGlow ? 'animate-pulse' : ''}`}
          style={shouldGlow ? {
            filter: 'drop-shadow(0 0 20px rgba(252, 211, 77, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.6))',
          } : {}}
        >
            
            {/* Main Container - Width locked here so it doesn't shift */}
            <div className="relative w-20 sm:w-28 flex flex-col items-center">
                
                {/* 1. TEXT & LIGHTNING: Positioned directly above the bag */}
                <div className="absolute bottom-[80%] w-full left-7 flex justify-center items-center pointer-events-none z-30">
                    
                    {/* Much larger Lightning */}
                    <img 
                        src="/Team/lightning.svg" 
                        alt="lightning"
                        className="absolute -z-10 rotate-20 transition-opacity duration-500"
                        style={{
                            width: "clamp(1150px, 27vw, 350px)", // Scaled way up to engulf the text
                            height: "clamp(30px, 4vw, 50px)",
                            objectFit: "cover",
                            opacity: animationStep === 2 ? 0.8 : 1
                        }}
                    />
                    
                    {/* Text */}
                    <h1 
                        className={`heading-invert rotate-3 animate-bounce whitespace-nowrap text-center transition-all duration-500 ${animationStep === 1 ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
                        style={{
                            fontSize: "clamp(24px, 4vw, 20px)", 
                            textShadow: "3px 3px 6px rgba(0,0,0,0.9)"
                        }}
                    >
                        {animationStep === 2 ? "1.5+ LAKH PRIZE POOL" : "CLICK TO REVEAL PRIZES!"}
                    </h1>
                </div>

                {/* 2. FALLING MONEY: Made significantly larger */}
                <img
                    src="/prizes/money.png"
                    alt="prize money"
                    // Starts way higher (-top-64) and is much wider (w-32)
                    className={`absolute left-1/2 transform -translate-x-1/2 w-32 sm:w-40 -z-10 transition-all ${
                        animationStep === 0 
                            ? '-top-64 opacity-0 duration-0' 
                            : animationStep === 1 
                                ? 'top-0 opacity-100 duration-700 ease-in' // Falls into the bag
                                : 'top-8 opacity-0 duration-300' 
                    }`}
                />

                {/* 3. KNAPSACK: Stays completely still */}
                <img
                    src="/prizes/knapsack.png"
                    alt="knapsack"
                    onClick={handleReveal}
                    className={`w-full animate-pulse -rotate-2 relative z-20 transition-transform duration-300 ${animationStep === 0 ? 'hover:scale-105 cursor-pointer hover:-translate-y-1' : 'cursor-default'}`}
                />

                {/* 4. COINS: Absolutely positioned so they don't push the bag up */}
                <img
                    src="/prizes/coin.png"
                    alt="coins"
                    className={`absolute left-1/2 transform -translate-x-1/2 w-42 sm:w-54 z-200 transition-all duration-700 ease-out pointer-events-none ${
                        // Slide out from behind the bag to underneath it (-bottom-14)
                        animationStep === 2 ? '-bottom-9 opacity-100' : 'bottom-0 opacity-0'
                    }`}
                />
                
            </div>
        </div>
    );
}