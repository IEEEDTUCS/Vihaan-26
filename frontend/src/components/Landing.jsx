import { useEffect, useState } from "react";
import Button from "../utils/button/button.jsx";
import "../App.css";
import { createPortal } from "react-dom";
// If you are using Next.js, you might need: import { useEffect, useState } from "react";

export default function Landing() {
  const [mobile, setMobile] = useState(window.innerWidth < 900);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 900);
    const onScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const reload = () => window.location.reload();

  const navItems = ["ABOUT", "SCHEDULE", "PRIZES", "TRACKS", "GALLERY", "FAQS"];
  useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "auto";
}, [open]);

const [mounted, setMounted] = useState(false);

useEffect(() => {
   setMounted(true);
}, []);


  return (
    <div className="min-h-screen w-full bg-[url('/bglanding.svg')] bg-cover bg-center bg-no-repeat relative text-white">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* NAVBAR */}
       <nav
  className={`fixed top-1 left-1/2 -translate-x-1/2   z-50
  w-[92%] max-w-6xl
  flex items-center justify-between
  px-5 rounded-xl
  transition-all duration-300
  ${scrolled ? "backdrop-blur-md bg-black/30 shadow-md" : "bg-transparent"}
`}
>
          {/* LOGO */}
          <img
            src="/vihaanlogo.svg"
            alt="logo"
            className="w-20 cursor-pointer"
            onClick={reload}
          />

          {/* DESKTOP NAV */}
          {!mobile && (
            <div className="flex items-center gap-8">
              {navItems.map((item) =>
                item === "TRACKS" ? (
                  <span
                    key={item}
                    className="font-[Julee] text-lg tracking-[0.12em] px-4 py-1
                    border-2 border-[#9CA802] rounded-md
                    text-[#9CA802] bg-black/60
                    shadow-[0_0_12px_rgba(156,168,2,0.35)]
                    cursor-pointer"
                  >
                    {item}
                  </span>
                ) : (
                  <span
                    key={item}
                    className="font-[Julee] text-lg cursor-pointer hover:text-[#9CA802] transition"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          )}

          {/* MOBILE ICON */}
         
{/* 1. HAMBURGER BUTTON (Only visible when mobile and menu is CLOSED) */}
{/* 1. HAMBURGER BUTTON (Only visible when mobile and menu is CLOSED) */}
{/* 1. HAMBURGER BUTTON (Visible when menu is CLOSED) */}
{mobile && !open && (
  <button
    onClick={() => setOpen(true)}
    className="text-3xl font-bold focus:outline-none z-50 relative"
    aria-label="Open Menu"
  >
    ☰
  </button>
)}

{/* 2. FULL SCREEN MENU OVERLAY (Using Portal to break out of containers) */}
{mobile && open && createPortal(
  <div
    className="
      fixed inset-0
      z-[99999]
      w-screen h-screen
      bg-black text-white
     
      border-2 border-gray-400 
    "
    // This inline style ensures it sits on top of absolutely everything
    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
  >
    {/* CLOSE BUTTON */}
    <button
      onClick={() => setOpen(false)}
      className="absolute top-6 right-6 text-4xl hover:text-[#9CA802] transition-colors z-[100000] cursor-pointer"
      aria-label="Close Menu"
    >
      ✕
    </button>

    {/* SCROLLABLE CONTENT CONTAINER */}
    <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-center py-16 px-6">
      
      {/* TITLE */}
      <h1 className="heading  mb-20"
       style={{ 
         filter: "drop-shadow(3px 3px 0 white)"
        }}>
        MENU
      </h1>

      <div className="flex flex-col  gap-8 text-center w-full max-w-md">
        
        {/* STARTERS */}
        <div className="flex flex-col gap-8">
          <a href="#about" onClick={() => setOpen(false)} className="font-[Julee] text-2xl hover:text-[#9CA802] transition">
            ABOUT
          </a>
          <a href="#schedule" onClick={() => setOpen(false)} className="font-[Julee] text-2xl hover:text-[#9CA802] transition">
            SCHEDULE
          </a>
        </div>

        {/* MAIN */}
        <div className="flex flex-col gap-8 items-center">
          <a
            href="#tracks"
            onClick={() => setOpen(false)}
            className="
              font-[Julee] text-2xl border border-[#9CA802] rounded-md
              text-[#9CA802] bg-black/60
              shadow-[0_0_12px_rgba(156,168,2,0.35)]
              cursor-pointer font-bold px-10 py-2
              hover:scale-105 transition-transform
            "
          >
            TRACKS
          </a>
          <a href="#prizes" onClick={() => setOpen(false)} className="font-[Julee] text-2xl hover:text-[#9CA802] transition">
            PRIZES
          </a>
        </div>

        {/* MORE */}
        <div className="flex flex-col gap-8">
          <a href="#gallery" onClick={() => setOpen(false)} className="font-[Julee] text-2xl hover:text-[#9CA802] transition">
            GALLERY
          </a>
          <a href="#faqs" onClick={() => setOpen(false)} className="font-[Julee] text-2xl hover:text-[#9CA802] transition">
            FAQS
          </a>
        </div>

      </div>
    </div>
  </div>,
  document.body
)}

        </nav>

        {/* HERO */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
          <h1 className="heading text-[clamp(48px,10vw,100px)]">
            VIHAAN 9.0
          </h1>

          <p className="paragraph text-[clamp(18px,3vw,26px)] mb-6">
            COMING SOON…
          </p>

          <div className="mb-4 text-lg tracking-wide">REGISTER AT</div>
          <Button text="Devfolio" />
        </div>
      </div>
    </div>
  );
}
