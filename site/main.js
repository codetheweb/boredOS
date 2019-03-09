const $ = require('jquery');
const moment = require('moment');
const roundTo = require('round-to');
const xkcd = require('xkcd');

const {getUserActivity} = require('./lib/github');
const {getCurrentWeather} = require('./lib/weather');
const {getMenu} = require('./lib/dining');

const zonedMoment = moment().utcOffset(-5);

$(document).ready(() => {
  // Change slide
  const slides = $('.slide');
  let lastSlideN = 0;

  setInterval(() => {
    slides.eq(lastSlideN % slides.length).addClass('hidden');

    lastSlideN ++;

    slides.eq(lastSlideN % slides.length).removeClass('hidden');
  }, 5000);

  // Call update for first time
  updateSlides();

  // Set interval for slides to update at
  setInterval(() => {
    updateSlides();
  }, 2 * 60 * 1000); // Every 2 minutes
});

function updateSlides() {
  updateBackground();
  updateGithub();
  updateMenu();
  updateXKCD();
  updateWeather();
}

function updateBackground() {
  if (zonedMoment.hour() < 18 && zonedMoment.hour() > 7) {
    // If time of day is < 6:00 PM & > 7:00 AM
    // Do light background
    if (!$('body').hasClass('light-background')) {
      VANTA.FOG({
        el: 'body'
      });

      $('body').addClass('light-background');
    }

    $('body').removeClass('dark-background');
  } else {
    // Otherwise, do dark background
    if (!$('body').hasClass('dark-background')) {
      VANTA.WAVES({
        el: 'body',
        color: 0x0,
        waveSpeed: 0.3
      });

      $('body').addClass('dark-background');
    }

    $('body').removeClass('light-background');
  }
}

function updateGithub() {
  getUserActivity(process.env.GITHUB_USER, 5).then(result => {
    let htmlString = '';

    result.events.forEach(event => {
      htmlString += '<div class="event">';
      htmlString += `<img src="${result.user.avatar}" class="avatar"/>`;
      htmlString += `<div class="message">${event.message}</div>`;
      htmlString += `<div class="time">${moment(event.time).fromNow()}</div>`;
      htmlString += '</div>';
    });

    $('.github-activity').html(htmlString);
  });
}

function updateMenu() {
  getMenu().then(menu => {
    $('.dining .meal').text(menu.meal);
    $('.dining .hall').text(`at ${menu.hall}`);

    let menuHTML = '';

    menu.menu.forEach(item => {
      menuHTML += `<p>${item}</p>`;
    });

    $('.dining .menu').html(menuHTML);
  });
}

function updateXKCD() {
  xkcd(data => {
    $('.xkcd .comic').attr('src', data.img);
    $('.xkcd .caption').text(data.alt);
  });
}

function updateWeather() {
  getCurrentWeather().then(weather => {
    $('.temp-low').text(roundTo(weather.daily.data[0].apparentTemperatureMin, 0));
    $('.temp-high').text(roundTo(weather.daily.data[0].apparentTemperatureMax, 0));
    $('.temp-current').text(roundTo(weather.currently.apparentTemperature, 0));

    $('.content .windspeed').text(roundTo(weather.currently.windSpeed, 0));

    $('.forcast .today').text(weather.hourly.summary);
    $('.forcast .this-week').text(weather.daily.summary);
  });
}
