import "./About.css"
import Header from './Header'
import Description from './Description'
import Alumni from './Alumni'
import Contacts from './Contacts'
import Socials from './Socials'

export default function About({ isVisible, setIsVisible }) {
  return (
    <>
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999"
          onClick={() => setIsVisible(false)}
        />
      )}
      <div className={`About fixed overflow-y-auto overflow-x-hidden top-0 right-0 z-10000 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Header isVisible={isVisible} setIsVisible={setIsVisible} />
        <Description />
        <Alumni />
        <Contacts />
        <Socials />
      </div>
    </>
  )
}
