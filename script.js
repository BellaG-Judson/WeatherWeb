function getWeather() {
    const apiKey = '1feb9609b269faa1481e86fabd9f42a5';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);

            // Set background based on searched city timezone
            if (data.timezone !== undefined) {
                setBackgroundBasedOnCityTime(data.timezone);
            } else {
                console.error('Timezone data missing from API response.');
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
            <p>${temperature}&deg;C</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block';

        const timezoneOffsetSeconds = data.timezone;
        setBackgroundBasedOnCityTime (timezoneOffsetSeconds);
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    hourlyForecastDiv.innerHTML = '';

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}&deg;C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHTML;
    });
}

function setBackgroundBasedOnCityTime(timezoneOffsetInSeconds) {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utcTime + timezoneOffsetInSeconds * 1000);
    const cityHour = cityTime.getHours();

    const body = document.body;

    if (cityHour >= 6 && cityHour < 12) {
        // Morning
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')";
    } else if (cityHour >= 12 && cityHour < 18) {
        // Afternoon
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504198458649-3128b932f49b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')";
    } else {
        // Night
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1502209524168-aca6641f9b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')";
    }

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}

function setDefaultBackground() {
    const body = document.body;
    body.style.backgroundImage = "url('https://wallpaperaccess.com/full/1474185.jpg')";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}

// Set default background on page load
window.onload = function() {
    setDefaultBackground();
};
