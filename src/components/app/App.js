import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Compass from "../compass/Compass";
import { isIOS, deviceDetector } from "../../helpers/detectDevice";
import { calcDegreeToPoint } from "../../helpers/calcDegreeToPoint";
import { handleMessage } from "../../helpers/outputMessage";
import Portrait from "../portrait-mode/Portrait";
import { detectOrientation } from "../../helpers/detectOrientation";
import { handleRedirect } from "../../helpers/handleRedirect";
import { calcDeclination } from "../../helpers/calcDeclination";
import { askLocationPermission } from "../../helpers/askLocationPermission";
import { startMetric } from "../../helpers/yandexMetric";
import { checkSession } from "../../helpers/handleSession";

function App() {
  // user's facing direction
  const [heading, setHeading] = useState(null);
  // kaaba position on the compass
  const [pointDegree, setPointDegree] = useState(null);
  // phone tilt back and forth/ left and right (this is for accuracy issues on Android)
  const [beta, setBeta] = useState(null);
  const [gamma, setGamma] = useState(null);
  // detect when the Start btn is clicked
  const [start, setStart] = useState(false);
  // output congrats message when Qibla is +/- 5 deg from current position
  const [messageText, isQibla] = useMemo(
    () => handleMessage(heading, beta, gamma, pointDegree),
    [heading, beta, gamma, pointDegree]
  );
  // detect orientation
  const [isTurnedLeft, isTurnedRight, isPortrait] = detectOrientation(
    heading,
    gamma
  );

  const handler = (e) => {
    setHeading(
      e.webkitCompassHeading ? e.webkitCompassHeading : Math.abs(e.alpha - 360)
    );
    setBeta(e.beta);
    setGamma(e.gamma);
  };

  const locationHandler = (position) => {
    const { latitude, longitude } = position.coords;
    const declination = calcDeclination(latitude, longitude);
    setPointDegree(calcDegreeToPoint(latitude, longitude) - declination);
  };

  const startCompass = () => {
    // yandex metrica - detect start-btn click
    !checkSession("start", true) ? startMetric("reachGoal", "start") : null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationHandler);
    } else {
      alert("Geolocations isn't supported by your browser");
    }
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
    setStart(true);
  };

  useEffect(() => {
    askLocationPermission();
    // redirect desktop to another webpage
    if (!deviceDetector.isMobile) {
      handleRedirect();
    }
  });

  return (
    <div className="app">
      {!isPortrait ? (
        <Compass
          heading={heading}
          pointDegree={pointDegree}
          isQibla={isQibla}
          startCompass={startCompass}
          message={messageText}
          start={start}
        />
      ) : (
        <Portrait isTurnedLeft={isTurnedLeft} isTurnedRight={isTurnedRight} />
      )}
    </div>
  );
}

export default App;
