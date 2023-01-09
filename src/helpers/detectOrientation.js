export const detectOrientation = (heading, gamma) => {
  const isTurnedLeft =
    gamma < -30 && gamma > -90 && heading < 200 && heading > 140 ? true : false;

  const isTurnedRight =
    gamma > 30 && gamma < 90 && heading > 0 && heading < 50 ? true : false;

  const isPortrait = isTurnedLeft|| isTurnedRight;

  return [isTurnedLeft, isTurnedRight, isPortrait];
};
