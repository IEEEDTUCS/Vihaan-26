import { useState } from "react";
import { motion } from "framer-motion";
import Accordion from "./accordion";
import winnerHelper from "./winnerHelper";

export default function WinnersSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full py-16">
      
      {/* HEADING */}
      <motion.div 
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1
              className="heading mt-16 text-center wrap-break-words lg:whitespace-nowrap"
              style={{
              position: 'relative',
              fontSize: "clamp(40px, 8vw, 112px)",
              backgroundImage: "linear-gradient(#f9f9f9, #f9f9f9)",
              WebkitTextStroke: '2px black',
              zIndex: '10',
              lineHeight: 1.1,
              maxWidth: '100vw',
              overflow: 'visible',
              paddingInline: '1rem',
              transform: 'translateZ(0)',}}>
               AND THE&nbsp;
              <span
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  zIndex: '1',
                }}
              >
              <span
                style={{
                  position: 'absolute',
                  inset: '-1.8em',
                  background: 'url(/Faqs/ActionBubble.svg) no-repeat center',
                  backgroundSize: '100% 130%',
                  zIndex: '-1',
                  pointerEvents: 'none',
                }}
              ></span>
                WINNERS
              </span>
              &nbsp;ARE...
            </h1>
          </motion.div>

      {/* ACCORDIONS */}
      <div className="mt-16">
        {winnerHelper.winners.map((item, index) => (
          <Accordion
            key={index}
            QAPair={item}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            index={index}
          />
        ))}
      </div>
    </section>
  );
}