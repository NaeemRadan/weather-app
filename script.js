const translations = {
    en: { app_title: "Weather App", search_placeholder: "Search for a city...", search_button: "Search", humidity: "Humidity:", wind: "Wind speed:", error_message: "City not found. Please try again.", loading_text: "Loading...", weather_in: "Weather in", forecast_title: "5-Day Forecast", geolocation_error: "Unable to retrieve your location.", favorites: "Favorites", no_favorites: "No favorite cities yet." },
    ar: { app_title: "تطبيق الطقس", search_placeholder: "ابحث عن مدينة...", search_button: "بحث", humidity: "الرطوبة:", wind: "سرعة الرياح:", error_message: "لم يتم العثور على المدينة. يرجى المحاولة مرة أخرى.", loading_text: "جارٍ التحميل...", weather_in: "الطقس في", forecast_title: "توقعات 5 أيام", geolocation_error: "تعذر الحصول على موقعك.", favorites: "المفضلة", no_favorites: "لا يوجد مدن مفضلة بعد." },
    ru: { app_title: "Погодное приложение", search_placeholder: "Поиск города...", search_button: "Поиск", humidity: "Влажность:", wind: "Скорость ветра:", error_message: "Город не найден. Пожалуйста, попробуйте еще раз.", loading_text: "Загрузка...", weather_in: "Погода в", forecast_title: "Прогноз на 5 дней", geolocation_error: "Не удалось получить ваше местоположение.", favorites: "Избранное", no_favorites: "Нет избранных городов." }
};

let weather = {
    apiKey: API_KEY,
    currentLang: 'ar',
    currentCity: null,
    favorites: [],

    // --- Favorites Management ---
    loadFavorites: function() {
        const savedFavorites = localStorage.getItem('weatherAppFavorites');
        if (savedFavorites) {
            this.favorites = JSON.parse(savedFavorites);
        }
        this.updateFavoritesUI();
    },
    saveFavorites: function() {
        localStorage.setItem('weatherAppFavorites', JSON.stringify(this.favorites));
        this.updateFavoritesUI();
    },
    isFavorite: function(city) {
        return this.favorites.includes(city);
    },
    toggleFavorite: function() {
        if (!this.currentCity) return;
        const starIcon = document.querySelector('.favorite-toggle');
        if (this.isFavorite(this.currentCity)) {
            this.favorites = this.favorites.filter(favCity => favCity !== this.currentCity);
            starIcon.classList.remove('is-favorite');
        } else {
            this.favorites.push(this.currentCity);
            starIcon.classList.add('is-favorite');
        }
        this.saveFavorites();
    },
    updateFavoritesUI: function() {
        const dropdown = document.querySelector('.favorites-dropdown');
        dropdown.innerHTML = '';
        if (this.favorites.length === 0) {
            dropdown.innerHTML = `<div class="favorite-item">${translations[this.currentLang].no_favorites}</div>`;
            return;
        }
        this.favorites.forEach(city => {
            const item = document.createElement('div');
            item.classList.add('favorite-item');
            item.dataset.city = city;
            item.innerHTML = `
                <span>${city}</span>
                <i class="fas fa-trash-alt delete-fav"></i>
            `;
            item.querySelector('span').addEventListener('click', () => {
                this.fetchWeather(city);
                dropdown.classList.remove('show');
            });
            item.querySelector('.delete-fav').addEventListener('click', (e) => {
                e.stopPropagation();
                this.favorites = this.favorites.filter(favCity => favCity !== city);
                this.saveFavorites();
                this.updateStarIcon();
            });
            dropdown.appendChild(item);
        });
    },
    updateStarIcon: function() {
        const starIcon = document.querySelector('.favorite-toggle');
        if (this.isFavorite(this.currentCity)) {
            starIcon.classList.add('is-favorite');
        } else {
            starIcon.classList.remove('is-favorite');
        }
    },

    // --- Core Weather Functions ---
    fetchWeather: function (location) {
        let url;
        if (typeof location === 'string') { this.currentCity = location; url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`; } else { url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`; }
        document.querySelector(".weather" ).classList.add("loading");
        document.querySelector(".weather").classList.remove("loaded");
        document.querySelector(".error-message").style.display = "none";
        document.querySelector(".forecast-container").style.display = "none";
        document.querySelector(".forecast-container").classList.remove("animated");
        fetch(url).then(response => { if (!response.ok) throw new Error("City not found."); return response.json(); }).then(data => { this.currentCity = data.name; localStorage.setItem('weatherAppCity', this.currentCity); this.displayWeather(data); this.fetchForecast(this.currentCity); }).catch(error => { document.querySelector(".weather").classList.remove("loading"); document.querySelector(".weather").classList.remove("loaded"); document.querySelector(".error-message").style.display = "block"; });
    },
    fetchForecast: function (city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}` ).then(response => { if (!response.ok) throw new Error("Forecast not found."); return response.json(); }).then(data => this.displayForecast(data)).catch(error => { console.error("Error fetching forecast:", error); document.querySelector(".forecast-container").style.display = "none"; });
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const root = document.documentElement;
        if (document.body.classList.contains('dark-mode')) { if (temp > 28) { root.style.setProperty('--bg-gradient-1', '#4a0e0e'); root.style.setProperty('--bg-gradient-2', '#781d1d'); } else if (temp < 15) { root.style.setProperty('--bg-gradient-1', '#0d1b2a'); root.style.setProperty('--bg-gradient-2', '#1b263b'); } else { root.style.setProperty('--bg-gradient-1', '#1b4965'); root.style.setProperty('--bg-gradient-2', '#4a6fa5'); } } else { if (temp > 28) { root.style.setProperty('--bg-gradient-1', '#ffaf7b'); root.style.setProperty('--bg-gradient-2', '#ff8a5c'); } else if (temp < 15) { root.style.setProperty('--bg-gradient-1', '#a2d2ff'); root.style.setProperty('--bg-gradient-2', '#bde0fe'); } else { root.style.setProperty('--bg-gradient-1', '#87CEEB'); root.style.setProperty('--bg-gradient-2', '#4682B4'); } }
        document.querySelector(".weather").classList.remove("loading");
        document.querySelector(".weather").classList.add("loaded");
        document.querySelector(".city").innerText = `${translations[this.currentLang].weather_in} ${name}`;
        this.updateStarIcon();
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description" ).innerText = description;
        document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
        document.querySelector(".humidity").innerText = `${humidity}%`;
        document.querySelector(".wind").innerText = `${speed} km/h`;
    },
    displayForecast: function (data) {
        const forecastContainer = document.querySelector(".forecast-days"); forecastContainer.innerHTML = ""; const dailyForecasts = {}; data.list.forEach(item => { const date = new Date(item.dt * 1000).toLocaleDateString(this.currentLang, { weekday: 'long' }); if (!dailyForecasts[date]) { dailyForecasts[date] = { temps: [], icons: {}, descriptions: {} }; } dailyForecasts[date].temps.push(item.main.temp); const icon = item.weather[0].icon; const desc = item.weather[0].description; dailyForecasts[date].icons[icon] = (dailyForecasts[date].icons[icon] || 0) + 1; dailyForecasts[date].descriptions[desc] = (dailyForecasts[date].descriptions[desc] || 0) + 1; }); Object.keys(dailyForecasts).slice(0, 5).forEach(day => { const dayData = dailyForecasts[day]; const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length; const mostCommonIcon = Object.keys(dayData.icons).reduce((a, b) => dayData.icons[a] > dayData.icons[b] ? a : b); const mostCommonDesc = Object.keys(dayData.descriptions).reduce((a, b) => dayData.descriptions[a] > dayData.descriptions[b] ? a : b); const dayElement = document.createElement("div"); dayElement.classList.add("forecast-day"); dayElement.innerHTML = ` <div class="forecast-date">${day}</div> <img src="https://openweathermap.org/img/wn/${mostCommonIcon}.png" alt="${mostCommonDesc}" class="forecast-icon"> <div class="forecast-temp">${Math.round(avgTemp )}°C</div> <div class="forecast-description">${mostCommonDesc}</div> `; forecastContainer.appendChild(dayElement); }); const forecastElement = document.querySelector(".forecast-container"); forecastElement.style.display = "block"; forecastElement.classList.add("animated");
    },
    search: function () {
        const searchBar = document.querySelector(".search-bar"); const city = searchBar.value.trim(); if (city) { this.fetchWeather(city); searchBar.value = ""; } else { searchBar.classList.add("shake"); setTimeout(() => { searchBar.classList.remove("shake"); }, 500); }
    },
    getLocationWeather: function() {
        const success = (position) => { const { latitude, longitude } = position.coords; this.fetchWeather({ lat: latitude, lon: longitude }); }; const error = () => { const lastCity = localStorage.getItem('weatherAppCity') || 'Riyadh'; this.fetchWeather(lastCity); console.warn(translations[this.currentLang].geolocation_error); }; if ('geolocation' in navigator) { navigator.geolocation.getCurrentPosition(success, error); } else { error(); }
    }
};

// --- UI & Event Listeners ---
const langButtons = document.querySelectorAll('.lang-btn');
const htmlEl = document.querySelector('html');
const themeToggle = document.getElementById('theme-checkbox');

function setLanguage(lang) {
    weather.currentLang = lang;
    document.querySelectorAll('[data-translate]').forEach(el => { const key = el.getAttribute('data-translate'); if (translations[lang][key]) { el.innerText = translations[lang][key]; } });
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => { const key = el.getAttribute('data-translate-placeholder'); if (translations[lang][key]) { el.placeholder = translations[lang][key]; } });
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    htmlEl.setAttribute('lang', lang);
    langButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang));
    localStorage.setItem('weatherAppLang', lang);
    if (weather.currentCity) weather.fetchWeather(weather.currentCity);
    weather.updateFavoritesUI();
}

function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    themeToggle.checked = (theme === 'dark');
    if (weather.currentCity) {
        weather.fetchWeather(weather.currentCity);
    }
}

themeToggle.addEventListener('change', () => {
    const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('weatherAppTheme', newTheme);
});

document.querySelector(".search-button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (event) => { if (event.key === "Enter") weather.search(); });
langButtons.forEach(button => button.addEventListener('click', (event) => setLanguage(event.target.getAttribute('data-lang'))));

document.querySelector('.favorite-toggle').addEventListener('click', () => weather.toggleFavorite());
const favoritesBtn = document.querySelector('.favorites-btn');
const favoritesDropdown = document.querySelector('.favorites-dropdown');
favoritesBtn.addEventListener('click', () => {
    favoritesDropdown.classList.toggle('show');
});

window.addEventListener('click', function(e){
    if (!favoritesBtn.contains(e.target) && !favoritesDropdown.contains(e.target)){
        favoritesDropdown.classList.remove('show');
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    weather.loadFavorites();
    const savedLang = localStorage.getItem('weatherAppLang') || 'ar';
    const savedTheme = localStorage.getItem('weatherAppTheme') || 'light';
    setLanguage(savedLang); 
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    themeToggle.checked = (savedTheme === 'dark');
    weather.getLocationWeather();
});
