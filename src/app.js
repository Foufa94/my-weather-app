// API Key
const apiKey = "1cb87442ff504ad9ebed6o724055tfa3";

// Display temperature, city, humidity, and wind
function displayTemperature(response) {
  document.querySelector("#current-temperature").innerHTML = `${Math.round(
    response.data.temperature.current
  )}°C`;
  document.querySelector("#current-city").innerHTML = response.data.city;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.temperature.humidity}%`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )} km/h`;
}

// Display the forecast for the next 5 days
function displayForecast(response) {
  const forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = ""; // Clear previous forecast

  response.data.daily.slice(0, 5).forEach((day) => {
    const dayName = formatDay(day.time);
    const icon = getWeatherIcon(day.condition.icon);
    const minTemp = Math.round(day.temperature.minimum);
    const maxTemp = Math.round(day.temperature.maximum);

    forecastElement.innerHTML += `
      <div class="forecast-day">
        <div>${dayName} ${icon}</div>
        <div><strong>${minTemp}°C</strong> - ${maxTemp}°C</div>
      </div>
    `;
  });
}

// Convert timestamp to day name
function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

// Map weather conditions to icons
function getWeatherIcon(condition) {
  const icons = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    rain: "🌧️",
    rainy: "🌧️",
    snow: "❄️",
    sleet: "🌨️",
    wind: "💨",
    fog: "🌫️",
    cloudy: "☁️",
    "partly-cloudy-day": "⛅",
    "partly-cloudy-night": "🌥️",
  };
  return icons[condition] || "🌡️";
}

// Search function to get weather data
function search(event) {
  event.preventDefault();
  const city = document.querySelector("#search-input").value.trim();
  if (!city) return;

  // URLs for current weather and forecast
  const currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=metric`;
  const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=metric`;

  // Fetch current weather data
  axios
    .get(currentWeatherUrl)
    .then(displayTemperature)
    .catch(() => alert("City not found. Please try again."));

  // Fetch forecast data
  axios
    .get(forecastUrl)
    .then(displayForecast)
    .catch((error) => console.error("Error fetching forecast data:", error));
}

// Display current date and time
function formatDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

// Initialize date display
document.querySelector("#current-date").innerHTML = formatDate(new Date());

// Set up event listener for form submission
document.querySelector("#search-form").addEventListener("submit", search);
