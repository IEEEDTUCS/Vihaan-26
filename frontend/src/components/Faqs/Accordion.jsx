import { useState, useRef } from 'react';

const Accordion = ({QAPair}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [showClickEffect, setShowClickEffect] = useState(false);
  const clickTimeoutRef = useRef(null);

  return (
    <>
    <div
      style={{ border: isOpen ? 'None' : '0.3em solid #f9f9f9', borderRadius: '0.5rem', width: '90%', margin: '10px auto', overflow: 'visible', zIndex: '100' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px',
          background: '#fff',
          backgroundColor: `${QAPair.bgColor}`,
          border: isOpen ? `0.3em solid ${QAPair.borderColor}` : 'None',
          borderRadius: isOpen ? '0.5rem 0.5rem 0 0' : '0em',
          borderBottom: isOpen ? 'None' : '0em',
        }}>
        <span className='heading' style={{
            fontSize: '1.7rem',
            letterSpacing: '0.25rem',
            WebkitTextStroke: `1px ${QAPair.borderColor}`,
            WebkitTextFillColor: `${QAPair.textColor}`,
            filter: 'drop-shadow(3px 3px 1px rgba(0, 0, 0, 1))',
            backgroundImage: 'None',
          }}>{QAPair.question}</span>

        <span style={{ display: 'flex', alignItems: 'center' }}>
          
          {/* layered button */}

          <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* click effect */}

            <div style={{ position: 'relative', width: 36, height: 36 }}>
              {showClickEffect && (
              <img
                src="/Faqs/ButtonClicks/ClickEffect.svg"
                alt=""
                style={{
                  position: 'absolute',
                  inset: '0',
                  pointerEvents: 'none',
                  zIndex: 50000,
                  transform: 'scale(5)',
                  animation: 'comicClickPop 0.35s ease-out',
                }}
              />
            )}
              {/* top layer */}
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(prev => !prev);
                }}
                onMouseDown={(e) => { 
                  e.stopPropagation(); 
                  setPressed(true); 

                  clearTimeout(clickTimeoutRef.current);
                  setShowClickEffect(true);
                  clickTimeoutRef.current = setTimeout(() => {
                    setShowClickEffect(false);
                  }, 250);    //keeping duration shorter than animation duration for effect
                }}
                onMouseUp={(e) => { e.stopPropagation(); setPressed(false); }}
                onMouseLeave={() => setPressed(false)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); } }}
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '7mm',
                  outline: '2px solid rgb(0, 0, 0)',
                  transition: 'transform 0.12s ease, background 0.2s',
                  position: 'relative',
                  zIndex: 3,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transform: pressed ? 'translateY(6px)' : 'none',
                  userSelect: 'none',
                }}
              >
                <img
                  src={QAPair.buttonPath}
                  alt={isOpen ? 'close' : 'open'}
                  style={{ width: '100%', height: '100%', pointerEvents: 'None' }}
                />
              </div>

              {/* middle layer */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'black',
                top: 3,
                left: 0,
                borderRadius: '7mm',
                outline: '4px solid rgb(36, 38, 34)',
                zIndex: 2,
                pointerEvents: 'none',
              }} />

              {/* bottom layer */}
              <div style={{
                position: 'absolute',
                width: 'calc(100% + 2px)',
                height: '100%',
                background: 'rgb(140, 140, 140)',
                top: 6,
                left: -1,
                borderRadius: '7mm',
                outline: '2px solid rgb(36, 38, 34)',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
            </div>
          </div>
        </span>

      </div>

    {/* content box of accordion */}
      <div
        style={{
          height: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
          transition: 'height 0.3s ease, opacity 0.2s ease',
          border: isOpen ? `0.3em solid ${QAPair.borderColor}` : 'None',
          borderRadius: isOpen ? '0 0 0.5rem 0.5rem' : '0em',
          overflow: 'hidden'
        }}
      >
        <div ref={contentRef} className="font-['Edu_TAS_Beginner']"
          style={{ 
            padding: '12px 14px', 
            backgroundColor: `${QAPair.bgColor}`, 
            color: `${QAPair.textColor}`, 
            fontWeight: QAPair.textColor === "white" ? '500' : '700', 
            fontSize: '1.4rem' }}>{QAPair.answer}</div>
      </div>
    </div>

    {/* click effect animation */}
    <style>
    {`
      @keyframes comicClickPop {
        0% {
          transform: scale(1);
          opacity: 0;
        }
        50% {
          transform: scale(5.3);
          opacity: 1;
        }
        100% {
          transform: scale(5);
          opacity: 0;
        }
      }
    `}
    </style>

    </>
  );
};

export default Accordion;