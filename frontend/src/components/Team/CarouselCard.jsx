import React, { useState, useEffect } from 'react';

const CarouselCard = ({ index, personInfo, offset, isFlipped }) => {
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setScreenSize('mobile');
      else if (window.innerWidth < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gap = screenSize === 'mobile' ? 110 : screenSize === 'tablet' ? 160 : 240;
  
  const translateX = offset * gap
  const scale = offset === 0 ? 1.1 : Math.abs(offset) === 1 ? 0.95 : 0.85
  const zIndex = 5 - Math.abs(offset)
  const rotateFactor = offset > 0 ? -1 : 1;
  const opacity = (screenSize === 'mobile' && Math.abs(offset) > 1) || Math.abs(offset) > 2 ? 0 : 1;

  return (
    <div 
      className="absolute w-[180px] sm:w-[220px] h-[260px] sm:h-[310px] transition-all duration-500 ease-in-out"
      style={{
        transform: `translateX(${translateX}px) scale(${scale})`,
        zIndex: zIndex,
        perspective: '1000px',
        opacity: opacity,
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        visibility: opacity === 0 ? 'hidden' : 'visible', 
      }}
    >
      {/* rotation continer */}
      <div 
        className="relative w-full h-full transition-transform duration-700"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? `rotateY(${rotateFactor * 160}deg)` : "rotateY(0deg)",
          pointerEvents: isFlipped ? "none" : "auto", //disable interactions when flipped
        }}
      >

        {/* front side of card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl border-5 border-white shadow-xl flex flex-col justify-center items-center"
          style={{ 
            backgroundColor: personInfo.cardBG,
            backfaceVisibility: "hidden",
          }}>

            {/* <div className="absolute inset-0" style={{
                    backgroundImage: "url(/Team/ellipse.svg)",
                    zIndex: '0',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    transform: index % 2 !== 0 ? "scaleX(1)" : "scaleX(-1)"
                }}/> */}

          <div className="w-35 h-30 rounded-xl border-5 border-white flex items-center justify-center overflow-hidden">
                
                <div className='w-full h-full' style={{
                backgroundImage: `url(${personInfo.avatar})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                zIndex: 10
                }}></div>
          </div>

          <div className="text-center [font-family: sans-serif] font-[800] mt-3" style={{ zIndex: 10 }}>
            <span className='heading' 
            style={{
                fontSize: '1.5rem',
                WebkitTextStroke: `1px ${personInfo.avatarBorder}`,
                WebkitTextFillColor: `white`,
                filter: 'drop-shadow(3px 3px 1px rgba(0, 0, 0, 1))',
                backgroundImage: 'None',
          }}>{personInfo.name}</span>
            <p className="py-1 text-[1.2rem]"
            style={{
                fontFamily: 'Bangers, cursive',
                WebkitTextStroke: `0.5px black`,
                WebkitTextFillColor: `white`,
                zIndex: 10,
                lineHeight: '1.2rem'
            }}>
              {personInfo.designation}
            </p>
          </div>

          <div className="h-15 w-15"
          style={{
            backgroundImage: `url(${personInfo.decorative})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            zIndex: 10
          }}>

          </div>

        </div>


        {/* back side of card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl  border-4 border-white rounded-[20px]
          shadow-xl flex items-center justify-center text-white"
          style={{ 
            transform: `rotateY(${rotateFactor * 180}deg)`,
            backgroundColor: personInfo.cardBG,
            backgroundImage: `url(${personInfo.decorative})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            backfaceVisibility: "hidden" }}>
          <div className="text-center">
          </div>
        </div>

      </div>
    </div>
  )
}

export default CarouselCard