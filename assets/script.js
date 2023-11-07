const apiKey = "5e1e6ee4bec641307ff1cad4c169606f";
const apiURL = "https://api.openweathermap.org/data/2.5/";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcons = {
  Clouds: "../images/clouds.png",
  Clear: "../images/clear.png",
  Rain: "../images/rain.png",
  Thunderstorm: "../images/thunderstorm.png",
  Mist: "../images/mist.png",
  Snow: "../images/snow.png",
};

let uniqueDays = {};

async function checkWeather(city) {
  try {
    const response = await fetch(`${apiURL}weather?units=metric&q=${city}&appid=${apiKey}`);
    const data = await response.json();

    console.log(data);

    if (data.cod === 200) {
      displayCurrentWeather(data);

      const forecastResponse = await fetch(`${apiURL}forecast?units=metric&q=${city}&appid=${apiKey}`);
      const forecastData = await forecastResponse.json();

      console.log(forecastData);
      displayForecast(forecastData.list);
      
      saveToLocalStorage(city);
      
      updateSearchHistory(city);
    } else {
      displayErrorMessage("Please enter a valid city");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    displayErrorMessage("Failed to fetch data. Please try again later.");
  }
}

function displayCurrentWeather(data) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  document.querySelector(".city").innerHTML = `${data.name} (${formattedDate})`;
  document.querySelector(".temp").innerHTML = "Temp: " + Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = "Humidity: " + data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = "Wind: " + data.wind.speed + " MPH";
  
  if (data.weather && data.weather.length > 0) {
    setWeatherIcon(data.weather[0].main);
  } else {
    setWeatherIcon("Unknown"); 
  }
}

function setWeatherIcon(weather) {
  const weatherIcon = document.querySelector(".weather-icon");

 weatherIcon.src = '';

 if (weatherIcons[weather]) {
  weatherIcon.src = weatherIcons[weather];
 }
}

function displayForecast(forecastData) {
  const forecastSection = document.querySelector(".forecast");
  forecastSection.innerHTML = "";

  uniqueDays = {};

  forecastData.forEach(forecast => {
    const forecastDate = new Date(forecast.dt * 1000);
    const dayKey = forecastDate.toISOString().split('T')[0];

    if (!uniqueDays[dayKey]) {
      uniqueDays[dayKey] = true;

      const options = { month: "numeric", day: "numeric", year: "numeric" };
      const formattedDate = forecastDate.toLocaleDateString(undefined, options);

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <h3>${formattedDate}</h3>
        <img class="weather-icon" src="${getWeatherIconUrl(forecast.weather[0].main)}" alt="Weather Icon">
        <p>Temp: ${Math.round(forecast.main.temp)}°C</p>
        <p>Wind: ${forecast.wind.speed} MPH</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      `;

      forecastSection.appendChild(forecastItem);
    }
  });
}

function getWeatherIconUrl(weather) {
  // Map weather conditions to appropriate icon files or classes
  const iconMappings = {
    Clouds: "../images/Clouds.png",
    Clear: "../images/Clear.png",
    Rain: "../images/Rain.png",
    Thunderstorm: "../images/Thunderstorm.png",
    Mist: "../images/Mist.png",
    Snow: "../images/Snow.png",
    // Add more mappings as needed
  };

  return iconMappings[weather] || "../images/Clouds.png"; // Default to an unknown icon if no mapping is found
}

function displayErrorMessage(message) {
  const forecastSection = document.querySelector(".forecast");
  forecastSection.innerHTML = `<p>${message}</p>`;
}

function saveToLocalStorage(cityName) {
  let savedCities = JSON.parse(localStorage.getItem("cities")) || [];

  if (savedCities.length >= 8) {
    savedCities.shift(); 
  }

  savedCities.push(cityName);
  localStorage.setItem("cities", JSON.stringify(savedCities));
}

function updateSearchHistory(cityName) {
  const searchHistory = document.querySelector(".search-history");

  // Create a button element for the search entry
  const searchEntryButton = document.createElement("button");
  searchEntryButton.classList.add("search-history-button");
  searchEntryButton.textContent = cityName;

  // Add event listener to the button for handling the search
  searchEntryButton.addEventListener("click", () => {
    checkWeather(cityName);
  });

  // Insert the button at the beginning of the search history
  searchHistory.insertBefore(searchEntryButton, searchHistory.firstChild);

  // Limit the number of buttons to 8
  while (searchHistory.children.length > 8) {
    searchHistory.removeChild(searchHistory.lastChild);
  }
}

function resetSearchHistory() {
  const searchHistory = document.querySelector(".search-history");
  searchHistory.innerHTML = ""; // Clear search history

  const forecastSection = document.querySelector(".forecast");
  forecastSection.innerHTML = "<p>Please Enter a City</p>"; // Display message

  document.querySelector(".city").innerHTML = "Please Enter a City";
  document.querySelector(".temp").innerHTML = "";
  document.querySelector(".humidity").innerHTML = "";
  document.querySelector(".wind").innerHTML = "";
  document.querySelector(".weather-icon").src = ""; // Clear weather icon

  localStorage.clear();
  console.log("Local storage cleared");
}

window.addEventListener("load", resetSearchHistory);

searchBtn.addEventListener("click", () => {
  const cityName = searchBox.value.trim();
  if (cityName) {
    checkWeather(cityName);
  }
});

const savedCities = JSON.parse(localStorage.getItem("cities")) || [];
savedCities.forEach((city) => {
  updateSearchHistory(city);
});

const lastSearchedCity = savedCities.pop();
if (lastSearchedCity) {
  checkWeather(lastSearchedCity);
}

