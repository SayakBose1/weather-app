import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchForecast } from "../../services/weatherService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function TemperatureChart({ city }) {
  const { data, isLoading, error } = useQuery(
    ["forecast", city],
    () => fetchForecast(city),
    { enabled: !!city }
  );

  if (!city) return null;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-3xl shadow-2xl border border-red-200 dark:border-red-700/50 p-6">
        <div className="text-center space-y-3">
          <div className="text-5xl">📉</div>
          <p className="text-red-900 dark:text-red-300 font-semibold">
            Error loading chart
          </p>
          <p className="text-sm text-red-700 dark:text-red-400">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const chartData = data?.list?.slice(0, 8)?.map((item) => ({
    time: item.dt_txt.slice(11, 16),
    temp: Math.round(item.main.temp),
  }));

  // Calculate min and max for stats
  const temps = chartData?.map((d) => d.temp) || [];
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      whileHover={{
        y: -2,
        scale: 1.01,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3 },
      }}
      className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-black text-white flex items-center gap-2 mb-1">
            <span className="text-2xl">📈</span> Temperature Trend
          </h2>
          <p className="text-xs text-white/80 font-medium">
            Next 24 hours forecast
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 pb-2 h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
          >
            {/* X-Axis */}
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              stroke="#9CA3AF"
              tickLine={false}
            />

            {/* Y-Axis */}
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              tick={{ fontSize: 11, fill: "#6B7280" }}
              stroke="#9CA3AF"
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "#111",
                fontWeight: "bold",
                fontSize: "14px",
              }}
              labelStyle={{
                color: "#555",
                fontWeight: "600",
                fontSize: "12px",
                marginBottom: "4px",
              }}
              formatter={(value) => [`${value}°C`, "Temperature"]}
            />

            {/* Line with gradient stroke */}
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
              activeDot={{
                r: 7,
                fill: "#EC4899",
                strokeWidth: 3,
                stroke: "#fff",
              }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Bar */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-2 text-center border border-orange-100 dark:border-orange-800/30"
          >
            <div className="text-xl mb-0.5">🔥</div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
              High
            </p>
            <p className="text-base font-black bg-gradient-to-br from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              {maxTemp}°
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-2 text-center border border-purple-100 dark:border-purple-800/30"
          >
            <div className="text-xl mb-0.5">📊</div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
              Average
            </p>
            <p className="text-base font-black bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {avgTemp}°
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-2 text-center border border-blue-100 dark:border-blue-800/30"
          >
            <div className="text-xl mb-0.5">❄️</div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
              Low
            </p>
            <p className="text-base font-black bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {minTemp}°
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="mt-auto h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full"></div>
    </motion.div>
  );
}
