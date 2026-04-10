import React from 'react';
import { motion } from 'framer-motion';

export default function Schedule() {
  const nodes = [
    { id: 1, date: "MARCH 20", text: "REGISTRATION BEGINS", x: 20, y: 42, position: 'top' },
    { id: 2, date: "APRIL 5", text: "REGISTRATION ENDS",   x: 35, y: 63, position: 'bottom' },
    { id: 3, date: "APRIL 7", text: "ONLINE QUIZ",      x: 50, y: 42, position: 'top' },
    { id: 4, date: "APRIL 11", text: "VIHAAN STARTS",       x: 65, y: 63, position: 'bottom' },
    { id: 5, date: "APRIL 12", text: "VIHAAN ENDS",         x: 80, y: 42, position: 'top' },
  ];

  /* ── Shared bat-node renderer ─────────────────────────────── */
  const BatNode = ({ node, i, extraClass = '' }) => (
    <motion.div
      key={node.id}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.3 + 0.5, type: 'spring' }}
      className={`flex flex-col items-center justify-center group cursor-pointer ${extraClass}`}
    >
      {node.position === 'top' && (
        <h2
          className="text-white font-kalam tracking-widest -mb-4 lg:-mb-5 relative z-0 group-hover:-translate-y-1 transition-transform"
          style={{
            fontSize: '3rem',
            fontStyle: 'italic',
            fontWeight: 900,
            textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
            letterSpacing: '0.08em',
          }}
        >
          {node.date}
        </h2>
      )}

      {/* Batman logo node */}
      <div className="relative w-full flex items-center justify-center z-10" style={{ aspectRatio: '3 / 1' }}>
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/Schedule/bat-logo.png"
            alt="Bat Node"
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
            style={{
              filter:
                'invert(0.38) brightness(0.75) contrast(1.1)'
                + ' drop-shadow(0 4px 0px #2255ff)'
                + ' drop-shadow(0 -1px 0px #2255ff)'
                + ' drop-shadow(0 0 14px rgba(30,90,255,0.45))',
            }}
          />
        </div>
        <span
          className="relative z-10 text-white font-bangers uppercase text-center px-4 w-[85%] leading-[1.1]"
          style={{
            fontSize: '1.2rem',
            fontStyle: 'italic',
            textShadow: '1px 1px 3px #000, 0 0 8px #000',
            letterSpacing: '0.1em',
            marginTop: '-5%',
          }}
        >
          {node.text}
        </span>
      </div>

      {node.position === 'bottom' && (
        <h2
          className="text-white font-kalam tracking-widest -mt-4 lg:-mt-5 relative z-0 group-hover:translate-y-1 transition-transform"
          style={{
            fontSize: '3rem',
            fontStyle: 'italic',
            fontWeight: 900,
            textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
            letterSpacing: '0.08em',
          }}
        >
          {node.date}
        </h2>
      )}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full pt-24 bg-[#111111a4] overflow-hidden font-sans flex flex-col items-center justify-center">

      {/* Comic Texture Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "url('/Schedule/bg-texture.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Top Left Spider Logo */}
      <div
        className="absolute -top-4 left-0 z-50 pointer-events-none"
        style={{ width: '180px', height: '360px', mixBlendMode: 'screen', opacity: 0.5 }}
      >
        <img src="/Schedule/spider-new.png" alt="Spider Logo" className="w-full opacity-75 h-full object-contain rotate-180" />
      </div>

      {/* ════════ TITLE — mobile only ════════ */}
      <div className="md:hidden relative w-full text-center z-20 pt-8 pb-2">
        <motion.h1
          initial={{ scale: 0.85, opacity: 0, y: -30 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
          className="text-6xl sm:text-8xl text-white uppercase font-bangers"
          style={{
            fontStyle: 'italic',
            letterSpacing: '0.05em',
            transform: 'skewX(-6deg)',
            textShadow: ['3px 3px 0 #1a3fff', '6px 6px 0 #0028cc', '7px 7px 0 #000'].join(', '),
          }}
        >
          EVENT SCHEDULE
        </motion.h1>
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE — vertical stacked layout  (hidden on md+)
      ════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative z-20 w-full flex flex-col items-center gap-0 px-6 pb-52">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <BatNode node={node} i={i} extraClass="w-[280px] sm:w-[340px]" />

            {/* Vertical connector between nodes */}
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 0.4 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.3 + 0.8 }}
                  style={{ transformOrigin: 'top' }}
                  className="w-[1px] h-10 border-l-2 border-dashed border-white/40"
                />
                <motion.img
                  src="/Schedule/spider-new-tilted.png"
                  alt=""
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.7 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3 + 1.2 }}
                  className="w-7 h-7 object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 0.4 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.3 + 0.9 }}
                  style={{ transformOrigin: 'top' }}
                  className="w-[1px] h-10 border-l-2 border-dashed border-white/40"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          DESKTOP — original absolute-positioned layout (hidden on mobile)
      ════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex relative w-full max-w-7xl flex-1 flex-col justify-center min-h-[800px]">

        {/* Desktop title — absolute so it doesn't push nodes down */}
        <div className="absolute top-4 w-full text-center z-20">
          <motion.h1
            initial={{ scale: 0.85, opacity: 0, y: -30 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
            className="text-9xl text-white uppercase font-bangers"
            style={{
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              transform: 'skewX(-6deg)',
              textShadow: ['3px 3px 0 #1a3fff', '6px 6px 0 #0028cc', '7px 7px 0 #000'].join(', '),
            }}
          >
            EVENT SCHEDULE
          </motion.h1>
        </div>

        {/* SVG connection lines + spider icons */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            {nodes.map((node, i) => {
              if (i === nodes.length - 1) return null;
              const next   = nodes[i + 1];
              const startY = node.position === 'top' ? node.y + 4 : node.y - 4;
              const endY   = next.position === 'top' ? next.y + 4 : next.y - 4;
              const midX   = (node.x + next.x) / 2;
              const midY   = (startY + endY) / 2;
              const angle  = Math.atan2(endY - startY, next.x - node.x) * (180 / Math.PI) + 90;

              return (
                <g key={`connection-web-${i}`}>
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.3 + 0.5 }}
                    d={`M ${node.x} ${startY} L ${next.x} ${endY}`}
                    stroke="white"
                    strokeWidth="0.2"
                    strokeDasharray="1 1"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                  <motion.g
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.7 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 + 1.2 }}
                  >
                    <image
                      href="/Schedule/spider-new-tilted.png"
                      x={midX - 1.75}
                      y={midY - 1.75}
                      width="3.5"
                      height="3.5"
                      transform={`rotate(${angle} ${midX} ${midY})`}
                      style={{ mixBlendMode: 'screen', opacity: 0.9 }}
                    />
                  </motion.g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Absolutely positioned timeline nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.3 + 0.5, type: 'spring' }}
            className="absolute z-20 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 w-[320px] lg:w-[460px] group cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.position === 'top' && (
              <h2
                className="text-white font-kalam tracking-widest -mb-4 lg:-mb-5 relative z-0 group-hover:-translate-y-1 transition-transform"
                style={{
                  fontSize: '3rem', fontStyle: 'italic', fontWeight: 900,
                  textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
                  letterSpacing: '0.08em',
                }}
              >
                {node.date}
              </h2>
            )}

            <div className="relative w-full flex items-center justify-center z-10" style={{ aspectRatio: '3 / 1' }}>
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/Schedule/bat-logo.png"
                  alt="Bat Node"
                  className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                  style={{
                    filter:
                      'invert(0.38) brightness(0.75) contrast(1.1)'
                      + ' drop-shadow(0 4px 0px #2255ff)'
                      + ' drop-shadow(0 -1px 0px #2255ff)'
                      + ' drop-shadow(0 0 14px rgba(30,90,255,0.45))',
                  }}
                />
              </div>
              <span
                className="relative z-10 text-white font-bangers uppercase text-center px-4 w-[85%] leading-[1.1]"
                style={{
                  fontSize: '1.2rem', fontStyle: 'italic',
                  textShadow: '1px 1px 3px #000, 0 0 8px #000',
                  letterSpacing: '0.1em', marginTop: '-5%',
                }}
              >
                {node.text}
              </span>
            </div>

            {node.position === 'bottom' && (
              <h2
                className="text-white font-kalam tracking-widest -mt-4 lg:-mt-5 relative z-0 group-hover:translate-y-1 transition-transform"
                style={{
                  fontSize: '3rem', fontStyle: 'italic', fontWeight: 900,
                  textShadow: '2px 2px 0 #000, -1px -1px 0 #000',
                  letterSpacing: '0.08em',
                }}
              >
                {node.date}
              </h2>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer Cityscape */}
      <div className="absolute bottom-0 left-0 w-full flex items-end z-0 pointer-events-none h-48 lg:h-72">
        <img src="/Schedule/skyline1.png" alt="Skyline Left"  className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]" />
        <img src="/Schedule/skyline1.png" alt="Skyline Right" className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]" />
      </div>
    </div>
  );
}
