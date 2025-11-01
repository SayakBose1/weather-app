const API_KEY = 'd52539bb2405dda88b9f6b8a8856c0e2'

// Current weather
export const fetchCurrentWeather = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  )
  if (!res.ok) throw new Error('Failed to fetch current weather')
  return res.json()
}

// Forecast
export const fetchForecast = async (city) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  )
  if (!res.ok) throw new Error('Failed to fetch forecast')
  return res.json()
}

// City suggestions
export const fetchCitySuggestions = async (query) => {
  if (!query) return []

  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  )
  if (!res.ok) throw new Error('Failed to fetch city suggestions')
  return res.json() // array of city objects
}

// ✅ Fetch nearby cities by coordinates
export const fetchNearbyCities = async (lat, lon, cnt = 5) => {
  if (!lat || !lon) return []
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${cnt}&units=metric&appid=${API_KEY}`
  )
  if (!res.ok) throw new Error('Failed to fetch nearby cities')
  const data = await res.json()
  return data.list || [] // data.list contains the nearby cities
}
