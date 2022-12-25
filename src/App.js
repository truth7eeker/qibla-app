import { useState, useEffect } from "react";
import "./App.css";
import compassPic from "./assets/compass.png";
import kaaba from "./assets/kaaba.png";
import arrow from "./assets/arrow.png";

function App() {
  const [heading, setHeading] = useState(0);
  const [pointDegree, setPointDegree] = useState(0);
  // const [isKaaba, setIsKaaba] = useState(false);

  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

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

    // ±5  degree
    // if (
    //   pointDegree > 0 &&
    //   Math.abs(pointDegree) - 5 <= heading &&
    //   heading <= Math.abs(pointDegree) + 5
    // ) {
    //   setIsKaaba(true);
    // } else {
    //   setIsKaaba(false);
    // }
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
  }, [isIOS]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(locationHandler);
  
  },);

  

  return (
    <div className="app">
      <div className="compass">
        <img
          src={compassPic}
          alt="compass"
          className="compass-pic"
          style={{ transform: `rotate(${-heading}deg)` }}
        />
        <div
          className="kaaba-wrapper"
          style={{ transform: `rotate(${-heading + pointDegree}deg)`,
          visibility: heading && pointDegree ? 'visible' : 'hidden'
        }}
        >
          <img
            src={kaaba}
            alt="kaaba"
            className="kaaba"
          />
        </div>
        <img src={arrow} className="compass-arrow" alt="arrow" />
      </div>
    </div>
  );
}

export default App;
