import React from "react";
import "./Portrait.css";
import portraitOrientation from "../../assets/rotate-phone.svg";

function Portrait({ isTurnedLeft, isTurnedRight }) {
  return (
    <div
      className="portrait-mode"
      style={{
        transform: isTurnedLeft
          ? "rotate(90deg)"
          : isTurnedRight
          ? "rotate(-90deg)"
          : null,
      }}
    >
      <img src={portraitOrientation} alt="rotate-phone" />
      <p>Rotate your device / Поверните устройство</p>
    </div>
  );
}

export default Portrait;
