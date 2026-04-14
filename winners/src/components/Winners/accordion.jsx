import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import '../../App.css'

const Accordion = ({ QAPair, isOpen, onToggle, index = 0 }) => {
  const contentRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [showClickEffect, setShowClickEffect] = useState(false);
  const clickTimeoutRef = useRef(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
        style={{
          border: isOpen ? 'None' : '0.3em solid #f9f9f9',
          borderRadius: '0.5rem',
          width: '90%',
          margin: '10px auto',
          zIndex: '10'
        }}
      >

        {/* HEADER */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
            setShowClickEffect(true);
            clickTimeoutRef.current = setTimeout(() => {
              setShowClickEffect(false);
            }, 250);
          }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px',
            backgroundColor: `${QAPair.bgColor}`,
            border: isOpen ? `0.3em solid ${QAPair.borderColor}` : 'None',
            borderRadius: isOpen ? '0.5rem 0.5rem 0 0' : '0em',
          }}
        >

          {/* TRACK NAME */}
          <span
            className='heading'
            style={{
              fontSize: '1.7rem',
              letterSpacing: '0.25rem',
              WebkitTextStroke: `1px ${QAPair.borderColor}`,
              WebkitTextFillColor: `${QAPair.textColor}`,
              filter: 'drop-shadow(3px 3px 1px rgba(0, 0, 0, 1))',
              backgroundImage: 'none',
            }}
          >
            {QAPair.track}
          </span>

          {/* BUTTON */}
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              <div style={{ position: 'relative', width: 36, height: 36 }}>

                {/* CLICK EFFECT (topmost) */}
                {showClickEffect && (
                  <img
                    src="/ButtonClicks/ClickEffect.svg"
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: '0',
                      pointerEvents: 'none',
                      zIndex: 5,
                      transform: 'scale(5)',
                      animation: 'comicClickPop 0.35s ease-out',
                    }}
                  />
                )}

                {/* BOTTOM LAYER */}
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

                {/* MIDDLE LAYER */}
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

                {/* TOP BUTTON (VISIBLE) */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setPressed(true);

                    clearTimeout(clickTimeoutRef.current);
                    setShowClickEffect(true);
                    clickTimeoutRef.current = setTimeout(() => {
                      setShowClickEffect(false);
                    }, 250);
                  }}
                  onMouseUp={(e) => { e.stopPropagation(); setPressed(false); }}
                  onMouseLeave={() => setPressed(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '7mm',
                    outline: '2px solid rgb(0, 0, 0)',
                    transform: pressed ? 'translateY(6px)' : 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 3, // 🔥 ensures image is visible
                  }}
                >
                  <img
                    src={QAPair.buttonPath}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

              </div>
            </div>
          </span>
        </div>

        {/* CONTENT */}
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
          <div
            ref={contentRef}
            className="font-['Edu_TAS_Beginner']"
            style={{
              padding: '12px 14px',
              backgroundColor: `${QAPair.bgColor}`,
              color: `${QAPair.textColor}`,
              fontSize: '1.4rem'
            }}
          >
            <div>🏆 Winner: {QAPair.team}</div>
            <div>🥈 Runner-up: {QAPair.runnerUp}</div>
            <div>🥉 2nd Runner-up: {QAPair.secondRunnerUp}</div>

            <div style={{ marginTop: '10px', fontSize: '1.2rem' }}>
              {QAPair.description}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CLICK EFFECT ANIMATION */}
      <style>
        {`
          @keyframes comicClickPop {
            0% { transform: scale(1); opacity: 0; }
            50% { transform: scale(5.3); opacity: 1; }
            100% { transform: scale(5); opacity: 0; }
          }
        `}
      </style>
    </>
  );
};

export default Accordion;