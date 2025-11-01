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

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-sm mx-auto">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-3xl shadow-xl border border-red-200 dark:border-red-700/50 w-full max-w-sm mx-auto">
        <div className="text-center space-y-3">
          <div className="text-5xl">⚠️</div>
          <p className="text-red-900 dark:text-red-300 font-semibold">
            Error loading weather
          </p>
          <p className="text-sm text-red-700 dark:text-red-400">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const icon = data.weather?.[0]?.icon;
  const description = data.weather?.[0]?.description;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);

  // Dynamic gradient based on weather
  const getWeatherGradient = () => {
    const main = data.weather?.[0]?.main?.toLowerCase();
    if (main?.includes("clear"))
      return "from-amber-400 via-orange-400 to-red-400";
    if (main?.includes("cloud"))
      return "from-gray-400 via-gray-500 to-gray-600";
    if (main?.includes("rain") || main?.includes("drizzle"))
      return "from-blue-400 via-blue-500 to-indigo-500";
    if (main?.includes("snow"))
      return "from-cyan-300 via-blue-300 to-indigo-300";
    if (main?.includes("thunder"))
      return "from-purple-500 via-indigo-600 to-gray-700";
    return "from-blue-400 via-cyan-400 to-teal-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full overflow-hidden"
    >
      {/* Gradient Header */}
      <div
        className={`relative bg-gradient-to-br ${getWeatherGradient()} p-4 pb-16`}
      >
        {/* Favorite Button (fixed click issue) */}
        <div className="absolute top-4 right-4 z-20">
          <FavoriteButton city={data.name} />
        </div>

        {/* Animated Background Pattern — fixed with pointer-events-none */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* City Info */}
        <div className="relative z-10 text-white space-y-0.5">
          <h2 className="text-2xl font-black">{data.name}</h2>
          <p className="text-xs font-medium opacity-90 capitalize flex items-center gap-1.5">
            <span className="text-base">📍</span>
            {description}
          </p>
        </div>

        {/* Weather Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="absolute -bottom-8 right-4 z-10"
        >
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={description}
              className="w-24 h-24 drop-shadow-2xl"
            />
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 pb-4 space-y-4">
        {/* Temperature */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-5xl font-black bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
            >
              {temp}
            </motion.span>
            <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">
              °C
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
            <span className="text-sm">🌡️</span>
            Feels like{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {feelsLike}°C
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {/* Humidity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-2 text-center border border-blue-100 dark:border-blue-800/30"
          >
            <div className="text-xl mb-0.5">💧</div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
              Humidity
            </p>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {data.main.humidity}%
            </p>
          </motion.div>

          {/* Pressure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-2 text-center border border-purple-100 dark:border-purple-800/30"
          >
            <div className="text-xl mb-0.5">📊</div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
              Pressure
            </p>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {data.main.pressure}
            </p>
          </motion.div>

          {/* Wind */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-2 text-center border border-green-100 dark:border-green-800/30"
          >
            <div className="text-xl mb-0.5">💨</div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
              Wind
            </p>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {data.wind.speed}
              <span className="text-[10px] ml-0.5">m/s</span>
            </p>
          </motion.div>
        </div>

        {/* Hourly Forecast */}
        {forecast?.list && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">⏰</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                Hourly Forecast
              </h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {forecast.list.slice(0, 6).map((f, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-2 min-w-[60px] border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                    {f.dt_txt.slice(11, 16)}
                  </p>
                  {f.weather?.[0]?.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${f.weather[0].icon}.png`}
                      alt={f.weather[0].description}
                      className="w-8 h-8 my-0.5"
                    />
                  )}
                  <p className="text-sm font-black bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {Math.round(f.main.temp)}°
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            <span>🌅</span>
            <span className="font-medium">
              High: {Math.round(data.main.temp_max)}°
            </span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            <span>🌙</span>
            <span className="font-medium">
              Low: {Math.round(data.main.temp_min)}°
            </span>
          </div>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
            <span>👁️</span>
            <span className="font-medium">
              {(data.visibility / 1000).toFixed(1)} km
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`h-1 bg-gradient-to-r ${getWeatherGradient()}`}></div>
    </motion.div>
  );
}
