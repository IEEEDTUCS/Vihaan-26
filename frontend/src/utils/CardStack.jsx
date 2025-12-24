import { motion } from "motion/react";

export default function CardStack() {
  return (
    <div
      className="
        relative
        w-[260px] h-[200px]
        sm:w-[300px] sm:h-[230px]
        md:w-[340px] md:h-[260px]
      "
    >
      {/* CARD 1 */}
      <motion.img
        src="/cards1.svg"
        alt="cards1"
        initial={{ opacity: 0, x: -40, rotate: -25 }}
        animate={{ opacity: 1, x: 0, rotate: -15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          absolute
          w-[160px]
          sm:w-[180px]
          md:w-[210px]
          left-0
          top-12
          md:top-16
          shadow-2xl
        "
      />

      {/* CARD 2 */}
      <motion.img
        src="/cards2.svg"
        alt="cards2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
        className="
          absolute
          w-[160px]
          sm:w-[180px]
          md:w-[210px]
          left-[50px]
          sm:left-[60px]
          md:left-[70px]
          top-1
          md:top-2
          shadow-2xl
        "
      />

      {/* CARD 3 */}
      <motion.img
        src="/cards3.svg"
        alt="cards3"
        initial={{ opacity: 0, x: 40, rotate: 25 }}
        animate={{ opacity: 1, x: 0, rotate: 15 }}
        transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
        className="
          absolute
          w-[160px]
          sm:w-[180px]
          md:w-[210px]
          left-[110px]
          sm:left-[130px]
          md:left-[150px]
          top-12
          md:top-16
          shadow-2xl
        "
      />
    </div>
  );
}
