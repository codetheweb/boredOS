const DarkSky = require('dark-sky');

const darksky = new DarkSky(process.env.DARK_SKY);

function getCurrentWeather() {
  const houghton = {lat: 47.1158, lng: -88.5403};
  return darksky.coordinates(houghton).units('us').get();
}

module.exports = {getCurrentWeather};
