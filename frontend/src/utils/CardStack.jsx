import { motion } from "framer-motion";

export default function CardStack() {
  return (
    <div
      className="
        relative
        w-[22rem] h-[16rem]
        sm:w-[26rem] sm:h-[19rem]
        md:w-[30rem] md:h-[22rem]
      "
    >
      {/* CARD 1 — LEFT */}
      <motion.img
        src="/Gallerysvgs/c1-1.webp"
        alt="cards1"
        initial={{
          opacity: 0,
          y: "-7rem",
          rotate: -25,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: ["-7rem", "1.5rem", "0rem"],
          rotate: -15,
          scale: [0.9, 1.05, 1],
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
          delay: 0,
        }}
        className="
          absolute
          w-[16rem]
          sm:w-[18rem]
          md:w-[20rem]
          left-0
          top-[3.75rem]
          md:top-[4.75rem]
          rounded-xl
          border-[1px] border-black/15
        "
      />

      {/* CARD 2 — MIDDLE (MAIN) */}
      <motion.img
        src="/Gallerysvgs/c12-1.webp"
        alt="cards2"
        initial={{
          opacity: 0,
          y: "-8rem",
          rotate: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: ["-8rem", "2rem", "0rem"],
          rotate: 3,
          scale: [0.9, 1.08, 1],
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.18,
        }}
        className="
          absolute
          w-[17rem]
          sm:w-[19rem]
          md:w-[21rem]
          left-[4.75rem]
          sm:left-[6rem]
          md:left-[7.25rem]
          top-[0.5rem]
          md:top-[0.75rem]
          rounded-xl
          border-[1px] border-black/15
          z-10
        "
      />

      {/* CARD 3 — RIGHT */}
      <motion.img
        src="/Gallerysvgs/c14-1.webp"
        alt="cards3"
        initial={{
          opacity: 0,
          y: "-7rem",
          rotate: 25,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: ["-7rem", "1.5rem", "0rem"],
          rotate: 15,
          scale: [0.9, 1.05, 1],
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.36,
        }}
        className="
          absolute
          w-[16rem]
          sm:w-[18rem]
          md:w-[20rem]
          left-[10.75rem]
          sm:left-[12.75rem]
          md:left-[14.75rem]
          top-[3.75rem]
          md:top-[4.75rem]
          rounded-xl
          border-[1px] border-black/15
        "
      />
    </div>
  );
}
