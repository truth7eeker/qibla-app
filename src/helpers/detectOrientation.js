export const detectOrientation = (heading, gamma) => {
  const isTurnedLeft =
    gamma < -20 && gamma > -90  ? true : false;

  const isTurnedRight =
    gamma > 20 && gamma < 90 ? true : false;

  const isPortrait = isTurnedLeft|| isTurnedRight;

  return [isTurnedLeft, isTurnedRight, isPortrait];
};
