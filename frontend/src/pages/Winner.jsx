import WinnersSection from "../components/Winners/winnerSection";
import { motion } from 'framer-motion';

function Winner() {
  const colors = ["#5F005F", "#3D6518", "#373773"];

  return (
    <div className="relative min-h-screen bg-black w-full overflow-hidden">

      <section className="fixed inset-0 w-full h-screen pointer-events-none">
        
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: "22vw",
            height: "100%",
            backgroundImage: "url(/Faqs/SpotPattern.svg)",
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
            backgroundImage: "url(/Faqs/SpotPattern.svg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "200% 60%",
            backgroundPosition: "100% 10%",
            opacity: 0.45,
          }}
        />

        <div className="absolute inset-0">
          {[
            { pos: "left-6 top-14", size: "2.2rem", delay: 0 },
            { pos: "right-10 top-20", size: "3rem", delay: 0.4 },
            { pos: "left-[15%] top-[38%]", size: "1.8rem", delay: 0.8 },
            { pos: "right-[18%] top-[22%]", size: "2.5rem", delay: 1.2 },
          ].map((s, i) => (
            <motion.img
              key={i}
              src="/star.svg"
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

        <div className="absolute bottom-0 left-0 w-full flex items-end h-44 lg:h-64">
          <img
            src="/Schedule/skyline1.png"
            alt=""
            className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]"
          />
          <img
            src="/Schedule/skyline1.png"
            alt=""
            className="w-1/2 h-full object-fill opacity-90 contrast-50 brightness-[2]"
          />
        </div>
      </section>

      <div className="relative z-10">
        <WinnersSection />

        <div className="mt-10 mb-10 text-center">
  
          <h2 className="heading" style={{ fontSize: "clamp(40px, 8vw, 112px)" }}>
            Event Finalists
          </h2>

          <p className="font-['Edu_TAS_Beginner'] mb-10" style={{ fontSize: "clamp(20px, 4vw, 36px)", color:"white" }}>
            Recognized for their exceptional ideas & performance during the competition
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "SheInnovates",
              "Team Vernils",
              "Glitchers",
              "Dhurandars",
              "HackHive",
              "LowGang",
              "claimHeart",
              "Contra resonance",
              "Oscillator",
              "Aurelius",
              "Embedded Syndicate"
            ].map((team, index) => (
              <motion.div
                key={index}
                className="heading-invert bg-white/5 border border-white border-3 rounded-xl p-4"
                style={{ fontSize: "clamp(18px, 3vw, 28px)", backgroundColor: colors[index % colors.length] }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                {team}
              </motion.div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

export default Winner;