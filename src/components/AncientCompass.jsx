// src/components/AncientCompass.jsx
import React from 'react';
import './AncientCompass.css';

const AncientCompass = () => {
  return (
    <div className="ancient-compass-container">
      <div className="compass-outer-ring">
        <div className="compass-inner-ring">
          <div className="compass-markings"></div>
          {/* Cardinal Directions */}
          <div className="cardinal-point north">N</div>
          <div className="cardinal-point east">E</div>
          <div className="cardinal-point south">S</div>
          <div className="cardinal-point west">W</div>
          {/* Ordinal Directions */}
          <div className="ordinal-point ne">NE</div>
          <div className="ordinal-point se">SE</div>
          <div className="ordinal-point sw">SW</div>
          <div className="ordinal-point nw">NW</div>
          {/* Compass Star / Needles */}
          <div className="compass-star">
            <div className="needle needle-n"></div>
            <div className="needle needle-s"></div>
            <div className="needle needle-e"></div>
            <div className="needle needle-w"></div>
            <div className="needle needle-ne"></div>
            <div className="needle needle-nw"></div>
            <div className="needle needle-se"></div>
            <div className="needle needle-sw"></div>
          </div>
          <div className="compass-center"></div>
        </div>
      </div>
    </div>
  );
};

export default AncientCompass;
