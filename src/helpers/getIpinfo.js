export const getIpinfo = async (setData) => {
  const res = await fetch("https://geolocation-db.com/json/");
  const coords = await res.json();

  return setData(coords);
};
