import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { FavoritesProvider } from './context/FavoritesContext'
import { ClerkProvider } from '@clerk/clerk-react'

const queryClient = new QueryClient()
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
)
