import React from 'react'
import { useFavorites } from '../../context/FavoritesContext'

export default function FavoriteButton({ city }) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFav = favorites.includes(city)

  return (
    <button
      onClick={() => toggleFavorite(city)}
      className={`text-lg ${isFav ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition`}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  )
}
