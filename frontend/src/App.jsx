import { useState } from 'react'
import Landing from './components/Landing.jsx'
import Intro from './components/Loader.jsx'
import './App.css'

function App() {
 
   const [showIntro, setshowIntro] = useState(true);

  return (
    <>
    {/* <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </div> */}
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
    </>
  )
}

export default App
