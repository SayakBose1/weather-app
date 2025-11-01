import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchCitySuggestions,
  fetchNearbyCities,
} from "../services/weatherService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import WeatherCard from "../components/weather/WeatherCard";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function WorldMapPage({ favourites, handleFavourite }) {
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weatherLayer, setWeatherLayer] = useState("temp");

  const weatherLayers = {
    temp: {
      name: "Temperature",
      icon: "🌡️",
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${
        import.meta.env.VITE_OPENWEATHER_API_KEY
      }`,
      legend: "Temperature (°C)",
      color: "from-orange-500 to-red-500",
    },
    wind: {
      name: "Wind Speed",
      icon: "💨",
      url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${
        import.meta.env.VITE_OPENWEATHER_API_KEY
      }`,
      legend: "Wind Speed (m/s)",
      color: "from-cyan-500 to-blue-500",
    },
    pressure: {
      name: "Pressure",
      icon: "📊",
      url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${
        import.meta.env.VITE_OPENWEATHER_API_KEY
      }`,
      legend: "Pressure (hPa)",
      color: "from-purple-500 to-pink-500",
    },
  };

  const handleInput = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length >= 2) {
      try {
        const data = await fetchCitySuggestions(value);
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (s) => {
    setSearch(s.name);
    setCity(s.name);
    setSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(city);
    setSuggestions([]);
  };

  const { data: weather } = useQuery(
    ["weather", search],
    () => fetchCurrentWeather(search),
    { enabled: !!search }
  );

  const { data: forecast } = useQuery(
    ["forecast", search],
    () => fetchForecast(search),
    { enabled: !!search }
  );

  const { data: nearby } = useQuery(
    ["nearby", weather?.coord],
    async () => {
      if (!weather?.coord) return [];
      const allNearby = await fetchNearbyCities(
        weather.coord.lat,
        weather.coord.lon,
        7
      );
      const filtered = allNearby.filter(
        (c) => c.name.toLowerCase() !== search.toLowerCase()
      );
      return filtered.slice(0, 6);
    },
    { enabled: !!weather?.coord }
  );

  const WeatherLegend = () => {
    const legends = {
      temp: {
        colors: [
          { color: "#313695", label: "< -40°C" },
          { color: "#4575b4", label: "-40°C to -20°C" },
          { color: "#74add1", label: "-20°C to 0°C" },
          { color: "#abd9e9", label: "0°C to 10°C" },
          { color: "#e0f3f8", label: "10°C to 20°C" },
          { color: "#ffffbf", label: "20°C to 30°C" },
          { color: "#fee090", label: "30°C to 35°C" },
          { color: "#fdae61", label: "35°C to 40°C" },
          { color: "#f46d43", label: "40°C to 45°C" },
          { color: "#d73027", label: "> 45°C" },
        ],
      },
      wind: {
        colors: [
          { color: "#e0f7fa", label: "0-2 m/s" },
          { color: "#81d4fa", label: "2-4 m/s" },
          { color: "#29b6f6", label: "4-6 m/s" },
          { color: "#0288d1", label: "6-8 m/s" },
          { color: "#01579b", label: "8-12 m/s" },
          { color: "#002f6c", label: "12-16 m/s" },
          { color: "#000033", label: "> 16 m/s" },
        ],
      },
      pressure: {
        colors: [
          { color: "#800026", label: "< 980 hPa" },
          { color: "#bd0026", label: "980-990 hPa" },
          { color: "#e31a1c", label: "990-1000 hPa" },
          { color: "#fc4e2a", label: "1000-1010 hPa" },
          { color: "#fd8d3c", label: "1010-1020 hPa" },
          { color: "#feb24c", label: "1020-1030 hPa" },
          { color: "#fed976", label: "> 1030 hPa" },
        ],
      },
    };

    const currentLegend = legends[weatherLayer];

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-2 sm:p-3 md:p-4 rounded-xl shadow-2xl z-[1000] w-[140px] sm:w-[180px] md:w-[220px] border border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs md:text-sm"
      >
        <h4 className="font-bold mb-3 text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-lg">{weatherLayers[weatherLayer].icon}</span>
          {weatherLayers[weatherLayer].legend}
        </h4>
        <div className="space-y-1.5">
          {currentLegend.colors.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-5 h-3 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-black"
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
            🗺️ World Weather Map
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore global weather patterns with interactive maps and real-time
            data visualization
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search any city on the world map... 🌍"
              value={city}
              onChange={handleInput}
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

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto mt-2"
              >
                {suggestions.map((s, index) => (
                  <motion.li
                    key={`${s.lat}-${s.lon}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-5 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 text-gray-900 dark:text-white"
                    onClick={() => handleSelect(s)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <div>
                        <span className="font-semibold">{s.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {s.state ? `, ${s.state}` : ""}, {s.country}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.form>

        {/* Main Content */}
        {weather && forecast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Weather Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* WeatherCard */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <WeatherCard
                  city={search}
                  weather={weather}
                  forecast={forecast}
                  isFavourite={favourites?.includes(search)}
                  onFavourite={handleFavourite}
                />
              </motion.div>

              {/* Temperature Trend Graph */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">📈</span> Temperature Trend
                </h2>
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 640 ? 180 : 250}
                >
                  <LineChart
                    data={forecast.list.slice(0, 8).map((f) => ({
                      time: f.dt_txt.slice(11, 16),
                      temp: Math.round(f.main.temp),
                    }))}
                    margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
                  >
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      stroke="#9CA3AF"
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      stroke="#9CA3AF"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          document.documentElement.classList.contains("dark")
                            ? "rgba(31, 41, 55, 0.95)" // dark gray for dark mode
                            : "rgba(255, 255, 255, 0.95)",
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#F9FAFB" // light text in dark mode
                          : "#111827", // dark text in light mode
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#E5E7EB"
                          : "#374151",
                      }}
                      labelStyle={{
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#F3F4F6"
                          : "#111827",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="url(#colorGradient)"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#3B82F6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 6 }}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Weather Layer Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-3xl">🗺️</span> Weather Layers
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Select a weather parameter to visualize on the map
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(weatherLayers).map(([key, layer]) => (
                  <motion.button
                    key={key}
                    onClick={() => setWeatherLayer(key)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden p-4 rounded-2xl font-bold transition-all ${
                      weatherLayer === key
                        ? `bg-gradient-to-r ${layer.color} text-white shadow-2xl`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{layer.icon}</span>
                      <span className="text-sm">{layer.name}</span>
                    </div>
                    {weatherLayer === key && (
                      <motion.div
                        layoutId="activeLayer"
                        className="absolute inset-0 border-4 border-white/30 rounded-2xl"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  Currently viewing: {weatherLayers[weatherLayer].icon}{" "}
                  {weatherLayers[weatherLayer].legend}
                </p>
              </div>
            </motion.div>

            {/* Interactive Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-700 relative"
            >
              <div className="h-[600px] w-full">
                <MapContainer
                  center={[weather.coord.lat, weather.coord.lon]}
                  zoom={12}
                  minZoom={3}
                  maxZoom={20}
                  style={{ height: "100%", width: "100%" }}
                  key={weatherLayer}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
                    subdomains="abcd"
                  />
                  <TileLayer
                    url={weatherLayers[weatherLayer].url}
                    opacity={0.7}
                    attribution='Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
                  />
                  <Marker position={[weather.coord.lat, weather.coord.lon]}>
                    <Popup>
                      <div className="text-center font-semibold">
                        <div className="text-lg mb-2">{weather.name}</div>
                        <div className="space-y-1 text-sm">
                          <div>🌡️ {Math.round(weather.main.temp)}°C</div>
                          <div>💨 {weather.wind?.speed || 0} m/s</div>
                          <div>💧 {weather.main.humidity}%</div>
                          <div>📊 {weather.main.pressure} hPa</div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>

                <WeatherLegend />

                {/* Map Info Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-2 sm:p-3 md:p-4 rounded-xl shadow-2xl z-[1000] border border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs md:text-sm w-[140px] sm:w-[180px] md:w-[220px]"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                      <span className="text-xl">
                        {weatherLayers[weatherLayer].icon}
                      </span>
                      <span>{weatherLayers[weatherLayer].name}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex items-center gap-1">
                        <span>🔍</span>
                        <span>Zoom out for better patterns</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>✨</span>
                        <span>Best at zoom levels 3-6</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Nearby Cities */}
        <AnimatePresence>
          {nearby?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                  🌍 Nearby Cities
                </h2>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🧭
                </motion.span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {nearby.map((c, index) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <WeatherCard
                      city={c.name}
                      isFavourite={favourites?.includes(c.name)}
                      onFavourite={handleFavourite}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 space-y-4"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl"
            >
              🗺️
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search for a city to explore
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter any city name in the search bar above to view detailed
              weather information and interactive maps
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
