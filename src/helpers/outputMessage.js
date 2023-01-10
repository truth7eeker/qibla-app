import { handleVibration } from "./handleVibration";

export function handleMessage(heading, beta, gamma, pointDegree) {
  const qibla = pointDegree < 0 ? pointDegree + 360 : pointDegree;
  let isQibla = false;
  let messageText;
  if (heading && !pointDegree) {
    messageText = "Allow geoloction access / Разрешите доступ к местоположению";
  } else if (15 < beta || beta < -15 || 15 < gamma || gamma < -15) {
    messageText =
      "Position your device parallel to the ground/ Держите устройство параллельно земле";
    isQibla = false;
  } else if (
    (pointDegree && heading > qibla - 2 && heading < qibla + 2) ||
    (pointDegree && qibla < 2 && heading > 360 - qibla) ||
    (pointDegree && qibla > 358 && heading < 2 - (360 - qibla))
  ) {
    messageText = "You've found Qibla/Вы нашли Киблу";
    isQibla = true;
    handleVibration(10);
  } else if (
    (pointDegree && qibla + 45 > heading && qibla - 45 < heading) ||
    (pointDegree && qibla < 45 && heading > 360 - qibla) ||
    (pointDegree && qibla > 310 && heading < 45 - (360 - qibla))
  ) {
    messageText = "You're almost there/ Почти у цели";
    isQibla = false;
  }
  return [messageText, isQibla];
}
