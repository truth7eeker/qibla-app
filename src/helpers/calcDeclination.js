const geomagnetism = require('geomagnetism');

export const calcDeclination = (latitude, longitude) => {
    const info = geomagnetism?.model()?.point([latitude, longitude]);
    return info ? Math.round(info.decl) : 0
}
