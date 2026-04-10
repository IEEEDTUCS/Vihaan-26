import React from 'react'
import "./Header.css"

function Header({ isVisible, setIsVisible }) {
  return (
    <div className="Header heading ">
        <div className=''>ABOUT US</div>
        <svg onClick={() => setIsVisible(!isVisible)} width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 16.8079C0 26.0754 7.40109 33.6143 16.4992 33.6143C25.5974 33.6143 33 26.0754 33 16.8079C33 7.54039 25.5974 0 16.4992 0C7.40109 0 0 7.54039 0 16.8079ZM30.7413 16.8079C30.7413 24.8054 24.3521 31.3135 16.4992 31.3135C8.64791 31.3135 2.25873 24.8054 2.25873 16.8079C2.25873 8.80888 8.64791 2.30077 16.5008 2.30077C24.3521 2.30077 30.7413 8.80888 30.7413 16.8079Z" fill="#9CA802"/>
          <path d="M8.86475 24.2864L24.136 8.65576" stroke="#9CA802" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M24.136 24.2864L8.86475 8.65576" stroke="#9CA802" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
  )
}

export default Header
