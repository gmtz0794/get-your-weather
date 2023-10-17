const apiKey = "5e1e6ee4bec641307ff1cad4c169606f";
const apiURL = "https://api.openweathermap.org/data/2.5/";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const uniqueDays = {};

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
    } else {
      displayErrorMessage("Please enter a valid city");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    displayErrorMessage("Failed to fetch data. Please try again later.");
  }
}

function displayCurrentWeather(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = "Temp: " + Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = "Humidity: " + data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = "Wind: " + data.wind.speed + " MPH";
  
  if (data.weather && data.weather.length > 0) {
    setWeatherIcon(data.weather[0].main);
  } else {
    setWeatherIcon("Unknown"); 
  }
  document.querySelector(".wind").innerHTML = "Wind: " + data.wind.speed + " MPH";
}


function setWeatherIcon(weather) {
  const weatherIcon = document.querySelector(".weather-icon");
  switch (weather) {
    case "Clouds":
      weatherIcon.src = "image/Clouds.PNG";
      break;
    case "Clear":
      weatherIcon.src = "image/Clear.PNG";
      break;
    case "Rain":
      weatherIcon.src = "image/Rain.PNG";
      break;
    case "Thunderstorm":
      weatherIcon.src = "image/Thunderstorm.PNG";
      break;
    case "Mist":
      weatherIcon.src = "image/Mist.PNG";
      break;
    case "Snow":
      weatherIcon.src = "image/Snow.PNG";
      break;
    default:
      weatherIcon.src = ""; 
  }
}

function displayForecast(forecastData) {
  const forecastSection = document.querySelector(".forecast");
  forecastSection.innerHTML = "";

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
        <p>Temp: ${Math.round(forecast.main.temp)}°C</p>
        <p>Wind: ${forecast.wind.speed} MPH</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
      `;

      forecastSection.appendChild(forecastItem);
    }
  });
}

function displayErrorMessage(message) {
  const forecastSection = document.querySelector(".forecast");
  forecastSection.innerHTML = `<p>${message}</p>`;
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
