import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const images = ["/carousel.svg", "/carousel2.svg", "/carousel3.svg"];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      3500
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        relative
        w-full
        max-w-[520px]
        aspect-[4/5]
        sm:aspect-[3/4]
        overflow-hidden
        rounded-2xl
        border-[4px] sm:border-[6px] border-white
        bg-black
      "
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt="carousel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
            p-2 sm:p-3
          "
        />
      </AnimatePresence>
    </div>
  );
}

