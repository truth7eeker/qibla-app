import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Compass from "../compass/Compass";
import { isIOS, deviceDetector } from "../../helpers/detectDevice";
import { handleMessage } from "../../helpers/outputMessage";
import Portrait from "../portrait-mode/Portrait";
import { detectOrientation } from "../../helpers/detectOrientation";
import { handleRedirect } from "../../helpers/handleRedirect";
import { setQibla } from "../../helpers/calcDeclination";
import { startMetric } from "../../helpers/yandexMetric";
import { checkSession } from "../../helpers/handleSession";
import { getIpinfo } from "../../helpers/getIpinfo";
import { askLocationPermission } from "../../helpers/askLocationPermission";

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

  const [geoData, setGeoData] = useState(null);

  const handler = (e) => {
    setHeading(
      e.webkitCompassHeading ? e.webkitCompassHeading : Math.abs(e.alpha - 360)
    );
    setBeta(e.beta);
    setGamma(e.gamma);
  };

  const locationHandler = (position) => {
    const { latitude, longitude } = position.coords;
    setQibla(latitude, longitude, setPointDegree)
  };

  const ipHandler = () => {
    const { latitude, longitude } = geoData;
    setQibla(latitude, longitude, setPointDegree)
  };

  const startCompass = () => {
    // yandex metrica - detect start-btn click
    !checkSession("start", true) ? startMetric("reachGoal", "start") : null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationHandler, ipHandler);
    } else {
      ipHandler();
    }

    if (isIOS && !askLocationPermission()) {
      ipHandler();
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
    // redirect desktop to another webpage
    if (!deviceDetector.isMobile) {
      handleRedirect();
    }
    getIpinfo(setGeoData);
  }, []);

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
