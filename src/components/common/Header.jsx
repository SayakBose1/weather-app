import React from 'react'
import { motion } from 'framer-motion'
import { useFavorites } from '../../context/FavoritesContext'
import Button from '../ui/Button'

export default function Header({ dark, setDark, toggleView, viewFavorites }) {
  const { favorites } = useFavorites()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Weathero</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Favorites: {favorites.length}
          </span>
          <Button onClick={() => setDark(!dark)}>{dark ? 'Light Mode' : 'Dark Mode'}</Button>
          <Button onClick={toggleView}>{viewFavorites ? 'Home' : 'Favorites'}</Button>
        </div>
      </div>
    </motion.header>
  )
}
