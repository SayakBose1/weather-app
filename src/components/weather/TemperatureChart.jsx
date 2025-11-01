// import React from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { fetchForecast } from '../../services/weatherService'
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// export default function TemperatureChart({ city }) {
//   const { data, isLoading, error } = useQuery(
//     ['forecast', city],
//     () => fetchForecast(city),
//     { enabled: !!city }
//   )

//   if (!city) return null
//   if (isLoading) return <div>Loading chart...</div>
//   if (error) return <div>Error loading chart</div>

//   const chartData = data.list.map((item) => ({
//     time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     temp: Math.round(item.main.temp),
//   }))

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={chartData}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="time" />
//         <YAxis unit="°C" />
//         <Tooltip />
//         <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} />
//       </LineChart>
//     </ResponsiveContainer>
//   )
// }
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
  if (isLoading)
    return (
      <div className="h-[280px] flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-pulse">
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-xl">
        Error loading chart
      </div>
    );

  const chartData = data?.list?.slice(0, 8)?.map((item) => ({
    time: item.dt_txt.slice(11, 16),
    temp: Math.round(item.main.temp),
  }));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <span className="text-2xl">📈</span> Temperature Trend
      </h2>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, bottom: 5, left: -20 }}
        >
          {/* X-Axis */}
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />

          {/* Y-Axis */}
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            stroke="#9CA3AF"
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: "#111" }}
            labelStyle={{ color: "#555", fontWeight: "bold" }}
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
            activeDot={{ r: 6 }}
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
    </motion.div>
  );
}
