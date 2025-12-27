import { useEffect, useState } from "react";
import Button from "../utils/button/button.jsx";
import "../App.css";
import { createPortal } from "react-dom";

export default function Landing() {
  const [mobile, setMobile] = useState(window.innerWidth < 900);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const reload = () => window.location.reload();

  const handleComingSoon = (e) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2500);
  };

  const navItems = ["ABOUT", "SCHEDULE", "PRIZES", "TRACKS", "GALLERY", "FAQS"];

  return (
    <>
      <div className="w-full relative bg-[url('./assets/bg.svg')] bg-cover bg-center bg-no-repeat text-white">
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* NAVBAR */}
          <nav
            className={`fixed top-1 left-1/2 -translate-x-1/2 z-50
              w-[95%] max-w-7xl
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
                    <a
                      key={item}
                      href="#tracks"
                      className="font-[Julee] text-lg tracking-[0.12em] px-4 py-1
                        border-2 border-[#9CA802] rounded-md
                        text-[#9CA802] bg-black/60
                        shadow-[0_0_12px_rgba(156,168,2,0.35)]
                      "
                    >
                      {item}
                    </a>
                  ) : (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={
                        item === "SCHEDULE" || item === "PRIZES"
                          ? handleComingSoon
                          : undefined
                      }
                      className="font-[Julee] text-lg cursor-pointer hover:text-[#9CA802] transition"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            )}

            {/* MOBILE ICON */}
            {mobile && !open && (
              <button
                onClick={() => setOpen(true)}
                className="text-3xl font-bold z-50"
              >
                ☰
              </button>
            )}

            {/* MOBILE MENU */}
            {mobile &&
              open &&
              createPortal(
                <div className="fixed inset-0 z-[99999] bg-black text-white">
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-6 right-6 text-4xl"
                  >
                    ✕
                  </button>

                  <div className="w-full h-full flex flex-col items-center justify-center gap-8">
                    <a href="#about" onClick={() => setOpen(false)}>ABOUT</a>

                    <a
                      href="#schedule"
                      onClick={(e) => {
                        handleComingSoon(e);
                        setOpen(false);
                      }}
                    >
                      SCHEDULE
                    </a>

                    <a href="#tracks" onClick={() => setOpen(false)}>TRACKS</a>

                    <a
                      href="#prizes"
                      onClick={(e) => {
                        handleComingSoon(e);
                        setOpen(false);
                      }}
                    >
                      PRIZES
                    </a>

                    <a href="#gallery" onClick={() => setOpen(false)}>GALLERY</a>
                    <a href="#faqs" onClick={() => setOpen(false)}>FAQS</a>
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

            <p className="paragraph text-[clamp(18px,3vw,26px)] mb-12">
              COMING SOON…
            </p>

            <div className="mb-4 text-lg tracking-wide">REGISTER AT</div>
            <Button text="Devfolio" />
          </div>

          <hr
            className="
              glow-hr
              border-0 h-[8px] w-full
              bg-gradient-to-r from-transparent via-[#ffc800] to-transparent
            "
          />
        </div>
      </div>

      {/* COMING SOON TOAST */}
      {showComingSoon && (
        <div
          className="
            fixed bottom-6 right-6 z-[99999]
            px-6 py-3
            rounded-xl
            bg-black/80 backdrop-blur-md
            border border-[#9CA802]
            text-[#9CA802]
            font-[Julee] tracking-widest
            shadow-[0_0_15px_rgba(156,168,2,0.6)]
            animate-fade-in
          "
        >
          🚧 Coming Soon
        </div>
      )}
    </>
  );
}
