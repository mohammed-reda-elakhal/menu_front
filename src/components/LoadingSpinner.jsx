import React from 'react'
import logo from '../assets/menu.png'

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary1">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 animate-spin-slow">
        <img
          src={logo}
          alt="Loading..."
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary2/20 rounded-full blur-lg" />
      </div>
      <div className="mt-4 text-white/80 text-sm sm:text-base animate-pulse">
        Loading...
      </div>
    </div>
  )
}

export default LoadingSpinner
