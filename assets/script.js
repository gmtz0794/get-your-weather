const apiKey = "5e1e6ee4bec641307ff1cad4c169606f";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector("weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiURL + city + `&appid=${apiKey}`);
  var data = await response.json();

  console.log(data);

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = "Temp: " + Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = "Humidity: " + data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = "Wind: " + data.wind.speed + "MPH";

  if(data.weather[0].main == "Clouds"){
    weatherIcon.src = "image/Clouds.PNG";
  }
  else if(data.weather[0].main == "Clear"){
    weatherIcon.src = "image/Clear.PNG";
  }
  else if(data.weather[0].main == "Rain"){
    weatherIcon.src = "image/Rain.PNG";
  }
  else if(data.weather[0].main == "Thunderstorm"){
    weatherIcon.src = "image/Thunderstorm.PNG";
  }
  else if(data.weather[0].main == "Mist"){
    weatherIcon.src = "image/Mist.PNG";
  }
  else if(data.weather[0].main == "Snow"){
    weatherIcon.src = "image/Snow.PNG";
  }

}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
})

checkWeather();