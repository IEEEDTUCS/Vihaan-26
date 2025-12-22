import { useState } from 'react'
import Landing from './components/Landing.jsx'
import Intro from './components/Loader.jsx'
import Tracks from './components/Tracks.jsx'
import './App.css'

function App() {
 
   const [showIntro, setshowIntro] = useState(true);

  return (
    <>
     {showIntro && (
    <div id='loader'>
      <Intro onComplete={() => {
        console.log('Intro complete!');
        setshowIntro(false)}} />
    </div>
     )}
     {!showIntro && (
    <div id='landing'>
      <Landing></Landing>
    </div>
    
     )}
     <div id='tracks'>
      <Tracks></Tracks>
    </div>
    </>
  )
}

export default App
