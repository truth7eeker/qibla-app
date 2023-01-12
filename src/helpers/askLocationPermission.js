export const askLocationPermission = () => {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      return;
    } else {
      alert('Allow geolocation access and tap START/ Разрешите доступ к местоположению и нажмите START')
    }
  });
};
