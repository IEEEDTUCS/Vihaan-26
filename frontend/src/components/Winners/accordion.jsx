import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

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
          border: isOpen ? 'none' : '0.3em solid #f9f9f9',
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
            border: isOpen ? `0.3em solid ${QAPair.borderColor}` : 'none',
            borderRadius: isOpen ? '0.5rem 0.5rem 0 0' : '0',
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

                {/* CLICK EFFECT */}
                {showClickEffect && (
                  <img
                    src="/Faqs/ButtonClicks/ClickEffect.svg"
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

                {/* DEPTH LAYERS */}
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
                }} />

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
                }} />

                {/* BUTTON */}
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
                    outline: '2px solid black',
                    transform: pressed ? 'translateY(6px)' : 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 3,
                  }}
                >
                  <img
                    src={QAPair.buttonPath}
                    alt=""
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

              </div>
            </div>
          </span>
        </div>

        {/* CONTENT WRAPPER */}
        <div
          style={{
            height: isOpen ? contentRef.current?.scrollHeight : 0,
            opacity: isOpen ? 1 : 0,
            transition: 'height 0.35s ease, opacity 0.25s ease',
            overflow: 'hidden',
            border: isOpen ? `0.3em solid ${QAPair.borderColor}` : 'none',
            borderRadius: isOpen ? '0 0 0.5rem 0.5rem' : '0',
          }}
        >
          <div
            ref={contentRef}
            className="font-['Edu_TAS_Beginner']"
            style={{
              padding: '16px',
              backgroundColor: `${QAPair.bgColor}`,
              color: `${QAPair.textColor}`,
            }}
          >

            {/* TEXT */}
            <div style={{ fontSize: '1.3rem' }}>
              <div>🏆 Winner: {QAPair.team}</div>
              {QAPair.runnerUp && <div>🥈 Runner-up: {QAPair.runnerUp}</div>}
              {QAPair.secondRunnerUp && <div>🥉 2nd Runner-up: {QAPair.secondRunnerUp}</div>}

              <div style={{ marginTop: '10px' }}>
                Winning Product: {QAPair.projectName}
              </div>

              <div style={{ marginTop: '10px', fontSize: '1.1rem' }}>
                {QAPair.description}
              </div>
            </div>

            {/* MEDIA */}
            <div className="mt-8 flex flex-col gap-10">

              {/* WINNER */}
              {QAPair.media?.winner && (
                <div>
                  <h3 className="heading-invert mb-2">Winner: {QAPair.media?.winner.name}</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {QAPair.media.winner.team && (
                      <div className="w-full aspect-square overflow-hidden rounded-lg bg-black flex items-center justify-center">
                        <img
                          src={QAPair.media.winner.team}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    {QAPair.media.winner.project && (
                      <div className="w-full aspect-square overflow-hidden rounded-lg bg-black flex items-center justify-center">
                        <img
                          src={QAPair.media.winner.project}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RUNNER UP */}
              {QAPair.media?.runnerUp && (
                <div>
                  <h3 className="heading-invert mb-2">Runner-up: {QAPair.media?.runnerUp.name}</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {QAPair.media.runnerUp.team && (
                      <div className="w-full aspect-square overflow-hidden rounded-lg bg-black flex items-center justify-center">
                        <img
                          src={QAPair.media.runnerUp.team}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    {QAPair.media.runnerUp.project && (
                      <div className="w-full aspect-square overflow-hidden rounded-lg bg-black flex items-center justify-center">
                        <img
                          src={QAPair.media.runnerUp.project}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECOND RUNNER UP */}
              {QAPair.media?.secondRunnerUp && (
                <div>
                  <h3 className="heading-invert mb-2">2nd Runner-up: {QAPair.media?.secondRunnerUp.name}</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {QAPair.media.secondRunnerUp.team && (
                      <div className="w-full aspect-square overflow-hidden rounded-lg bg-black flex items-center justify-center">
                        <img
                          src={QAPair.media.secondRunnerUp.team}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}

                    {QAPair.media.secondRunnerUp.project && (
                      <div className="w-full aspect-square overflow-hidden rounded-lg bg-black flex items-center justify-center">
                        <img
                          src={QAPair.media.secondRunnerUp.project}
                          className="rounded-lg w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
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