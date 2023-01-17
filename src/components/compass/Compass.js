import React from "react";
import "./Compass.css";
import compassPic from "../../assets/compass.png";
import kaaba from "../../assets/kaaba.png";
import arrow from "../../assets/arrow.png";
import { getParams } from "../../helpers/handleRedirect";

function Compass({
  heading,
  pointDegree,
  isQibla,
  startCompass,
  message,
  start,
  isBotUser
}) 
{
  const { latitude, longitude } = getParams(window.location.search);
  return (
    <div className="compass">
      <button className="compass-btn" onClick={startCompass}>
        Start
      </button>
      <div className="pic-wrapper">
        <img
          src={compassPic}
          alt="compass"
          className="compass-pic"
          style={{ transform: `rotate(${-heading}deg)` }}
        />
        <div
          className="kaaba-wrapper"
          style={{
            transform: `rotate(${-heading + pointDegree}deg)`,
            visibility: pointDegree && start ? "visible" : "hidden",
          }}
        >
          <img src={kaaba} alt="kaaba" className="kaaba" />
        </div>
        <img src={arrow} className="compass-arrow" alt="arrow" />
      </div>
      <p className="compass-alert" style={{ color: isQibla ? "green" : "red" }}>
        {/* {start && message} */}
        {isBotUser ? 'bot' : 'web'}
        lat: ${latitude}
        long: ${longitude}
      </p>
    </div>
  );
}

export default Compass;
