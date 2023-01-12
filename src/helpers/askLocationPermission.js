export const askLocationPermission = () => {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      return;
    } else {
      alert('Allow geolocation access/ Разрешите доступ к местоположению')
    }
  });
};
