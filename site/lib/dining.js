const MTUDining = require('mtu-dining');
const moment = require('moment');

const zonedMoment = moment().utcOffset(-5);

async function getMenu() {
  const McNair = new MTUDining();
  await McNair.load(McNair.MCNAIR);

  const Wads = new MTUDining();
  await Wads.load(Wads.WADS);

  const query = {month: zonedMoment.month(), day: zonedMoment.date()};

  const returnValue = {};
  let meals = {};

  if ((McNair.get(query)).breakfast) {
    meals = McNair.get(query);
    returnValue.hall = 'McNair';
  } else {
    // Saturday or Sunday, return Wads
    meals = Wads.get(query);
    returnValue.hall = 'Wads';
  }

  const hourNow = moment().hour();

  if (hourNow < 10) {
    returnValue.menu = meals.breakfast;
    returnValue.meal = 'Breakfast';
  } else if (hourNow < 13) {
    returnValue.menu = meals.lunch;
    returnValue.meal = 'Lunch';
  } else {
    returnValue.menu = meals.dinner;
    returnValue.meal = 'Dinner';
  }

  return returnValue;
}

module.exports = {getMenu};
