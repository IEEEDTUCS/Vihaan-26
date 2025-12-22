import React from 'react';
import './Tracks.css';

const Tracks = () => {
  return (

     <>
     <h1 className="heading mt-20"
            style={{
              fontSize: "clamp(48px, 10vw, 100px)",
            }}>
      Tracks:
    </h1>
    <div className="banner">
        <div className="slider" style={{ "--quantity": 7 }}>
          {/* React Loop to generate the 10 items automatically */}
          {[...Array(7)].map((_, index) => (
            <div
              className="item"
              style={{ "--position": index + 1 }}
              key={index}
            >
              <img src={`/Track/card.svg`} alt={`Dragon ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="content">
          <div className="model"></div>
        </div>
      </div></>
  );
};

export default Tracks;