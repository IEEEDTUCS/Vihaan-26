import { motion } from "motion/react";

export default function FunkyButton({ text, variant = "primary" , isVisible , setIsVisible}) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onClick={() => setIsVisible(!isVisible)}
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, backgroundColor: isPrimary ? "#ffffff" : "#000000", color: isPrimary ? "#000000" : "#ffffff" }}
      whileTap={{ scale: 0.96 , backgroundColor: isPrimary ? "#ffffff" : "#000000", color: isPrimary ? "#000000" : "#ffffff" }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
      }}
      className={`
        inline-flex
        items-center
        justify-center
        text-center
        w-full
        max-w-[22rem]
        sm:max-w-[24rem]
        lg:max-w-[26rem]
        h-[4.5rem]
        sm:h-[5rem]
        lg:h-[5.75rem]
        px-[1.75rem]
        sm:px-[2rem]
        text-xl
        sm:text-2xl
        tracking-[0.12em]
        font-extrabold
        uppercase
        rounded-2xl
        border-4
        bg-black
        select-none
        ${
          isPrimary
            ? "border-white text-white"
            : "border-[#C2FF4A] text-[#C2FF4A]"
        }
      `}
    >
      {text}
    </motion.button>
  );
}
