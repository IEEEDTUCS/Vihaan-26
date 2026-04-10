import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0E0E0E] text-white font-bangers">
      <motion.div 
        className="
          max-w-7xl mx-auto
          px-2 py-10
          flex flex-row flex-wrap
          justify-center md:justify-between
          gap-x-22 gap-y-10
        "
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* LOGO */}
        <div className="flex flex-col items-center">
          <img
            src="../logo.svg"
            alt="Vihaan Logo"
            className="w-36 md:w-48"
          />
        </div>

        {/* VENUE */}
        <div className="flex flex-col min-w-[260px]">
          <h2 className="text-4xl mb-2">VENUE</h2>

          <div className="font-serif text-sm mb-3 flex gap-2 items-start">
            <i className="fa-sharp fa-solid fa-location-dot mt-1"></i>
            <span>
              Delhi Technological<br />University
            </span>
          </div>

          {/* MAP */}
          <div
            className="
              w-full max-w-[400px]
              h-[200px]
              rounded-lg overflow-hidden
              opacity-75 hover:opacity-100
              hover:scale-105 transition
            "
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13991.928144078916!2d77.10000993955076!3d28.749953300000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0138a74f7da7%3A0xf09fad683c23bd5d!2sDelhi%20Technological%20University!5e0!3m2!1sen!2sin!4v1766730612878!5m2!1sen!2sin"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DTU Location"
            />
          </div>
        </div>

        {/* CONTACT */}
        <div className="flex flex-col min-w-[260px]">
          <h2 className="text-4xl mb-2">CONTACT US</h2>

          <div className="font-serif text-lg flex gap-2 mb-3">
            <i className="fa-sharp fa-solid fa-phone mt-1"></i>
            <div className="flex  flex-col">
              <span>Jahan Sharma</span>
              <span>(+91 8273754287)</span>
            </div>
          </div>

          <div className="font-serif text-lg flex gap-2 mb-3">
            <i className="fa-sharp fa-solid fa-phone mt-1"></i>
            <div className="flex flex-col">
              <span>Rudit Madaan</span>
              <span>(+91 96257 01606)</span>
            </div>
          </div>

          <div className="font-serif text-lg flex gap-2">
            <i className="fa-solid fa-message mt-1"></i>
            <span>ieeedtucs123@gmail.com</span>
          </div>
        </div>

        {/* SOCIALS + SCROLL */}
        <div className="flex flex-col items-center min-w-[220px]">
          <h2 className="text-4xl mb-2">SOCIAL MEDIA</h2>
          <div className="font-serif text-lg mb-4">Code, Chaos, Comics</div>

          <div className="flex gap-4 mb-4 justify-center md:justify-start text-black">

  {/* DISCORD */}
  <a
    href="https://m.facebook.com/ieeedtu/"
    target="_blank"
    rel="noopener noreferrer"
    className="relative inline-flex items-center justify-center group"
  >
    <svg
      viewBox="0 0 100 100"
      className="w-14 h-14  transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
      aria-hidden="true"
    >
      <polygon
        fill="#2563eb"
        className="transition-colors bg-black duration-300 group-hover:fill-indigo-400"
        points="
          50,0 57,18 74,6 70,26 90,20 80,38
          100,50 80,62 90,80 70,74 74,94 57,82
          50,100 43,82 26,94 30,74 10,80 20,62
          0,50 20,38 10,20 30,26 26,6 43,18
        "
      />
    </svg>
    <i className="fa-brands fa-facebook absolute text-white text-2xl" />
  </a>

  {/* INSTAGRAM */}
  <a
    href="https://www.instagram.com/vihaan_dtu/"
    target="_blank"
    rel="noopener noreferrer"
    className="relative group"
  >
    <svg
      width="64"
      height="64"
      viewBox="0 0 60 70"
      className="absolute transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
    >
      <polygon
        points="32,64 60,34 48,15 14,16 6,32"
        fill="#e6b800"
        stroke="#b22222"
        strokeWidth="4"
        className="transition-colors duration-300 group-hover:fill-yellow-300"
      />
    </svg>
    <i className="fa-brands fa-instagram relative text-white text-3xl m-4" />
  </a>

  {/* LINKEDIN */}
  <a
    href="https://www.linkedin.com/company/ieee-dtu/posts/?feedView=all"
    target="_blank"
    rel="noopener noreferrer"
    className="relative inline-flex items-center justify-center group"
  >
    <svg
      viewBox="0 0 100 100"
      className="w-14 h-14 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
      aria-hidden="true"
    >
      <polygon
        fill="#b91c1c"
        className="transition-colors duration-300 group-hover:fill-blue-500"
        points="
          50,0 57,18 74,6 70,26 90,20 80,38
          100,50 80,62 90,80 70,74 74,94 57,82
          50,100 43,82 26,94 30,74 10,80 20,62
          0,50 20,38 10,20 30,26 26,6 43,18
        "
      />
    </svg>
    <i className="fa-brands fa-linkedin-in absolute text-white text-2xl" />
  </a>

</div>


          {/* SCROLL TO TOP */}
          <button
            className="
              rounded-full border-2 border-[#d4d700]
              p-2 text-[#d4d700]
              hover:bg-[#d4d700] hover:text-black
              transition
            "
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            title="Scroll to top"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <g transform="translate(0, -3)">
                <path d="M12 24V5M5 12l7-7 7 7" />
              </g>
            </svg>
          </button>
        </div>
      </motion.div>

      <hr className="border-gray-700" />

      <motion.div
        className="text-center py-3 text-[#d4d700] text-lg tracking-wider"
        style={{ fontFamily: "Bangers, system-ui" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        MADE WITH CARE BY IEEE DTU
      </motion.div>
    </footer>
  );
}
