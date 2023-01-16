const geomagnetism = require("geomagnetism");
import { calcDegreeToPoint } from "./calcDegreeToPoint";

const calcDeclination = (latitude, longitude) => {
  const info = geomagnetism?.model()?.point([latitude, longitude]);
  return info ? Math.round(info.decl) : 0;
};

export const setQibla = (latitude, longitude, setPoint) => {
  const declination = calcDeclination(latitude, longitude);
  return setPoint((calcDegreeToPoint(latitude, longitude) - declination));
};
