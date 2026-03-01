import './style.css'

const translations = {
  en: {
    app_title: 'Weather App',
    search_placeholder: 'Search for a city...',
    search_button: 'Search',
    humidity: 'Humidity:',
    wind: 'Wind speed:',
    error_city_not_found: 'City not found. Please try again.',
    error_api_key: 'API key is invalid or missing.',
    error_rate_limit: 'Too many requests. Please try again in a minute.',
    error_network: 'Network issue. Please check your connection.',
    error_unknown: 'Something went wrong. Please try again.',
    loading_text: 'Loading...',
    weather_in: 'Weather in',
    forecast_title: '5-Day Forecast',
    geolocation_error: 'Unable to retrieve your location.',
    favorites: 'Favorites',
    no_favorites: 'No favorite cities yet.',
    toggle_theme: 'Toggle theme',
    favorite_city: 'Toggle city as favorite',
    remove_favorite: 'Remove from favorites',
  },
  ar: {
    app_title: 'تطبيق الطقس',
    search_placeholder: 'ابحث عن مدينة...',
    search_button: 'بحث',
    humidity: 'الرطوبة:',
    wind: 'سرعة الرياح:',
    error_city_not_found: 'لم يتم العثور على المدينة. يرجى المحاولة مرة أخرى.',
    error_api_key: 'مفتاح API غير صالح أو مفقود.',
    error_rate_limit: 'تم تجاوز الحد المسموح من الطلبات. حاول بعد دقيقة.',
    error_network: 'مشكلة في الشبكة. يرجى التحقق من الاتصال.',
    error_unknown: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    loading_text: 'جارٍ التحميل...',
    weather_in: 'الطقس في',
    forecast_title: 'توقعات 5 أيام',
    geolocation_error: 'تعذر الحصول على موقعك.',
    favorites: 'المفضلة',
    no_favorites: 'لا يوجد مدن مفضلة بعد.',
    toggle_theme: 'تبديل السمة',
    favorite_city: 'تبديل المدينة كمفضلة',
    remove_favorite: 'إزالة من المفضلة',
  },
  ru: {
    app_title: 'Погодное приложение',
    search_placeholder: 'Поиск города...',
    search_button: 'Поиск',
    humidity: 'Влажность:',
    wind: 'Скорость ветра:',
    error_city_not_found: 'Город не найден. Пожалуйста, попробуйте еще раз.',
    error_api_key: 'API-ключ отсутствует или недействителен.',
    error_rate_limit: 'Слишком много запросов. Повторите через минуту.',
    error_network: 'Проблема с сетью. Проверьте подключение.',
    error_unknown: 'Произошла ошибка. Попробуйте снова.',
    loading_text: 'Загрузка...',
    weather_in: 'Погода в',
    forecast_title: 'Прогноз на 5 дней',
    geolocation_error: 'Не удалось получить ваше местоположение.',
    favorites: 'Избранное',
    no_favorites: 'Нет избранных городов.',
    toggle_theme: 'Переключить тему',
    favorite_city: 'Добавить/убрать город из избранного',
    remove_favorite: 'Удалить из избранного',
  },
}

const getTranslation = (lang, key) => translations[lang]?.[key] || translations.en[key] || key

const weather = {
  apiKey: import.meta.env.VITE_API_KEY,
  currentLang: 'ar',
  currentCity: null,
  favorites: [],
  currentWeatherData: null,
  currentForecastData: null,

  loadFavorites() {
    const savedFavorites = localStorage.getItem('weatherAppFavorites')
    if (!savedFavorites) {
      this.updateFavoritesUI()
      return
    }

    try {
      const parsed = JSON.parse(savedFavorites)
      this.favorites = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
    } catch {
      this.favorites = []
      localStorage.removeItem('weatherAppFavorites')
    }

    this.updateFavoritesUI()
  },

  saveFavorites() {
    localStorage.setItem('weatherAppFavorites', JSON.stringify(this.favorites))
    this.updateFavoritesUI()
  },

  isFavorite(city) {
    return this.favorites.includes(city)
  },

  toggleFavorite() {
    if (!this.currentCity) return

    const starIcon = document.querySelector('.favorite-toggle')
    if (this.isFavorite(this.currentCity)) {
      this.favorites = this.favorites.filter((favCity) => favCity !== this.currentCity)
      starIcon.classList.remove('is-favorite')
      starIcon.setAttribute('aria-pressed', 'false')
    } else {
      this.favorites.push(this.currentCity)
      starIcon.classList.add('is-favorite')
      starIcon.setAttribute('aria-pressed', 'true')
    }
    this.saveFavorites()
  },

  updateFavoritesUI() {
    const dropdown = document.querySelector('.favorites-dropdown')
    dropdown.innerHTML = ''

    if (this.favorites.length === 0) {
      const item = document.createElement('div')
      item.classList.add('favorite-item')
      item.textContent = getTranslation(this.currentLang, 'no_favorites')
      dropdown.appendChild(item)
      return
    }

    this.favorites.forEach((city) => {
      const item = document.createElement('div')
      item.classList.add('favorite-item')
      item.dataset.city = city

      const cityButton = document.createElement('button')
      cityButton.type = 'button'
      cityButton.classList.add('favorite-city-btn')
      cityButton.textContent = city

      const deleteButton = document.createElement('button')
      deleteButton.type = 'button'
      deleteButton.classList.add('delete-fav')
      deleteButton.setAttribute('aria-label', getTranslation(this.currentLang, 'remove_favorite'))
      deleteButton.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i>'

      cityButton.addEventListener('click', () => {
        this.fetchWeather(city)
        dropdown.classList.remove('show')
      })

      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation()
        this.favorites = this.favorites.filter((favCity) => favCity !== city)
        this.saveFavorites()
        this.updateStarIcon()
      })

      item.append(cityButton, deleteButton)
      dropdown.appendChild(item)
    })
  },

  updateStarIcon() {
    const starIcon = document.querySelector('.favorite-toggle')
    const isFav = this.isFavorite(this.currentCity)
    starIcon.classList.toggle('is-favorite', isFav)
    starIcon.setAttribute('aria-pressed', isFav ? 'true' : 'false')
  },

  getErrorMessageKey(error) {
    if (error?.name === 'TypeError') return 'error_network'
    if (error?.status === 401) return 'error_api_key'
    if (error?.status === 404) return 'error_city_not_found'
    if (error?.status === 429) return 'error_rate_limit'
    return 'error_unknown'
  },

  showError(error) {
    const weatherElement = document.querySelector('.weather')
    const errorElement = document.querySelector('.error-message')
    const errorText = errorElement.querySelector('p')

    weatherElement.classList.remove('loading', 'loaded')
    const errorKey = this.getErrorMessageKey(error)
    errorText.textContent = getTranslation(this.currentLang, errorKey)
    errorElement.style.display = 'block'
  },

  hideError() {
    document.querySelector('.error-message').style.display = 'none'
  },

  async fetchJson(url, fallbackMessage = 'Request failed') {
    const response = await fetch(url)
    if (!response.ok) {
      const error = new Error(fallbackMessage)
      error.status = response.status
      throw error
    }
    return response.json()
  },

  async fetchWeather(location) {
    let url

    if (typeof location === 'string') {
      this.currentCity = location
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`
    }

    const weatherElement = document.querySelector('.weather')
    const forecastElement = document.querySelector('.forecast-container')

    weatherElement.classList.add('loading')
    weatherElement.classList.remove('loaded')
    this.hideError()
    forecastElement.style.display = 'none'
    forecastElement.classList.remove('animated')

    try {
      const data = await this.fetchJson(url, 'Failed to fetch weather')
      this.currentWeatherData = data
      this.currentCity = data.name
      localStorage.setItem('weatherAppCity', this.currentCity)
      this.displayWeather(data)
      await this.fetchForecast(this.currentCity)
    } catch (error) {
      this.showError(error)
      document.querySelector('.forecast-container').style.display = 'none'
    }
  },

  async fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`

    try {
      const data = await this.fetchJson(url, 'Failed to fetch forecast')
      this.currentForecastData = data
      this.displayForecast(data)
    } catch (error) {
      console.error('Error fetching forecast:', error)
      document.querySelector('.forecast-container').style.display = 'none'
    }
  },

  displayWeather(data) {
    const { name } = data
    const { icon, description } = data.weather[0]
    const { temp, humidity } = data.main
    const { speed } = data.wind
    const root = document.documentElement

    if (document.body.classList.contains('dark-mode')) {
      if (temp > 28) {
        root.style.setProperty('--bg-gradient-1', '#4a0e0e')
        root.style.setProperty('--bg-gradient-2', '#781d1d')
      } else if (temp < 15) {
        root.style.setProperty('--bg-gradient-1', '#0d1b2a')
        root.style.setProperty('--bg-gradient-2', '#1b263b')
      } else {
        root.style.setProperty('--bg-gradient-1', '#1b4965')
        root.style.setProperty('--bg-gradient-2', '#4a6fa5')
      }
    } else if (temp > 28) {
      root.style.setProperty('--bg-gradient-1', '#ffaf7b')
      root.style.setProperty('--bg-gradient-2', '#ff8a5c')
    } else if (temp < 15) {
      root.style.setProperty('--bg-gradient-1', '#a2d2ff')
      root.style.setProperty('--bg-gradient-2', '#bde0fe')
    } else {
      root.style.setProperty('--bg-gradient-1', '#87CEEB')
      root.style.setProperty('--bg-gradient-2', '#4682B4')
    }

    document.querySelector('.weather').classList.remove('loading')
    document.querySelector('.weather').classList.add('loaded')
    document.querySelector('.city').textContent = `${getTranslation(this.currentLang, 'weather_in')} ${name}`
    this.updateStarIcon()
    document.querySelector('.icon').src = `https://openweathermap.org/img/wn/${icon}.png`
    document.querySelector('.icon').alt = description
    document.querySelector('.description').textContent = description
    document.querySelector('.temp').textContent = `${Math.round(temp)}°C`
    document.querySelector('.humidity').textContent = `${humidity}%`
    document.querySelector('.wind').textContent = `${speed} km/h`
  },

  displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-days')
    forecastContainer.innerHTML = ''
    const dailyForecasts = {}

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString(this.currentLang, { weekday: 'long' })
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = { temps: [], icons: {}, descriptions: {} }
      }

      dailyForecasts[date].temps.push(item.main.temp)
      const icon = item.weather[0].icon
      const desc = item.weather[0].description
      dailyForecasts[date].icons[icon] = (dailyForecasts[date].icons[icon] || 0) + 1
      dailyForecasts[date].descriptions[desc] = (dailyForecasts[date].descriptions[desc] || 0) + 1
    })

    Object.keys(dailyForecasts)
      .slice(0, 5)
      .forEach((day) => {
        const dayData = dailyForecasts[day]
        const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length
        const mostCommonIcon = Object.keys(dayData.icons).reduce((a, b) =>
          dayData.icons[a] > dayData.icons[b] ? a : b,
        )
        const mostCommonDesc = Object.keys(dayData.descriptions).reduce((a, b) =>
          dayData.descriptions[a] > dayData.descriptions[b] ? a : b,
        )

        const dayElement = document.createElement('div')
        dayElement.classList.add('forecast-day')

        const dayDate = document.createElement('div')
        dayDate.classList.add('forecast-date')
        dayDate.textContent = day

        const dayIcon = document.createElement('img')
        dayIcon.src = `https://openweathermap.org/img/wn/${mostCommonIcon}.png`
        dayIcon.alt = mostCommonDesc
        dayIcon.classList.add('forecast-icon')

        const dayTemp = document.createElement('div')
        dayTemp.classList.add('forecast-temp')
        dayTemp.textContent = `${Math.round(avgTemp)}°C`

        const dayDesc = document.createElement('div')
        dayDesc.classList.add('forecast-description')
        dayDesc.textContent = mostCommonDesc

        dayElement.append(dayDate, dayIcon, dayTemp, dayDesc)
        forecastContainer.appendChild(dayElement)
      })

    const forecastElement = document.querySelector('.forecast-container')
    forecastElement.style.display = 'block'
    forecastElement.classList.add('animated')
  },

  search() {
    const searchBar = document.querySelector('.search-bar')
    const city = searchBar.value.trim()

    if (city) {
      this.fetchWeather(city)
      searchBar.value = ''
      return
    }

    searchBar.classList.add('shake')
    setTimeout(() => {
      searchBar.classList.remove('shake')
    }, 500)
  },

  getLocationWeather() {
    const success = (position) => {
      const { latitude, longitude } = position.coords
      this.fetchWeather({ lat: latitude, lon: longitude })
    }

    const error = () => {
      const lastCity = localStorage.getItem('weatherAppCity') || 'Riyadh'
      this.fetchWeather(lastCity)
      console.warn(getTranslation(this.currentLang, 'geolocation_error'))
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(success, error)
    } else {
      error()
    }
  },
}

const langButtons = document.querySelectorAll('.lang-btn')
const htmlEl = document.querySelector('html')
const themeToggle = document.getElementById('theme-checkbox')
const favoriteToggleButton = document.querySelector('.favorite-toggle')
const favoritesBtn = document.querySelector('.favorites-btn')
const favoritesDropdown = document.querySelector('.favorites-dropdown')

function setLanguage(lang) {
  weather.currentLang = lang

  document.querySelectorAll('[data-translate]').forEach((el) => {
    const key = el.getAttribute('data-translate')
    el.textContent = getTranslation(lang, key)
  })

  document.querySelectorAll('[data-translate-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-translate-placeholder')
    el.placeholder = getTranslation(lang, key)
  })

  htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  htmlEl.setAttribute('lang', lang)
  langButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang))
  localStorage.setItem('weatherAppLang', lang)

  themeToggle.setAttribute('aria-label', getTranslation(lang, 'toggle_theme'))
  favoriteToggleButton.setAttribute('aria-label', getTranslation(lang, 'favorite_city'))

  if (weather.currentWeatherData) {
    weather.displayWeather(weather.currentWeatherData)
  }
  if (weather.currentForecastData) {
    weather.displayForecast(weather.currentForecastData)
  }

  weather.updateFavoritesUI()
}

function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark')
  themeToggle.checked = theme === 'dark'

  if (weather.currentWeatherData) {
    weather.displayWeather(weather.currentWeatherData)
  }
}

themeToggle.addEventListener('change', () => {
  const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'
  applyTheme(newTheme)
  localStorage.setItem('weatherAppTheme', newTheme)
})

document.querySelector('.search-button').addEventListener('click', () => weather.search())
document.querySelector('.search-bar').addEventListener('keyup', (event) => {
  if (event.key === 'Enter') weather.search()
})
langButtons.forEach((button) =>
  button.addEventListener('click', (event) => setLanguage(event.target.getAttribute('data-lang'))),
)

favoriteToggleButton.addEventListener('click', () => weather.toggleFavorite())
favoritesBtn.addEventListener('click', () => {
  const isExpanded = favoritesDropdown.classList.toggle('show')
  favoritesBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false')
})

window.addEventListener('click', (e) => {
  if (!favoritesBtn.contains(e.target) && !favoritesDropdown.contains(e.target)) {
    favoritesDropdown.classList.remove('show')
    favoritesBtn.setAttribute('aria-expanded', 'false')
  }
})

document.addEventListener('DOMContentLoaded', () => {
  weather.loadFavorites()
  const savedLang = localStorage.getItem('weatherAppLang') || 'ar'
  const savedTheme = localStorage.getItem('weatherAppTheme') || 'light'
  setLanguage(savedLang)
  applyTheme(savedTheme)
  weather.getLocationWeather()
})
