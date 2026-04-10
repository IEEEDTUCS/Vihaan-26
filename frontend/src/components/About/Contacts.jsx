import React from 'react'
import './Contacts.css'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Contacts() {
  return (
    <div className=''>
        <h2 className='Top font-serif'>CONTACT US</h2>
        <div className="box  text-lg">
          <div className='Contacts'> 
            <FaMapMarkerAlt />
            <p>Delhi Technological University</p>
          </div>
          <div className='Contacts'> 
            <FaPhoneAlt />
            <p>Jahan Sharma (+91 8273754287)</p>
          </div>
          <div className='Contacts'> 
            <FaPhoneAlt />
            <p>Rudit Madaan (+91 96257 01606)</p>
          </div>
          <div className='Contacts'> 
            <FaEnvelope />
            <p>ieeedtu.contact@gmail.com</p>
          </div>
        </div>
    </div>
  )
}

export default Contacts
