## Qibla Compass

### About
Qibla Compass app is a website for mobile users that works as a compass and shows the Qibla direction. 
This project is further integrated into Telegram WebApps, so if you're wondering about a simpler version, you might be interested [in this repo](https://github.com/truth7eeker/qibla-app-web).

The app relies on `DeviceOrientationEvent.alpha` value to output the real compass functionality. The qibla itself is calculated based on a formula, which uses 
a user's latitude and longitude values coming from `navigator.geolocation.getCurrentPosition()` method. Since the compass is pointing to the Magnetic North, the formula is
then modified by the magnetic declination. The value for the declination is provided by [this awesome library](https://github.com/naturalatlas/geomagnetism).

### Demo
<img src="http://dl3.joxi.net/drive/2023/01/23/0050/3554/3292642/42/25665dad35.jpg" width="300" />

[Check live version](https://curious-sfogliatella-3f6a36.netlify.app/)

### How to run locally
```sh
npm install
npm run serve
