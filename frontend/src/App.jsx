import { useState } from 'react'
import Landing from './components/Landing.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </div> */}
    <div id='loader'>
      Loading screen
    </div>
    <div id='landing'>
      <Landing></Landing>
    </div>
    </>
  )
}

export default App
