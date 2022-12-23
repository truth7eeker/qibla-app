import { useState, useEffect } from "react";
import "./App.css";
import compassPic from "./assets/compass.png";
import kaaba from "./assets/kaaba.png";

function App() {
  const [heading, setHeading] = useState(0);
  const [pointDegree, setPointDegree] = useState(0);
  const [isKaaba, setIsKaaba] = useState(false);

  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

  const startCompass = () => {
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("Разрешите доступ к местоположению");
          }
        })
        .catch(() => alert("He поддерживается браузером"));
    } else {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  };

  const handler = (e) => {
    setHeading(
      e.webkitCompassHeading ? e.webkitCompassHeading : Math.abs(e.alpha - 360)
    );
  };

  const locationHandler = (position) => {
    const { latitude, longitude } = position.coords;
    setPointDegree(calcDegreeToPoint(latitude, longitude));

    if (pointDegree < 0) {
      setPointDegree((prev) => prev + 360);
    }

    // ±10  degree
    if (
      pointDegree > 0 &&
      Math.abs(pointDegree) - 10 <= heading &&
      heading <= Math.abs(pointDegree) + 10
    ) {
      setIsKaaba(true);
    } else {
      setIsKaaba(false);
    }
  };

  const calcDegreeToPoint = (latitude, longitude) => {
    // Qibla geolocation
    const point = {
      lat: 21.422487,
      lng: 39.826206,
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return Math.round(psi);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(locationHandler);
  });

  return (
    <div className="app">
      <div className="compass">
        <button className="compass-btn" onClick={startCompass}>
          Найти Киблу
        </button>
        <div className="compass-arrow"></div>
        <div className="compass-pics">
          <img
            src={compassPic}
            alt="compass"
            className="compass-pic"
            style={{ transform: `rotate(${-heading}deg)` }}
          />
          <img
            src={kaaba}
            alt="kaaba"
            className="kaaba"
            style={{ visibility: isKaaba ? "visible" : "hidden" }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
