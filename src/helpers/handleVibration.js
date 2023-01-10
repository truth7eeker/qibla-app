export const handleVibration = (time) => {
    if (!window.navigator || !window.navigator.vibrate) {
      return;
    }
    window.navigator.vibrate(time);
  }