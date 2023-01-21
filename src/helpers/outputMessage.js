import { checkSession } from "./handleSession";
import { reachQibla } from "./yandexMetric";

export function handleMessage(
  heading,
  beta,
  gamma,
  pointDegree,
  isBotUser,
  teleErr
) {
  const qibla = pointDegree < 0 ? pointDegree + 360 : pointDegree;
  let isQibla = false;
  let messageText = { eng: "", rus: "" };
  if (isBotUser && !pointDegree && !teleErr) {
    messageText = {
      eng: "Getting your coords...",
      rus: "Получаем координаты...",
    };
  } else if (isBotUser && teleErr) {
    messageText = { eng: "", rus: "" };
  } else if (!isBotUser && !pointDegree) {
    messageText = {
      eng: "Allow GPS access and tap Start",
      rus: "Разрешите доступ к GPS и нажмите Start",
    }
  } else if (15 < beta || beta < -15 || 15 < gamma || gamma < -15) {
    messageText = {
      eng: "Position your device parallel to the ground",
      rus: "Держите устройство параллельно земле",
    };
    isQibla = false;
  } else if (
    (pointDegree && heading > qibla - 2 && heading < qibla + 2) ||
    (pointDegree && qibla < 2 && heading > 360 - qibla) ||
    (pointDegree && qibla > 358 && heading < 2 - (360 - qibla))
  ) {
    messageText = {
      eng: "You've found Qibla",
      rus: "Вы нашли Киблу",
    };
    isQibla = true;
    // yandex metrica - detect reaching the goal
    !checkSession("reachGoal", true)
      ? reachQibla("reachGoal", "success")
      : null;
  } else if (
    (pointDegree && qibla + 45 > heading && qibla - 45 < heading) ||
    (pointDegree && qibla < 45 && heading > 360 - qibla) ||
    (pointDegree && qibla > 310 && heading < 45 - (360 - qibla))
  ) {
    messageText = {
      eng: "Almost there",
      rus: "Почти у цели",
    };
    isQibla = false;
  }
  return [messageText, isQibla];
}
