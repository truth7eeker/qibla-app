import { useState } from 'react';
import './App.css';
import compassPic from './assets/compass.png';
import kaaba from './assets/kaaba.png';
import arrow from './assets/arrow.png';

function App() {
   const [heading, setHeading] = useState(0);
   const [pointDegree, setPointDegree] = useState(null);
   const [start, setStart] = useState(false);

   const isIOS =
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

   const handler = (e) => {
      setHeading(e.webkitCompassHeading ? e.webkitCompassHeading : Math.abs(e.alpha - 360));
   };

   const locationHandler = (position) => {
      const { latitude, longitude } = position.coords;
      setPointDegree(calcDegreeToPoint(latitude, longitude));

      if (pointDegree < 0) {
         setPointDegree((prev) => prev + 360);
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
            Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda),
         );
      return Math.round(psi);
   };

   const startCompass = () => {
      if (isIOS) {
         DeviceOrientationEvent.requestPermission()
            .then((response) => {
               if (response === 'granted') {
                  window.addEventListener('deviceorientation', handler, true);
               } else {
                  alert('Allow geolocation access/Разрешите доступ к местоположению');
               }
            })
            .catch(() => alert('Not supported'));
      } else {
         window.addEventListener('deviceorientationabsolute', handler, true);
      }
      navigator.geolocation.getCurrentPosition(locationHandler);
      setStart(true);
   };

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
                     visibility: pointDegree ? 'visible' : 'hidden',
                  }}>
                  <img src={kaaba} alt="kaaba" className="kaaba" />
               </div>
               <img src={arrow} className="compass-arrow" alt="arrow" />
            </div>
            <p style={{ opacity: start && !pointDegree ? '1' : '0' }} className="compass-alert">
               Allow geolocation access and tap "Start" again/ Разрешите доступ к местоположению и нажмите "Start" еще раз
            </p>
         </div>
      </div>
   );
}

export default App;
