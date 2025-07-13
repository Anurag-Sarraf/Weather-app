const API_KEY = "facacc01a0e327fb9b4ac3843f60e893";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetching HTML elements
const cityInput = document.querySelector(".city-input");
const searchBtn = document.getElementById("searchbtn");

const loadingText = document.getElementById("loadingText");
const error = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");

const weatherDisplay = document.getElementById("weatherDisplay");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const aqiValue = document.getElementById("aqiValue");

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// Handle Search
function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  hideAllSections();
  showLoading();
  fetchWeatherData(city);
}

// Fetch Weather Data
async function fetchWeatherData(city) {
  try {
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the spelling.");
      } else if (response.status === 401) {
        throw new Error("Invalid API key.");
      } else {
        throw new Error("Failed to fetch weather data.");
      }
    }

    const data = await response.json();
    displayWeatherData(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    hideLoading();
    showError(error.message);
  }
}

// Display Weather Data
function displayWeatherData(data) {
  hideLoading();

  const cityNameText = `${data.name}, ${data.sys.country}`;
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const feelsLikeTemp = Math.round(data.main.feels_like);
  const humidityValue = data.main.humidity;
  const windSpeedValue = Math.round(data.wind.speed);

  cityName.textContent = cityNameText;
  temperature.textContent = temp;
  weatherDescription.textContent = description;
  feelsLike.textContent = feelsLikeTemp;
  humidity.textContent = humidityValue;
  windSpeed.textContent = windSpeedValue;

  showWeatherDisplay();

  // Fetch AQI using coordinates
  const { lat, lon } = data.coord;
  getAQI(lat, lon);
}

// Fetch AQI
async function getAQI(lat, lon) {
  try {
    const aqiURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(aqiURL);
    const data = await response.json();

    const aqiIndex = data.list[0].main.aqi;
    aqiValue.textContent = interpretAQI(aqiIndex);
  } catch (error) {
    console.error("Error fetching AQI:", error);
    aqiValue.textContent = "N/A";
  }
}

// Interpret AQI value to readable text
function interpretAQI(index) {
  switch (index) {
    case 1: return "Good 😊";
    case 2: return "Fair 🙂";
    case 3: return "Moderate 😐";
    case 4: return "Poor 😷";
    case 5: return "Very Poor 🤢";
    default: return "Unknown";
  }
}

// UI Helpers
function showLoading() {
  loadingText.classList.remove("hidden");
}

function hideLoading() {
  loadingText.classList.add("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
  error.classList.remove("hidden");
}

function hideError() {
  error.classList.add("hidden");
}

function showWeatherDisplay() {
  weatherDisplay.classList.remove("hidden");
}

function hideWeatherDisplay() {
  weatherDisplay.classList.add("hidden");
}

function hideAllSections() {
  hideLoading();
  hideError();
  hideWeatherDisplay();
}
