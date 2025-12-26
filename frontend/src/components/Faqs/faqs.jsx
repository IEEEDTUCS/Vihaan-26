import Accordion from './Accordion.jsx';
import FAQHelper from './FAQHelper';

export default function Faqs() {
  return (
    <>
      <section className="relative h-[120vh] w-full overflow-hidden" style={{ backgroundColor: 'black', paddingTop: '1.5rem', paddingBottom: '8rem', }}>
        <div style={{ position: 'absolute', top: '-10vh', left: '-20vw', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '75vw 75vh', backgroundPosition: '-10vw -25vh' }}></div>
        <div style={{ position: 'absolute', top: '-10vh', right: '-20vw', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', backgroundPosition: '0 -25vh' }}></div>
        <div style={{ position: 'absolute', bottom: '-10vh', left: '-20vw', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', }}></div>
        <div style={{ position: 'absolute', bottom: '-10vh', right: '-20vw', width: '50vw', height: '50vh', backgroundImage: 'url(/Faqs/SpotPattern.svg)', backgroundRepeat: 'no-repeat', backgroundSize: '50vw 75vh', }}></div>
        <div style={{zIndex: '0'}}>
          <div className="flex justify-center items-center">
            <h1
              className="heading mt-16 text-center break-words lg:whitespace-nowrap"
              style={{
              position: 'relative',
              fontSize: "clamp(48px, 8vw, 112px)",
              backgroundImage: "linear-gradient(#f9f9f9, #f9f9f9)",
              WebkitTextStroke: '2px black',
              zIndex: '100000',
              lineHeight: 1.1,
              maxWidth: '100vw',
              overflow: 'visible',
              paddingInline: '1rem',
              transform: 'translateZ(0)',}}>
               FREQUENTLY&nbsp;
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
                  backgroundSize: '100% 100%',
                  zIndex: '-1',
                  pointerEvents: 'none',
                }}
              ></span>

                ASKED
              </span>

              &nbsp;QUESTIONS?!
            </h1>
          </div>
  
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginTop: '2rem',
              height: '70vh',    //using a fixed scrollable area for all accordions for compact look
              overflowY: 'auto',
              paddingTop: '3rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}>
            <style>{`
              .faq-accordions::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="faq-accordions" style={{display: 'flex', flexDirection: 'column'}}>
              { FAQHelper && FAQHelper.faqs.map((faq, index) => (
                <Accordion key={index} QAPair={faq}/> ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
