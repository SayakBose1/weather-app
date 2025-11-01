import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import WeatherCard from '../components/weather/WeatherCard';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [sortBy, setSortBy] = useState('default'); // default, name, temp

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 px-4"
    >
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-9xl"
      >
        ❤️
      </motion.div>
      
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
          No Favorites Yet
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Start adding cities to your favorites to see them here!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Click the ❤️ icon on any weather card to add it to your favorites
        </p>
      </div>

    </motion.div>
  );

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              ❤️
            </motion.span>
            <motion.h1 
              className="text-5xl md:text-6xl font-black"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #EC4899, #F43F5E, #EF4444, #EC4899)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              My Favorites
            </motion.h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Quick access to weather updates for your favorite cities around the world
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Total Favorites</p>
                <p className="text-4xl font-black">{favorites.length}</p>
              </div>
              <div className="text-5xl">📍</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Cities Tracked</p>
                <p className="text-4xl font-black">{favorites.length}</p>
              </div>
              <div className="text-5xl">🌍</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Live Updates</p>
                <p className="text-4xl font-black flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    •
                  </motion.span>
                  ON
                </p>
              </div>
              <div className="text-5xl">⚡</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Viewing {favorites.length} {favorites.length === 1 ? 'city' : 'cities'}
            </h3>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: 'default', label: 'Default', icon: '⭐' },
                { value: 'name', label: 'Name', icon: '🔤' },
                { value: 'temp', label: 'Temp', icon: '🌡️' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    sortBy === option.value
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold">Pro Tip</h3>
                <p className="text-white/90 text-sm">Click on any card to view detailed forecast and maps</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-bold hover:bg-white/30 transition-all"
            >
              Explore More Cities
            </motion.button>
          </div>
        </motion.div>

        {/* Favorites Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              Your Favorite Cities
            </h2>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {favorites.map((city, index) => (
                <motion.div
                  key={city}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <WeatherCard city={city} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">📊</span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                Did You Know?
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <p className="text-3xl mb-2">🌤️</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Weather updates refresh every 5 minutes
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                <p className="text-3xl mb-2">🔔</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get alerts for severe weather conditions
                </p>
              </div>
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl">
                <p className="text-3xl mb-2">📱</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access your favorites from any device
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add More Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 shadow-2xl text-white text-center"
        >
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-6xl inline-block"
            >
              ➕
            </motion.div>
            <h3 className="text-3xl font-black">Want to add more cities?</h3>
            <p className="text-white/90 max-w-md mx-auto">
              Explore our world map or search for any city to add to your favorites collection
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-green-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                🗺️ Explore Map
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all"
              >
                🏠 Go to Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}