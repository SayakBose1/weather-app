// services/openMeteoService.js

// Forecast JSON
export async function fetchForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,pressure_msl&forecast_days=3&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch forecast from Open-Meteo");
  return res.json();
}

// Map tile layers (correct WMTS endpoint)
export function getOpenMeteoTile(layer) {
  return `https://tile.open-meteo.com/map/${layer}/{z}/{x}/{y}.png?appid=demo`;
}
