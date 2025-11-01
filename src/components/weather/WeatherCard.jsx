import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCurrentWeather,
  fetchForecast,
} from "../../services/weatherService";
import FavoriteButton from "./FavoriteButton";
import { motion } from "framer-motion";

export default function WeatherCard({ city }) {
  const { data, isLoading, error } = useQuery(
    ["weather", city],
    () => fetchCurrentWeather(city),
    { enabled: !!city, staleTime: 1000 * 60 * 2 }
  );

  const { data: forecast } = useQuery(
    ["forecast", city],
    () => fetchForecast(city),
    { enabled: !!city }
  );

  if (!city) return null;
  if (isLoading)
    return <div className="p-6 bg-white rounded shadow">Loading...</div>;
  if (error)
    return (
      <div className="p-6 bg-red-50 rounded shadow">Error loading weather</div>
    );

  const icon = data.weather?.[0]?.icon;
  const description = data.weather?.[0]?.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 bg-white dark:bg-slate-800 rounded shadow space-y-4 overflow-hidden"
    >
      {/* Top Row: City + Description + Stats + Icon + Favorite */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{data.name}</h2>
          <p className="text-sm opacity-70 capitalize">{description}</p>
          <div className="flex gap-4 text-sm mt-2">
            <p>Humidity: {data.main.humidity}%</p>
            <p>Pressure: {data.main.pressure} hPa</p>
            <p>Wind: {data.wind.speed} m/s</p>
          </div>
        </div>

        {/* Icon + Favorite Button stacked vertically */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-16 h-16"
            />
          )}
          <FavoriteButton city={data.name} />
        </div>
      </div>

      {/* Middle Row: Main Temp + Feels Like */}
      <div>
        <p className="text-3xl font-bold">{Math.round(data.main.temp)}°C</p>
        <p className="text-sm opacity-70">
          Feels like {Math.round(data.main.feels_like)}°C
        </p>
      </div>

      {/* Bottom Row: Mini Forecast */}
      {forecast?.list && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {forecast.list.slice(0, 6).map((f, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 dark:bg-slate-700 rounded p-2 min-w-[50px] text-xs"
            >
              {f.weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                  alt={f.weather[0].description}
                  className="w-6 h-6"
                />
              )}
              <p className="font-semibold mt-1">{Math.round(f.main.temp)}°</p>
              <p className="opacity-50">{f.dt_txt.slice(11, 16)}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
