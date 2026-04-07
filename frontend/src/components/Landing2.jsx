
import CardStack from "../utils/CardStack";
import FunkyButton from "../utils/FunkyButton";
import { motion } from "framer-motion";
import { useState } from "react";
import About from "./About/About.jsx";

/* Ambient star animation (always running) */
const starBlink = {
  animate: {
    opacity: [0.25, 0.8, 0.25],
    scale: [1, 1.15, 1],
  },
  transition: {
    duration: 2.4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function Landing2() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div className="relative">
        <About isVisible={isVisible} setIsVisible={setIsVisible} />
      </div>

      <section className="relative min-h-screen w-full text-white overflow-hidden">
        {/* Decorative Borders */}
        <img
          src="/aboutUsBorder.svg"
          alt=""
          className="pointer-events-none absolute top-0 left-0 z-0 w-[70%] h-[50%]"
        />
        <img
          src="/aboutUsBorder.svg"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 z-0 w-[40%] h-[20%]"
        />
        <img
          src="/aboutUsBorder.svg"
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 z-0 w-[40%] h-[30%]"
        />

        {/* Stars */}
        <div className="absolute inset-0 z-0">
          {[
            "left-8 top-20",
            "right-16 top-28",
            "left-1/4 top-1/3",
            "right-1/3 top-1/4",
            "left-14 bottom-28",
            "right-28 bottom-36",
            "left-[48%] bottom-24",
            "right-[42%] top-[48%]",
          ].map((pos, i) => (
            <motion.img
              key={i}
              src="/star.svg"
              className={`absolute ${pos} w-[3rem] md:w-[3.75rem] opacity-60`}
              {...starBlink}
              transition={{ ...starBlink.transition, delay: i * 0.35 }}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-linear-to-b from-black/50 via-black/30 to-black/70" />

        {/* MAIN CONTENT (scroll-triggered) */}
        <motion.div
          className="relative z-1 min-h-screen px-8 sm:px-14 lg:px-26 pt-26 pb-24"
        >
          <div className="max-w-384 mx-auto flex items-center justify-between gap-24">
            {/* LEFT */}
            <div className="flex flex-col gap-[2.2rem] max-w-176">
              <motion.h1
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="
                  heading
                  text-[4.6rem]
                  leading-[1.05]
                  pb-3
                  border-b-2
                  border-dotted
                  border-white/40
                "
                style={{ filter: "drop-shadow(3px 3px 0 white)" }}
              >
                VIHAAN 9.0
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ filter: "drop-shadow(3px 3px 0 white)" }}
                className="
                  heading
                  text-[3rem]
                  leading-[1.1]
                  pb-3
                  border-b-2
                  border-dotted
                  border-white/30
                "
              >
                PRESENTED BY IEEE DTU
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="
                  mt-4
                  rounded-[1.25rem]
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-md
                  p-7
                  max-w-152
                "
              >
                <p
                  style={{ fontFamily: "Julee, cursive" }}
                  className="text-[1.55rem] text-[#E6E6E6] leading-relaxed"
                >
                  Vihaan isn’t just about building projects.
                  <br />
                  It’s about learning fast, collaborating harder,
                  <br />
                  and creating impact when the clock is ticking.
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-13"
              >
                <FunkyButton
                  text="ABOUT IEEE DTU"
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                />
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="flex justify-end w-[34%] min-w-[20rem]"
            >
              <div className="origin-right scale-[1.1]">
                <CardStack />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
