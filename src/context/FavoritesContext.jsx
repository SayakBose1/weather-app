import React, { createContext, useContext, useState } from 'react'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (city) => {
    setFavorites((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Custom hook
export const useFavorites = () => useContext(FavoritesContext)
