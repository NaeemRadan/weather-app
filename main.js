import './style.css'

const STORAGE_KEYS = {
  lang: 'weatherAppLang',
  city: 'weatherAppCity',
  theme: 'weatherAppTheme',
  favorites: 'weatherAppFavorites',
}

const DEFAULT_CITY = 'Riyadh'
const DEFAULT_LANG = 'ar'
const DEFAULT_THEME = 'light'

const translations = {
  en: {
    app_title: 'Weather App',
    search_placeholder: 'Search for a city...',
    search_button: 'Search',
    use_my_location: 'My location',
    humidity: 'Humidity:',
    wind: 'Wind speed:',
    pressure: 'Pressure:',
    visibility: 'Visibility:',
    feels_like: 'Feels like',
    error_city_not_found: 'City not found. Please try again.',
    error_api_key: 'API key is invalid or missing.',
    error_rate_limit: 'Too many requests. Please try again in a minute.',
    error_network: 'Network issue. Please check your connection.',
    error_unknown: 'Something went wrong. Please try again.',
    error_missing_api_key: 'API key is missing. Add VITE_API_KEY in your .env file.',
    loading_text: 'Loading...',
    weather_in: 'Weather in',
    forecast_title: '5-Day Forecast',
    geolocation_error: 'Unable to retrieve your location.',
    favorites: 'Favorites',
    no_favorites: 'No favorite cities yet.',
    toggle_theme: 'Toggle theme',
    favorite_city: 'Toggle city as favorite',
    remove_favorite: 'Remove from favorites',
    location_idle: 'Ready to detect location',
    location_detecting: 'Detecting your location…',
    location_success: 'Location detected automatically',
    location_denied: 'Location denied, fallback city used',
    updated_at: 'Updated at',
  },
  ar: {
    app_title: 'تطبيق الطقس',
    search_placeholder: 'ابحث عن مدينة...',
    search_button: 'بحث',
    use_my_location: 'موقعي',
    humidity: 'الرطوبة:',
    wind: 'سرعة الرياح:',
    pressure: 'الضغط:',
    visibility: 'مدى الرؤية:',
    feels_like: 'المحسوسة',
    error_city_not_found: 'لم يتم العثور على المدينة. يرجى المحاولة مرة أخرى.',
    error_api_key: 'مفتاح API غير صالح أو مفقود.',
    error_rate_limit: 'تم تجاوز الحد المسموح من الطلبات. حاول بعد دقيقة.',
    error_network: 'مشكلة في الشبكة. يرجى التحقق من الاتصال.',
    error_unknown: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    error_missing_api_key: 'مفتاح API مفقود. أضف VITE_API_KEY داخل ملف .env.',
    loading_text: 'جارٍ التحميل...',
    weather_in: 'الطقس في',
    forecast_title: 'توقعات 5 أيام',
    geolocation_error: 'تعذر الحصول على موقعك.',
    favorites: 'المفضلة',
    no_favorites: 'لا يوجد مدن مفضلة بعد.',
    toggle_theme: 'تبديل السمة',
    favorite_city: 'تبديل المدينة كمفضلة',
    remove_favorite: 'إزالة من المفضلة',
    location_idle: 'جاهز لتحديد الموقع',
    location_detecting: 'جارٍ تحديد موقعك…',
    location_success: 'تم تحديد الموقع تلقائياً',
    location_denied: 'تم رفض الموقع، تم استخدام مدينة بديلة',
    updated_at: 'آخر تحديث',
  },
  ru: {
    app_title: 'Погодное приложение',
    search_placeholder: 'Поиск города...',
    search_button: 'Поиск',
    use_my_location: 'Моё местоположение',
    humidity: 'Влажность:',
    wind: 'Скорость ветра:',
    pressure: 'Давление:',
    visibility: 'Видимость:',
    feels_like: 'Ощущается как',
    error_city_not_found: 'Город не найден. Пожалуйста, попробуйте еще раз.',
    error_api_key: 'API-ключ отсутствует или недействителен.',
    error_rate_limit: 'Слишком много запросов. Повторите через минуту.',
    error_network: 'Проблема с сетью. Проверьте подключение.',
    error_unknown: 'Произошла ошибка. Попробуйте снова.',
    error_missing_api_key: 'API-ключ отсутствует. Добавьте VITE_API_KEY в .env.',
    loading_text: 'Загрузка...',
    weather_in: 'Погода в',
    forecast_title: 'Прогноз на 5 дней',
    geolocation_error: 'Не удалось получить ваше местоположение.',
    favorites: 'Избранное',
    no_favorites: 'Нет избранных городов.',
    toggle_theme: 'Переключить тему',
    favorite_city: 'Добавить/убрать город из избранного',
    remove_favorite: 'Удалить из избранного',
    location_idle: 'Готово к определению геолокации',
    location_detecting: 'Определяем ваше местоположение…',
    location_success: 'Местоположение определено автоматически',
    location_denied: 'Геолокация отклонена, используется резервный город',
    updated_at: 'Обновлено в',
  },
}

const refs = {
  html: document.documentElement,
  weather: document.querySelector('.weather'),
  searchBar: document.querySelector('.search-bar'),
  searchButton: document.querySelector('.search-button'),
  themeToggle: document.getElementById('theme-checkbox'),
  favoriteToggleButton: document.querySelector('.favorite-toggle'),
  favoritesBtn: document.querySelector('.favorites-btn'),
  favoritesDropdown: document.querySelector('.favorites-dropdown'),
  locateButton: document.querySelector('.locate-btn'),
  locationStatus: document.getElementById('location-status'),
  updatedAt: document.getElementById('updated-at'),
  errorBox: document.querySelector('.error-message'),
  errorText: document.querySelector('.error-message p'),
  forecastContainer: document.querySelector('.forecast-container'),
  forecastDays: document.querySelector('.forecast-days'),
  langButtons: document.querySelectorAll('.lang-btn'),
  city: document.querySelector('.city'),
  icon: document.querySelector('.icon'),
  description: document.querySelector('.description'),
  feelsLike: document.querySelector('.feels-like'),
  temp: document.querySelector('.temp'),
  humidity: document.querySelector('.humidity'),
  wind: document.querySelector('.wind'),
  pressure: document.querySelector('.pressure'),
  visibility: document.querySelector('.visibility'),
}

const getTranslation = (lang, key) => translations[lang]?.[key] || translations.en[key] || key
const normalizeCity = (city) => city.trim().toLocaleLowerCase()

const weather = {
  apiKey: import.meta.env.VITE_API_KEY,
  currentLang: DEFAULT_LANG,
  currentCity: null,
  favorites: [],
  currentWeatherData: null,
  currentForecastData: null,
  requestController: null,

  setLoading(isLoading) {
    refs.weather.classList.toggle('loading', isLoading)
    refs.weather.classList.toggle('loaded', !isLoading && !!this.currentWeatherData)
    refs.searchButton.disabled = isLoading
    refs.searchButton.setAttribute('aria-busy', isLoading ? 'true' : 'false')
  },

  setLocationStatus(key) {
    refs.locationStatus.textContent = getTranslation(this.currentLang, key)
  },

  setUpdatedAt() {
    const now = new Date().toLocaleTimeString(this.currentLang, {
      hour: '2-digit',
      minute: '2-digit',
    })
    refs.updatedAt.textContent = `${getTranslation(this.currentLang, 'updated_at')}: ${now}`
  },

  readFavoritesSafely() {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites)
    if (!raw) return []

    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      const dedupMap = new Map()
      parsed
        .filter((item) => typeof item === 'string' && item.trim())
        .forEach((city) => dedupMap.set(normalizeCity(city), city.trim()))
      return [...dedupMap.values()]
    } catch {
      localStorage.removeItem(STORAGE_KEYS.favorites)
      return []
    }
  },

  loadFavorites() {
    this.favorites = this.readFavoritesSafely()
    this.updateFavoritesUI()
  },

  saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(this.favorites))
    this.updateFavoritesUI()
  },

  isFavorite(city) {
    if (!city) return false
    const key = normalizeCity(city)
    return this.favorites.some((fav) => normalizeCity(fav) === key)
  },

  toggleFavorite() {
    if (!this.currentCity) return

    const normalized = normalizeCity(this.currentCity)
    if (this.isFavorite(this.currentCity)) {
      this.favorites = this.favorites.filter((favCity) => normalizeCity(favCity) !== normalized)
    } else {
      this.favorites = [...this.favorites, this.currentCity]
    }

    this.updateStarIcon()
    this.saveFavorites()
  },

  updateFavoritesUI() {
    refs.favoritesDropdown.innerHTML = ''

    if (this.favorites.length === 0) {
      const item = document.createElement('div')
      item.classList.add('favorite-item')
      item.textContent = getTranslation(this.currentLang, 'no_favorites')
      refs.favoritesDropdown.appendChild(item)
      return
    }

    this.favorites.forEach((city) => {
      const item = document.createElement('div')
      item.classList.add('favorite-item')

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
        toggleFavoritesDropdown(false)
      })

      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation()
        this.favorites = this.favorites.filter((favCity) => normalizeCity(favCity) !== normalizeCity(city))
        this.saveFavorites()
        this.updateStarIcon()
      })

      item.append(cityButton, deleteButton)
      refs.favoritesDropdown.appendChild(item)
    })
  },

  updateStarIcon() {
    const isFav = this.isFavorite(this.currentCity)
    refs.favoriteToggleButton.classList.toggle('is-favorite', isFav)
    refs.favoriteToggleButton.setAttribute('aria-pressed', isFav ? 'true' : 'false')
  },

  getErrorMessageKey(error) {
    if (error?.name === 'AbortError') return null
    if (error?.name === 'TypeError') return 'error_network'
    if (error?.status === 401) return 'error_api_key'
    if (error?.status === 404) return 'error_city_not_found'
    if (error?.status === 429) return 'error_rate_limit'
    return 'error_unknown'
  },

  showErrorByKey(errorKey) {
    if (!errorKey) return
    refs.errorText.textContent = getTranslation(this.currentLang, errorKey)
    refs.errorBox.style.display = 'block'
  },

  hideError() {
    refs.errorBox.style.display = 'none'
  },

  async fetchJson(url, signal) {
    const response = await fetch(url, { signal })
    if (!response.ok) {
      const error = new Error('Request failed')
      error.status = response.status
      throw error
    }
    return response.json()
  },

  ensureApiKey() {
    if (this.apiKey) return true
    this.showErrorByKey('error_missing_api_key')
    this.setLoading(false)
    return false
  },

  async fetchWeather(location) {
    if (!this.ensureApiKey()) return

    if (this.requestController) {
      this.requestController.abort()
    }

    this.requestController = new AbortController()
    const { signal } = this.requestController
    const isCityQuery = typeof location === 'string'
    const cityValue = isCityQuery ? location.trim() : null

    const weatherUrl = isCityQuery
      ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityValue)}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`

    this.setLoading(true)
    this.hideError()
    refs.forecastContainer.style.display = 'none'
    refs.forecastContainer.classList.remove('animated')

    try {
      const data = await this.fetchJson(weatherUrl, signal)
      this.currentWeatherData = data
      this.currentCity = data.name
      localStorage.setItem(STORAGE_KEYS.city, this.currentCity)
      this.displayWeather(data)
      await this.fetchForecast(this.currentCity, signal)
      this.setUpdatedAt()
    } catch (error) {
      const errorKey = this.getErrorMessageKey(error)
      if (errorKey) {
        this.setLoading(false)
        this.showErrorByKey(errorKey)
        refs.forecastContainer.style.display = 'none'
      }
    }
  },

  async fetchForecast(city, signal) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${this.apiKey}&lang=${this.currentLang}`

    try {
      const data = await this.fetchJson(url, signal)
      this.currentForecastData = data
      this.displayForecast(data)
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Error fetching forecast:', error)
      }
      refs.forecastContainer.style.display = 'none'
    }
  },

  displayWeather(data) {
    const { name } = data
    const { icon, description } = data.weather[0]
    const { temp, humidity, pressure, feels_like: feelsLike } = data.main
    const visibilityKm = ((data.visibility || 0) / 1000).toFixed(1)
    const windSpeedKmh = Math.round((data.wind.speed || 0) * 3.6)

    refs.city.textContent = `${getTranslation(this.currentLang, 'weather_in')} ${name}`
    refs.icon.src = `https://openweathermap.org/img/wn/${icon}.png`
    refs.icon.alt = description
    refs.description.textContent = description
    refs.feelsLike.textContent = `${getTranslation(this.currentLang, 'feels_like')}: ${Math.round(feelsLike)}°C`
    refs.temp.textContent = `${Math.round(temp)}°C`
    refs.humidity.textContent = `${humidity}%`
    refs.wind.textContent = `${windSpeedKmh} km/h`
    refs.pressure.textContent = `${pressure} hPa`
    refs.visibility.textContent = `${visibilityKm} km`

    this.applyDynamicBackground(temp)
    this.updateStarIcon()
    this.setLoading(false)
  },

  applyDynamicBackground(temp) {
    const root = refs.html

    if (document.body.classList.contains('dark-mode')) {
      if (temp > 28) {
        root.style.setProperty('--bg-gradient-1', '#432534')
        root.style.setProperty('--bg-gradient-2', '#742f4f')
      } else if (temp < 15) {
        root.style.setProperty('--bg-gradient-1', '#0a2647')
        root.style.setProperty('--bg-gradient-2', '#144272')
      } else {
        root.style.setProperty('--bg-gradient-1', '#1f4e5f')
        root.style.setProperty('--bg-gradient-2', '#355c7d')
      }
      return
    }

    if (temp > 28) {
      root.style.setProperty('--bg-gradient-1', '#f6a26b')
      root.style.setProperty('--bg-gradient-2', '#e76f51')
    } else if (temp < 15) {
      root.style.setProperty('--bg-gradient-1', '#9dd9f3')
      root.style.setProperty('--bg-gradient-2', '#70a1d7')
    } else {
      root.style.setProperty('--bg-gradient-1', '#80c8ff')
      root.style.setProperty('--bg-gradient-2', '#4f8fba')
    }
  },

  displayForecast(data) {
    refs.forecastDays.innerHTML = ''

    const dailyForecasts = new Map()
    data.list.forEach((item) => {
      const dayKey = item.dt_txt.split(' ')[0]
      const dayLabel = new Date(item.dt * 1000).toLocaleDateString(this.currentLang, { weekday: 'short' })

      if (!dailyForecasts.has(dayKey)) {
        dailyForecasts.set(dayKey, { label: dayLabel, temps: [], icons: {}, descriptions: {} })
      }

      const dayData = dailyForecasts.get(dayKey)
      dayData.temps.push(item.main.temp)

      const icon = item.weather[0].icon
      const desc = item.weather[0].description
      dayData.icons[icon] = (dayData.icons[icon] || 0) + 1
      dayData.descriptions[desc] = (dayData.descriptions[desc] || 0) + 1
    })

    Array.from(dailyForecasts.values())
      .slice(0, 5)
      .forEach((dayData) => {
        const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length
        const mostCommonIcon = Object.keys(dayData.icons).reduce((a, b) =>
          dayData.icons[a] > dayData.icons[b] ? a : b,
        )
        const mostCommonDesc = Object.keys(dayData.descriptions).reduce((a, b) =>
          dayData.descriptions[a] > dayData.descriptions[b] ? a : b,
        )

        const dayElement = document.createElement('article')
        dayElement.classList.add('forecast-day')
        dayElement.innerHTML = `
          <div class="forecast-date">${dayData.label}</div>
          <img src="https://openweathermap.org/img/wn/${mostCommonIcon}.png" alt="${mostCommonDesc}" class="forecast-icon" />
          <div class="forecast-temp">${Math.round(avgTemp)}°C</div>
          <div class="forecast-description">${mostCommonDesc}</div>
        `

        refs.forecastDays.appendChild(dayElement)
      })

    refs.forecastContainer.style.display = 'block'
    refs.forecastContainer.classList.add('animated')
  },

  search() {
    const city = refs.searchBar.value.trim()

    if (!city) {
      refs.searchBar.classList.add('shake')
      setTimeout(() => refs.searchBar.classList.remove('shake'), 500)
      return
    }

    this.fetchWeather(city)
    refs.searchBar.value = ''
  },

  detectLocationWeather() {
    if (!this.ensureApiKey()) return

    this.setLocationStatus('location_detecting')

    const onSuccess = (position) => {
      const { latitude, longitude } = position.coords
      this.fetchWeather({ lat: latitude, lon: longitude })
      this.setLocationStatus('location_success')
    }

    const onError = () => {
      const lastCity = localStorage.getItem(STORAGE_KEYS.city) || DEFAULT_CITY
      this.fetchWeather(lastCity)
      this.setLocationStatus('location_denied')
      console.warn(getTranslation(this.currentLang, 'geolocation_error'))
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 8000 })
    } else {
      onError()
    }
  },
}

function toggleFavoritesDropdown(force) {
  const isExpanded = typeof force === 'boolean' ? force : !refs.favoritesDropdown.classList.contains('show')
  refs.favoritesDropdown.classList.toggle('show', isExpanded)
  refs.favoritesBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false')
}

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

  refs.html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  refs.html.setAttribute('lang', lang)
  refs.langButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-lang') === lang))
  localStorage.setItem(STORAGE_KEYS.lang, lang)

  refs.themeToggle.setAttribute('aria-label', getTranslation(lang, 'toggle_theme'))
  refs.favoriteToggleButton.setAttribute('aria-label', getTranslation(lang, 'favorite_city'))

  if (weather.currentWeatherData) weather.displayWeather(weather.currentWeatherData)
  if (weather.currentForecastData) weather.displayForecast(weather.currentForecastData)

  weather.updateFavoritesUI()
  weather.setLocationStatus('location_idle')
  weather.setUpdatedAt()
}

function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark')
  refs.themeToggle.checked = theme === 'dark'

  if (weather.currentWeatherData) {
    weather.displayWeather(weather.currentWeatherData)
  }
}

refs.themeToggle.addEventListener('change', () => {
  const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'
  applyTheme(newTheme)
  localStorage.setItem(STORAGE_KEYS.theme, newTheme)
})

refs.searchButton.addEventListener('click', () => weather.search())
refs.searchBar.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') weather.search()
})

refs.langButtons.forEach((button) =>
  button.addEventListener('click', (event) => setLanguage(event.target.getAttribute('data-lang'))),
)

refs.favoriteToggleButton.addEventListener('click', () => weather.toggleFavorite())
refs.favoritesBtn.addEventListener('click', () => toggleFavoritesDropdown())
refs.locateButton.addEventListener('click', () => weather.detectLocationWeather())

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') toggleFavoritesDropdown(false)
})

window.addEventListener('click', (event) => {
  if (!refs.favoritesBtn.contains(event.target) && !refs.favoritesDropdown.contains(event.target)) {
    toggleFavoritesDropdown(false)
  }
})

document.addEventListener('DOMContentLoaded', () => {
  weather.loadFavorites()

  const savedLang = localStorage.getItem(STORAGE_KEYS.lang) || DEFAULT_LANG
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || DEFAULT_THEME

  setLanguage(savedLang)
  applyTheme(savedTheme)
  weather.detectLocationWeather()
})
