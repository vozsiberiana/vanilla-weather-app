//Returns the day and the real time
function formatDate() {
  let date = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day}, ${hours}:${minutes}`;
}

//Displays actual weather data and real time in the page
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let pressureElement = document.querySelector("#pressure");

  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate();
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  pressureElement.innerHTML = Math.round(response.data.main.pressure);
}

//Returns the time based on OpenWeather last update
//(for the forecast, each 3 hrs)
function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

//Displays the forecast
function displayForecast(response) {
  console.log(response);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let i = 0; i < 6; i++) {
    forecast = response.data.list[i];
    forecastElement.innerHTML += `          
    <div class="col-2">
            <h3>
            ${formatHours(forecast.dt * 1000)}
            </h3>
            <img
              src="http://openweathermap.org/img/wn/${
                forecast.weather[0].icon
              }@2x.png" class="weather-images"
            />
            <div class="weather-forecast-temperature">
              <strong><span class="max">${Math.round(
                forecast.main.temp_max
              )}</span>°</strong> | <span class="min">${Math.round(
      forecast.main.temp_min
    )}</span>°
            </div>
        </div>`;
  }
}

//Handles the error
function handleError() {
  alert("Oops, something is wrong. Try again!");
}

//Searches for the city
function search(city) {
  let apiKey = "0b1fa8952349f479be72640e8d64dd95";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast).catch(handleError);
}

//Handles the submit event (the search form)
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
  if (fahrenheitLink.classList.contains("active")) {
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
  }
}

//Converts Celsius to Fahrenheit
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  let unit = document.querySelector("#unit");
  unit.innerHTML = "°F";

  let unitForecastMax = document.querySelectorAll(".max");
  let unitForecastMin = document.querySelectorAll(".min");

  for (let i = 0; i < 6; i++) {
    celsiusTemperatureMaxArray[i] = unitForecastMax[i].innerHTML;
    celsiusTemperatureMinArray[i] = unitForecastMin[i].innerHTML;
    // console.log(celsiusTemperatureMaxArray[i], celsiusTemperatureMinArray[i]);

    unitForecastMax[i].innerHTML = Math.round(
      (parseInt(unitForecastMax[i].innerHTML) * 9) / 5 + 32
    );
    unitForecastMin[i].innerHTML = Math.round(
      (parseInt(unitForecastMin[i].innerHTML) * 9) / 5 + 32
    );
  }
}

//Converts Fahrenheit to Celsius
function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  let unit = document.querySelector("#unit");
  unit.innerHTML = "°C";

  let unitForecastMax = document.querySelectorAll(".max");
  let unitForecastMin = document.querySelectorAll(".min");
  for (let i = 0; i < 6; i++) {
    unitForecastMax[i].innerHTML = celsiusTemperatureMaxArray[i];
    unitForecastMin[i].innerHTML = celsiusTemperatureMinArray[i];
  }
}

let celsiusTemperature = null;
let celsiusTemperatureMaxArray = new Array(6).fill(0);
let celsiusTemperatureMinArray = new Array(6).fill(0);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Barcelona");
