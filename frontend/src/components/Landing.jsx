

import { useEffect, useState } from "react";

import "../App.css";
import Button from "../utils/button";

export default function Landing() {

  const [mobile, setMobile] = useState(window.innerWidth < 900);
const [open, setOpen] = useState(false); 

  useEffect(() => {
    const resize = () => setMobile(window.innerWidth < 900);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const reload = () => {
    window.location.reload();
  };


  return (
    <>
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: "url('/bglanding.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        color: "#fff",
           // 
      }}
    >
      {/* DARK OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/*  NAVBAR */}
        <nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  }}
>
  {/* LOGO */}
  
  <img
    src="/vihaanlogo.svg"
    alt="logo"
    className="cursor-pointer"
    style={{ width: "100px" }}
    onClick={reload}
  />

  {/* DESKTOP NAV */}
  {!mobile && (
    <div style={{ display: "flex", gap: "32px" }}>
      {["ABOUT", "SCHEDULE", "PRIZES", "TRACKS","GALLERY","FAQS"].map((item) => (
        <span
          key={item}
          style={{
            fontFamily: "Julee, cursive",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )}

  {/* MOBILE HAMBURGER */}
  {mobile && (
    <div style={{ position: "relative" }}>
      {/* ☰ */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          fontSize: "28px",
          color: "#fff",
          userSelect: "none",
        }}
      >
        ☰
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            background: "#000",
            border: "1px solid #fff",
            borderRadius: "6px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 10,
          }}
        >
          {["ABOUT", "SCHEDULE", "PRIZES", "TRACKS","GALLERY","FAQS"].map((item) => (
            <span
              key={item}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "Julee, cursive",
                fontSize: "16px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )}
</nav>


        {/*HERO */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          {/* HEADING */}
          <h1
            className="heading"
            style={{
              fontSize: "clamp(48px, 10vw, 100px)",
            }}
          >
            VIHAAN 9.0
          </h1>

        
          <p
            className="paragraph"
            style={{
              fontSize: "clamp(18px, 3vw, 26px)",
              marginBottom: "24px",
            }}
          >
            COMING SOON…
          </p>

          {/* REGISTER INPUT */}
          <div className="reg"
          >
            REGISTER AT
           
           
          </div>

          <Button text="Devfolio" />
        </div>
      </div>
    </div>

    <div>

    </div>
    </>
  );
}
