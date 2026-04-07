import { motion } from 'framer-motion';
import TeamCarousel from "./TeamCarousel";
import CouncilInfo from './CouncilInfo.json'    //helper for council details
import LeadInfo from './LeadInfo.json'    //helper for event leads details
import DeptLeadInfo from './DeptLeadInfo.json'    //helper for dept leads details

export default function Team() {
  return (
    <>
        <section className="relative h-full" style={{ paddingTop: '1.5rem', paddingBottom: '2rem', overflowX: 'hidden' }}>
          <div style={{ position: 'absolute', top: '0', left: '0', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '75vw 75vh', backgroundPosition: '-10vw -25vh', zIndex: '-10' }}></div>
          <div style={{ position: 'absolute', top: '0', right: '0', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: '0 -25vh', zIndex: '-10' }}></div>
          <div style={{ position: 'absolute', bottom: '0', left: '0', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', zIndex: '-10' }}></div>
          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', zIndex: '-10' }}></div>
          <div style={{ position: 'absolute', top: '25%', left: '0', transform: 'translateY(-50%)', width: '50vw', height: '75vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: 'left center', zIndex: '-10', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '25%', right: '0', transform: 'translateY(-50%)', width: '50vw', height: '75vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: 'right center', zIndex: '-10', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', width: '50vw', height: '75vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: 'left center', zIndex: '-10', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', width: '50vw', height: '75vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: 'right center', zIndex: '-10', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '75%', left: '0', transform: 'translateY(-50%)', width: '50vw', height: '75vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: 'left center', zIndex: '-10', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '75%', right: '0', transform: 'translateY(-50%)', width: '50vw', height: '75vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: 'right center', zIndex: '-10', pointerEvents: 'none' }}></div>
          
          <motion.div 
            className="relative h-fit w-full flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img src="/Team/lightning.svg" alt="lightning"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1 pointer-events-none"
              style={{
                fontSize: "clamp(48px, 10vw, 100px)",
                width: "clamp(200px, 35vw, 650px)",
                height: "clamp(200px, 35vw, 650px)",
                objectFit: "contain",
              }}
            />

            <h1 className="heading-invert flex relative z-1"
              style={{
                fontSize: "clamp(52px, 11vw, 120px)",
                width: "fit-content",
              }}
            >TEAM</h1>
          </motion.div>

          <div className="overflow-hidden">
              <motion.h1 
                className="relative z-5 mb-5 heading text-white w-full mt-20 mx-auto text-center" 
                style={{ fontSize: "clamp(48px, 10vw, 100px)" }}
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                MEET THE COUNCIL
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <TeamCarousel TeamInfo={CouncilInfo} />
              </motion.div>

              <motion.h1 
                className="relative z-5 mb-5 heading text-white w-full mt-20 mx-auto text-center" 
                style={{ fontSize: "clamp(48px, 10vw, 100px)" }}
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                EVENT LEADS
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <TeamCarousel TeamInfo={LeadInfo} />
              </motion.div>

              <motion.h1 
                className="relative z-5 mb-5 heading text-white w-full mt-20 mx-auto text-center" 
                style={{ fontSize: "clamp(48px, 10vw, 100px)" }}
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                DEPARTMENT LEADS
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <TeamCarousel TeamInfo={DeptLeadInfo} />
              </motion.div>
          </div>

        </section>

        <hr className="glow-hr border-0 h-2 w-full bg-linear-to-r from-transparent via-[#ffc800] to-transparent"/>
    </>
  );
}  