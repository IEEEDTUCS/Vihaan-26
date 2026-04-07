import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { utils } from "swapy";
import {
  SwapyItem,
  SwapyLayout,
  SwapySlot,
} from "../../utils/swapy.jsx";
import "./gallery-swapy.css";

function SvgCard({ src, name }) {
  return (
    <div className="relative bg-black text-center rounded-2xl h-full w-full overflow-hidden shadow-lg">
      
      {/* BLURRED BACKGROUND */}
      <img
        src={src}
        alt=""
        aria-hidden
        className="
          absolute inset-0 w-full h-full object-cover
          scale-110 blur-xl opacity-50
        "
        draggable={false}
      />

      {/* DARK OVERLAY (optional, improves contrast) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* FOREGROUND IMAGE */}
      <div className="relative z-0 h-full w-full flex items-center justify-center p-4">
        <img
          src={src}
          alt={name}
          className="
            w-full h-full object-contain
            rounded-xl
          "
          draggable={false}
        />
      </div>
    </div>
  );
}


const initialItems = [
  {
    id: "1",
    widgets: <SvgCard src="/Gallerysvgs/c1-1.webp" name="img1" />,
    className: "col-span-3",
  },
  {
    id: "2",
    widgets: <SvgCard src="/Gallerysvgs/c2-1.webp" name="img3" />,
    className: "col-span-4",
  },
  {
    id: "3",
    widgets: <SvgCard src="/Gallerysvgs/c3-1.webp" name="img4" />,
    className: "col-span-5",
  },

  {
    id: "4",
    widgets: <SvgCard src="/Gallerysvgs/c4-1.webp" name="img5" />,
    className: "col-span-5",
  },
  {
    id: "5",
    widgets: <SvgCard src="/Gallerysvgs/c5-1.webp" name="img6" />,
    className: "col-span-4",
  },
  {
    id: "6",
    widgets: <SvgCard src="/Gallerysvgs/c6-1.webp" name="img7" />,
    className: "col-span-3",
  },

  {
    id: "7",
    widgets: <SvgCard src="/Gallerysvgs/c7-1.webp" name="img8" />,
    className: "col-span-4",
  },
  {
    id: "8",
    widgets: <SvgCard src="/Gallerysvgs/c8-1.webp" name="img9" />,
    className: "col-span-3",
  },
  {
    id: "9",
    widgets: <SvgCard src="/Gallerysvgs/c13-1.webp" name="img11" />,
    className: "col-span-5",
  },
];

function DefaultSwapy() {
  const [slotItemMap, setSlotItemMap] = useState(
    utils.initSlotItemMap(initialItems, "id")
  );
  const slottedItems = useMemo(
    () => utils.toSlottedItems(initialItems, "id", slotItemMap),
    [initialItems, slotItemMap]
  );
  return (
    <div>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="swapy-scope">
        <h1
          className="heading mt-20 mb-5 text-center w-[90vw] gallery-heading"
          style={{
            fontSize: "clamp(48px, 10vw, 100px)",
            filter: "drop-shadow(3px 3px 0 white)",
          }}
        >
          Gallery:
        </h1>

        {/* rest of your gallery / swapy layout here */}
      </div>
    </motion.div><SwapyLayout
      id="swapy"
      className="w-full"
      config={{
        swapMode: "hover",
      }}
      onSwap={(event) => {
        console.log("Swap detected!", event.newSlotItemMap.asArray);
      } }
    >
        <div className="swapy-grid">
          {slottedItems.map(({ slotId, itemId }) => {
            const item = initialItems.find((i) => i.id === itemId);
            return (
              <SwapySlot
                key={slotId}
                className={`rounded-lg ${item?.className}`}
                id={slotId}
              >
                <SwapyItem
                  id={itemId}
                  className="relative rounded-lg w-full h-full 2xl:text-xl text-sm"
                  key={itemId}
                >
                  {item?.widgets}
                </SwapyItem>
              </SwapySlot>
            );
          })}
        </div>
      </SwapyLayout>
      <hr
            className="
              glow-hr
              border-0 h-2 w-full
              bg-linear-to-r from-transparent via-[#ffc800] to-transparent
            "/>
    </div>
  );
}

export default DefaultSwapy;
