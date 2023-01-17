import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Compass from "../compass/Compass";
import { isIOS, deviceDetector } from "../../helpers/detectDevice";
import { handleMessage } from "../../helpers/outputMessage";
import Portrait from "../portrait-mode/Portrait";
import { detectOrientation } from "../../helpers/detectOrientation";
import { getParams, handleRedirect } from "../../helpers/handleRedirect";
import { setQibla } from "../../helpers/calcDeclination";
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
    () => handleMessage(heading, beta, gamma, pointDegree, isBotUser),
    [heading, beta, gamma, pointDegree, isBotUser]
  );
  // detect orientation
  const [isTurnedLeft, isTurnedRight, isPortrait] = detectOrientation(
    heading,
    gamma
  );
  // check if the page is open from the telegram bot or website
  const [isBotUser, setIsBotUser] = useState(false);

  const handler = (e) => {
    setHeading(
      e.webkitCompassHeading ? e.webkitCompassHeading : Math.abs(e.alpha - 360)
    );
    setBeta(e.beta);
    setGamma(e.gamma);
  };

  const locationHandler = (position) => {
    const isGPSAndBot = isBotUser && position.coords;
    const { latitude, longitude } =
      isGPSAndBot || !isBotUser
        ? position.coords
        : getParams(window.location.search);
    setQibla(latitude, longitude, setPointDegree);
  };

  const startCompass = () => {
    // yandex metrica - detect start-btn click
    !checkSession("start", true) ? startMetric("reachGoal", "start") : null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationHandler);
    } else {
      alert("Geolocation isn't supported");
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
    // if (!deviceDetector.isMobile) {
    //   handleRedirect();
    // }
    if (window.location.search) {
      setIsBotUser(true);
    } else {
      setIsBotUser(false);
    }
  }, []);

  console.log(window.location.serach)

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
