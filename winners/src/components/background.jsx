import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* ── Side Patterns ── */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "22vw",
          height: "100%",
          backgroundImage: "url(/SpotPattern.svg)", // ✅ fixed
          backgroundRepeat: "no-repeat",
          backgroundSize: "200% 60%",
          backgroundPosition: "0 10%",
          opacity: 0.45,
        }}
      />
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: "22vw",
          height: "100%",
          backgroundImage: "url(/SpotPattern.svg)", // ✅ fixed
          backgroundRepeat: "no-repeat",
          backgroundSize: "200% 60%",
          backgroundPosition: "100% 10%",
          opacity: 0.45,
        }}
      />

      {/* ── Glowing Stars ── */}
      <div className="absolute inset-0">
        {[
          { pos: "left-6 top-14", size: "2.2rem", delay: 0 },
          { pos: "right-10 top-20", size: "3rem", delay: 0.4 },
          { pos: "left-[15%] top-[38%]", size: "1.8rem", delay: 0.8 },
          { pos: "right-[18%] top-[22%]", size: "2.5rem", delay: 1.2 },
        ].map((s, i) => (
          <motion.img
            key={i}
            src="/star.svg" // already correct
            className={`absolute ${s.pos}`}
            style={{ width: s.size, opacity: 0.45 }}
            animate={{ opacity: [0.2, 0.65, 0.2], scale: [1, 1.2, 1] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            }}
          />
        ))}
      </div>

      {/* ── Skyline ── */}
      <div className="absolute bottom-0 left-0 w-full flex items-end h-44 lg:h-64">
        <img
          src="/skyline1.png" // ✅ fixed
          alt=""
          className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]"
        />
        <img
          src="/skyline1.png" // ✅ fixed
          alt=""
          className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]"
        />
      </div>
    </div>
  );
}