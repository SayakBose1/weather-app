import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentWeather, fetchForecast } from "../services/weatherService";
import WeatherCard from "../components/weather/WeatherCard";
import TemperatureChart from "../components/weather/TemperatureChart";

// Weather Stats Card
const WeatherStats = ({ icon, label, value, color, isLoading }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-white/20 rounded animate-pulse"></div>
          ) : (
            <p className="text-white text-2xl font-bold">{value}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );
};

// Weekly Weather Card Component
const WeeklyWeatherCard = ({ forecast }) => {
  const date = new Date(forecast.dt * 1000);
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const icon = forecast.weather?.[0]?.icon;
  const description = forecast.weather?.[0]?.description;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.05 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
             rounded-2xl p-4 shadow-lg hover:shadow-2xl 
             transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 
             flex flex-col justify-between items-center h-56"
    >
      <div className="text-center space-y-2 flex flex-col items-center">
        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
          {day}
        </p>
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-14 h-14"
          />
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {description}
        </p>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {Math.round(forecast.main.temp)}°
        </p>
        <div className="flex justify-center gap-3 text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            H: {Math.round(forecast.main.temp_max)}°
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            L: {Math.round(forecast.main.temp_min)}°
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Search Bar Component
const SearchBar = ({ value, onChange, onSearch, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative max-w-2xl mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pl-14 pr-32 text-lg rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all shadow-lg focus:shadow-xl"
        />
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
          🔍
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-shadow"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default function ModernHomePage() {
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const [activeTab, setActiveTab] = useState("today");
  const [searchLocation, setSearchLocation] = useState("Baranagar");
  const [weekLocation, setWeekLocation] = useState("Baranagar");

  const cities = ["London", "New York", "Delhi"];

  // Fetch search location current weather (for today tab)
  const { data: searchWeather, isLoading: searchLoading } = useQuery(
    ["weather", searchLocation],
    () => fetchCurrentWeather(searchLocation),
    { staleTime: 1000 * 60 * 5, enabled: activeTab === "today" }
  );

  // Fetch week location forecast (for week tab)
  const { data: weekForecast, isLoading: weekLoading } = useQuery(
    ["forecast", weekLocation],
    () => fetchForecast(weekLocation),
    { staleTime: 1000 * 60 * 5, enabled: activeTab === "week" }
  );

  const handleFavourite = (city, isFav) => {
    if (isFav) setFavourites([...favourites, city]);
    else setFavourites(favourites.filter((c) => c !== city));
  };

  // Get daily forecasts (one per day)
  const getDailyForecasts = () => {
    if (!weekForecast?.list) return [];

    const dailyMap = new Map();
    weekForecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, item);
      }
    });

    return Array.from(dailyMap.values()).slice(0, 7);
  };

  const dailyForecasts = getDailyForecasts();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-black"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to Weathero
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your ultimate weather companion with real-time forecasts, beautiful
            visualizations, and personalized insights ⚡
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-2 rounded-2xl border border-gray-200 dark:border-gray-700 w-fit mx-auto shadow-xl"
        >
          {["today", "week"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3 rounded-xl font-bold capitalize transition-colors"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab === "today" ? "📅 Today" : "📆 Week"}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Search Bar - Different for each tab */}
        <AnimatePresence mode="wait">
          {activeTab === "today" ? (
            <motion.div
              key="today-search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.3 }}
            >
              <SearchBar
                value={searchLocation}
                onChange={setSearchLocation}
                onSearch={setSearchLocation}
                placeholder="Search any city for today's weather... 🌤️"
              />
            </motion.div>
          ) : (
            <motion.div
              key="week-search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.3 }}
            >
              <SearchBar
                value={weekLocation}
                onChange={setWeekLocation}
                onSearch={setWeekLocation}
                placeholder="Search any city for 7-day forecast... 📆"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Location Section - Only show on "today" tab */}
        <AnimatePresence mode="wait">
          {activeTab === "today" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  📍
                </motion.div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                  {searchLocation}
                </h2>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg"
                >
                  LIVE
                </motion.span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <WeatherCard city={searchLocation} />
                <TemperatureChart city={searchLocation} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weekly Forecast Section - Only show when "week" tab is active */}
        <AnimatePresence mode="wait">
          {activeTab === "week" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Location Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-white text-center"
              >
                <div className="flex items-center justify-center gap-4 mb-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🌦️
                  </motion.span>
                  <h2 className="text-5xl font-black">7-Day Forecast</h2>
                </div>
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <span className="text-4xl">📍</span>
                  <span>{weekLocation}</span>
                </div>
                <p className="text-white/90 mt-2">
                  Your complete weekly weather outlook
                </p>
              </motion.div>

              {/* 7-Day Forecast Cards */}
              <div className="space-y-6">
                {weekLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-48 animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {dailyForecasts.map((forecast, index) => (
                      <motion.div
                        key={forecast.dt}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <WeeklyWeatherCard forecast={forecast} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weather Insights Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                    📊 Weekly Insights
                  </h2>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    💡
                  </motion.span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Temperature Trend Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">🌡️</span> Temperature Trend
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Highest
                          </p>
                          <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
                            {dailyForecasts.length > 0
                              ? Math.max(
                                  ...dailyForecasts.map((f) =>
                                    Math.round(f.main.temp_max)
                                  )
                                )
                              : "--"}
                            °C
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {dailyForecasts.length > 0
                              ? new Date(
                                  dailyForecasts[
                                    dailyForecasts.findIndex(
                                      (f) =>
                                        Math.round(f.main.temp_max) ===
                                        Math.max(
                                          ...dailyForecasts.map((f) =>
                                            Math.round(f.main.temp_max)
                                          )
                                        )
                                    )
                                  ].dt * 1000
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                })
                              : ""}
                          </p>
                        </div>
                        <span className="text-4xl">🔥</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Lowest
                          </p>
                          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            {dailyForecasts.length > 0
                              ? Math.min(
                                  ...dailyForecasts.map((f) =>
                                    Math.round(f.main.temp_min)
                                  )
                                )
                              : "--"}
                            °C
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {dailyForecasts.length > 0
                              ? new Date(
                                  dailyForecasts[
                                    dailyForecasts.findIndex(
                                      (f) =>
                                        Math.round(f.main.temp_min) ===
                                        Math.min(
                                          ...dailyForecasts.map((f) =>
                                            Math.round(f.main.temp_min)
                                          )
                                        )
                                    )
                                  ].dt * 1000
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                })
                              : ""}
                          </p>
                        </div>
                        <span className="text-4xl">❄️</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Weather Conditions Card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">☀️</span> Weekly Conditions
                    </h3>
                    <div className="space-y-3">
                      {dailyForecasts.slice(0, 5).map((forecast, index) => {
                        const date = new Date(forecast.dt * 1000);
                        const day = date.toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                        const icon = forecast.weather?.[0]?.icon;
                        const description = forecast.weather?.[0]?.description;

                        return (
                          <motion.div
                            key={forecast.dt}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              {icon && (
                                <img
                                  src={`https://openweathermap.org/img/wn/${icon}.png`}
                                  alt={description}
                                  className="w-10 h-10"
                                />
                              )}
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white">
                                  {day}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-white">
                                {Math.round(forecast.main.temp)}°
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                💧 {forecast.main.humidity}%
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Best Day Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 shadow-2xl text-white"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl">
                      ⭐
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-1">
                        Best Day This Week
                      </h3>
                      <p className="text-white/90">
                        Perfect weather conditions expected!
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 text-center">
                    <p className="text-sm text-white/80 mb-1">Recommended</p>
                    <p className="text-3xl font-black">
                      {dailyForecasts.length > 0
                        ? new Date(
                            dailyForecasts[0].dt * 1000
                          ).toLocaleDateString("en-US", { weekday: "long" })
                        : "Loading..."}
                    </p>
                    <p className="text-xl font-bold mt-1">
                      {dailyForecasts.length > 0
                        ? `${Math.round(dailyForecasts[0].main.temp)}°C`
                        : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trending Locations - Only show on "today" tab */}
        <AnimatePresence>
          {activeTab === "today" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <span>🌍</span> Trending Locations
                </h2>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🔥
                </motion.span>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {cities.map((city, index) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <WeatherCard city={city} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favourites Section */}
        <AnimatePresence>
          {favourites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-3">
                <span>❤️</span> Your Favorites
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {favourites.map((city, index) => (
                  <motion.div
                    key={city}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2"
                  >
                    <span>{city}</span>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleFavourite(city, false)}
                      className="text-white/80 hover:text-white"
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
