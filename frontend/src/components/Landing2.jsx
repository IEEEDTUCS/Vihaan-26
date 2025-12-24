import CardStack from "../utils/CardStack";
import Carousel from "../utils/Carousel";
import FunkyButton from "../utils/FunkyButton";
import { motion } from "motion/react";

export default function Landing2() {
  return (
    <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">

      {/* ⭐ DECORATIVE STARS */}
      <img src="/star.svg" className="absolute left-6 top-16 w-6 opacity-70 md:w-8" />
      <img src="/star.svg" className="absolute right-10 top-24 w-7 opacity-60 md:w-9" />
      <img src="/star.svg" className="absolute left-1/4 top-1/3 w-6 opacity-50 md:w-8" />
      <img src="/star.svg" className="absolute right-1/4 top-1/4 w-5 opacity-40 md:w-7" />

      <img src="/star.svg" className="absolute left-12 bottom-24 w-7 opacity-60 md:w-9" />
      <img src="/star.svg" className="absolute right-20 bottom-32 w-6 opacity-50 md:w-8" />
      <img src="/star.svg" className="absolute left-[45%] bottom-20 w-5 opacity-40 md:w-7" />
      <img src="/star.svg" className="absolute right-[40%] top-[45%] w-6 opacity-50 md:w-8" />

      <img src="/star.svg" className="absolute left-[10%] top-[55%] w-5 opacity-30 md:w-7" />
      <img src="/star.svg" className="absolute right-[8%] bottom-[45%] w-6 opacity-40 md:w-8" />

      {/* ================= MAIN WRAPPER ================= */}
      <div className="relative z-10 min-h-screen px-4 sm:px-8 lg:px-16 pt-16">
        <div
          className="
            max-w-[1500px]
            mx-auto
            grid
            grid-cols-2
            gap-24
            items-center
          "
        >

          {/* ================= LEFT SECTION ================= */}
          <div className="w-full flex flex-col items-start">

            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="
                heading
                text-[clamp(30px,5vw,76px)]
                leading-tight
                tracking-wide
                mb-5
              "
              style={{ WebkitTextStroke: "1px black" }}
            >
              BATTLE OF BRAINS
            </motion.h1>

            {/* SUBTEXT */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="
                font-['Edu_TAS_Beginner']
                text-[clamp(13px,1.4vw,18px)]
                leading-relaxed
                tracking-wide
                text-[#D9D9D9]
                max-w-[620px]
                mb-6
              "
            >
              Vihaan isn’t just about building projects.
              <br />
              It’s about learning fast, collaborating harder,
              <br />
              and creating impact when the clock is ticking.
            </motion.p>

            {/* CARDS + BUTTONS */}
            <div className="flex flex-col items-center gap-8 ">
              <CardStack />

              {/* 2rem gap ensured */}
              <div className="flex gap-6 my-8">
                <FunkyButton text="SCHEDULE" />
                <FunkyButton text="DOMAINS" variant="secondary" />
              </div>
            </div>
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="w-full flex justify-end">
            <div className="w-full max-w-[620px]">
              <Carousel />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
