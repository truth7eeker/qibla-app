import { checkSession } from "./handleSession";
import { handleVibration } from "./handleVibration";
import { reachQibla } from "./yandexMetric";

export function handleMessage(heading, beta, gamma, pointDegree, isBotUser) {
  const qibla = pointDegree < 0 ? pointDegree + 360 : pointDegree;
  let isQibla = false;
  let messageText;
  if (!isBotUser && !pointDegree) {
    messageText = "Allow GPS access and tap Start again/ Разрешите доступ к GPS и нажмите Start"
  }
  else if (15 < beta || beta < -15 || 15 < gamma || gamma < -15) {
    messageText =
      "Position your device parallel to the ground/ Держите устройство параллельно земле";
    isQibla = false;
  } else if (
    (pointDegree && heading > qibla - 2 && heading < qibla + 2) ||
    (pointDegree && qibla < 2 && heading > 360 - qibla) ||
    (pointDegree && qibla > 358 && heading < 2 - (360 - qibla))
  ) {
    messageText = "You've found Qibla/ Вы нашли Киблу";
    isQibla = true;
    handleVibration(10);
    // yandex metrica - detect reaching the goal
    !checkSession("reachGoal", true)
      ? reachQibla("reachGoal", "success")
      : null;
  } else if (
    (pointDegree && qibla + 45 > heading && qibla - 45 < heading) ||
    (pointDegree && qibla < 45 && heading > 360 - qibla) ||
    (pointDegree && qibla > 310 && heading < 45 - (360 - qibla))
  ) {
    messageText = "Almost there/ Почти у цели";
    isQibla = false;
  }
  return [messageText, isQibla];
}
