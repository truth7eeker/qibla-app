import { useEffect, useState } from "react";
import "./App.css";
import compassPic from "./assets/compass.png";
import kaaba from "./assets/kaaba.png";
import arrow from "./assets/arrow.png";

function App() {
  const [heading, setHeading] = useState(0);
  const [pointDegree, setPointDegree] = useState(null);
  const [start, setStart] = useState(false);

  const deviceDetector = (function () {
    var b = navigator.userAgent.toLowerCase(),
      a = function (a) {
        void 0 !== a && (b = a.toLowerCase());
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
          b
        )
          ? "tablet"
          : /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(
              b
            )
          ? "phone"
          : "desktop";
      };
    return {
      device: a(),
      detect: a,
      isMobile: "desktop" !== a() ? !0 : !1,
      userAgent: b,
    };
  })();

  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

  const handler = (e) => {
    setHeading(
      e.webkitCompassHeading ? e.webkitCompassHeading : Math.abs(e.alpha - 360)
    );

    if (e.gamma < -70 && e.gamma > -90) {
      console.log("left");
    }
    if (e.gamma > 70 && e.gamma < 90) {
      console.log("right");
    }
  };

  const locationHandler = (position) => {
    const { latitude, longitude } = position.coords;
    setPointDegree(calcDegreeToPoint(latitude, longitude));

    if (pointDegree < 0) {
      setPointDegree((prev) => prev + 360);
    }
  };

  const errorLocationHandler = (error) => {
    if (error.code === 1 || error.code === 2 || error.code === 3) {
      window.location.replace("https://www.elahmad.com/maps/qiblamobile.php?latitude={lat}&longitude={long}&zoom=17&t=m");
    }
  }

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

  const startCompass = () => {
    navigator.geolocation.getCurrentPosition(locationHandler, errorLocationHandler);
    setStart(true);
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("Allow geolocation access/Разрешите доступ к местоположению");
          }
        })
        .catch(() => alert("Not supported"));
    } else {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  };

  useEffect(() => {
    if (!deviceDetector.isMobile) {
      window.location.replace("https://www.elahmad.com/maps/qiblamobile.php?latitude={lat}&longitude={long}&zoom=17&t=m");
    }
  });

  return (
    <div className="app">
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
              visibility: pointDegree ? "visible" : "hidden",
            }}
          >
            <img src={kaaba} alt="kaaba" className="kaaba" />
          </div>
          <img src={arrow} className="compass-arrow" alt="arrow" />
        </div>
        <p
          style={{ opacity: start && !pointDegree ? "1" : "0" }}
          className="compass-alert"
        >
          Allow geolocation access and reload the page/ Разрешите доступ к
          местоположению и обновите страницу
        </p>
      </div>
    </div>
  );
}

export default App;
