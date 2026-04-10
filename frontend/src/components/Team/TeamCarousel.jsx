import React, { useState, useEffect } from 'react'
import CarouselCard from './CarouselCard'
import LayeredButton from '../../utils/LayeredButton'
import { Triangle } from 'lucide-react'

const TeamCarousel = ({ TeamInfo }) => {
  const [active, setActive] = useState(0)
  const [screenSize, setScreenSize] = useState('desktop')  // add this

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setScreenSize('mobile')
      else if (window.innerWidth < 1024) setScreenSize('tablet')
      else setScreenSize('desktop')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const count = TeamInfo.items.length

  const prev = () => { setActive((prev) => (prev === 0 ? count - 1 : prev - 1)) }
  const next = () => { setActive((prev) => (prev === count - 1 ? 0 : prev + 1)) }

  return (
    <div className="relative overflow-hidden" style={{ width: '100%', maxWidth: '100vw' }}>
      <div className="flex justify-center items-center h-[59vh]">
        <div className="relative h-full flex justify-center items-center overflow-hidden" style={{ width: '100%', maxWidth: '100vw' }}>

          {TeamInfo && TeamInfo.items.map((item, i) => {

            let offset = i - active

            //wrap around for looping
            if (offset < -count / 2) offset += count
            if (offset > count / 2) offset -= count

            //Optimization: Don't render cards that are too far away. only 3 for mobile devices
            if (Math.abs(offset) > (screenSize === 'mobile' ? 1 : 3)) return null

            const shouldBeFlipped = Math.abs(offset) > 1;

            return (
              <CarouselCard key={i} index={i} personInfo={item} offset={offset} isFlipped={shouldBeFlipped}/>
            )
          })}

        </div>
      </div>

      {/* controls */}
      <div className="flex w-full text-white justify-center mt-3 mb-12 gap-10">
        <LayeredButton
          onClick={prev}
          content={<Triangle size={22} fill="#6F6FFE" stroke="black" strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} />}
        />
        <LayeredButton
          onClick={next}
          content={<Triangle size={22} fill="#6F6FFE" stroke="black" strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />}
        />
      </div>
    </div>
  )
}

export default TeamCarousel