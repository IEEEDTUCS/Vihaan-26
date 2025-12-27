import { useState } from 'react'
import Landing from './components/Landing.jsx'
import Intro from './components/Loader.jsx'
import Tracks from './components/Tracks.jsx'
import Landing2 from './components/Landing2.jsx'
import Faqs from './components/Faqs/faqs.jsx'
import Gallery from './components/Gallery/Gallery.jsx'
import Footer from './components/Footer/Footer.jsx'
import './App.css'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && (
        <div id="loader">
          <Intro
            onComplete={() => {
              console.log('Intro complete!')
              setShowIntro(false)
            }}
          />
        </div>
      )}

      {!showIntro && (
        <div id="landing">
          <Landing />
        </div>
      )}
      
      <div id="about">
        <Landing2 />
      </div>

      <div id="tracks">
        <Tracks />
      </div>
      
      <div id="Gallery">
        <Gallery></Gallery>
      </div>

      <div id='faqs'>
        <Faqs />
      </div>

      <div id="footer">
        <Footer/>
      </div>
    </>
  )
}

export default App

