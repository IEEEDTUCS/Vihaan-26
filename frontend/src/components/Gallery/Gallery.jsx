"use client";
import { useMemo, useState } from "react";
import { utils } from "swapy";
import {
  SwapyItem,
  SwapyLayout,
  SwapySlot,
} from "../../component/uilayouts/swapy.jsx";
import "./gallery-swapy.css";

function SvgCard({ src, name }) {
  return (
    <div className="relative bg-black rounded-2xl h-full w-full overflow-hidden shadow-lg">
      
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
    widgets: <SvgCard src="/Gallerysvgs/img1.svg" name="img1" />,
    className: "col-span-3",
  },
  {
    id: "2",
    widgets: <SvgCard src="/cards3.svg" name="img3" />,
    className: "col-span-4",
  },
  {
    id: "3",
    widgets: <SvgCard src="/Gallerysvgs/img4.svg" name="img4" />,
    className: "col-span-5",
  },

  {
    id: "4",
    widgets: <SvgCard src="/Gallerysvgs/img5.svg" name="img5" />,
    className: "col-span-5",
  },
  {
    id: "5",
    widgets: <SvgCard src="/Gallerysvgs/img6.svg" name="img6" />,
    className: "col-span-4",
  },
  {
    id: "6",
    widgets: <SvgCard src="/Gallerysvgs/img7.svg" name="img7" />,
    className: "col-span-3",
  },

  {
    id: "7",
    widgets: <SvgCard src="/Gallerysvgs/img8.svg" name="img8" />,
    className: "col-span-4",
  },
  {
    id: "8",
    widgets: <SvgCard src="/Gallerysvgs/img9.svg" name="img9" />,
    className: "col-span-3",
  },
  {
    id: "9",
    widgets: <SvgCard src="/Gallerysvgs/img11.svg" name="img11" />,
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
    <div className="swapy-scope">
      <h1
  className="heading mt-20 mb-5 text-center w-full gallery-heading"
  style={{ fontSize: "clamp(48px, 10vw, 100px)" ,filter: "drop-shadow(3px 3px 0 white)" }}
>
  Gallery:
</h1>


      <SwapyLayout
        id="swapy"
        className="w-full"
        config={{
          swapMode: "hover",
        }}
        onSwap={(event) => {
          console.log("Swap detected!", event.newSlotItemMap.asArray);
        }}
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
    </div>
  );
}

export default DefaultSwapy;
