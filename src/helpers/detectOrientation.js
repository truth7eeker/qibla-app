export const detectOrientation = (beta, gamma) => {
  const isTurnedLeft =
    gamma < -20 && gamma > -90 && beta < 60  ? true : false;

  const isTurnedRight =
    gamma > 20 && gamma < 90 && beta < 60 ? true : false;

  const isPortrait = isTurnedLeft || isTurnedRight;

  return [isTurnedLeft, isTurnedRight, isPortrait];
};
