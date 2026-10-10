const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const cityName = document.getElementById('city-name');
const weatherDesc = document.getElementById('weather-desc');
const temprature = document.getElementById('temprature'); // Kept original spelling to match your HTML ID
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');

async function CheckWeather(city) {
    try {
        const geocodeUrl = 'https://openstreetmap.org' + encodeURIComponent(city) + '&format=json&limit=1';

        const geoResponse = await fetch(geocodeUrl, { 
            headers: { 'User-Agent': 'GitHubPagesWeatherApp' } 
        });
        
        if (!geoResponse.ok) throw new Error('Geocoding Failed');
        
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
            throw new Error('City Not Found');
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        
        const displayName = geoData[0].display_name.split(',')[0];

        const weatherUrl = 'https://open-meteo.com' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code';        
        
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error('Weather data not found');

        const data = await response.json();
        const current = data.current;
        const description = getWeatherDescription(current.weather_code);

        // 4. Fixed textContent outputs (using template strings and grabbing the actual value)
        cityName.textContent = displayName;
        weatherDesc.textContent = description;
        temprature.textContent = `${current.temperature_2m}°C`; 
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;

        weatherInfo.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
    } catch (error) {
        weatherInfo.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        console.error(error);
    }
}

function getWeatherDescription(code) {
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Partly cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Raining';
    if (code >= 71 && code <= 75) return 'Snowing';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown Conditions';
}

// 5. Fixed .Value typo to lowercase .value
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) CheckWeather(city);
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) CheckWeather(city);
    }
});
