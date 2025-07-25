import React from 'react'
import logo from '../assets/menu.png'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

function LoadingSpinner() {
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${
      darkMode
        ? 'bg-gray-900'
        : 'bg-gradient-to-br from-blue-50 to-indigo-50'
    }`}>
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <img
          src={logo}
          alt="Loading..."
          className={`w-full h-full object-contain ${
            darkMode ? 'drop-shadow-[0_0_8px_rgba(55,104,229,0.5)]' : 'drop-shadow-[0_0_8px_rgba(55,104,229,0.3)]'
          }`}
        />
        <div className={`absolute inset-0 rounded-full blur-lg ${
          darkMode
            ? 'bg-gradient-to-r from-primary/30 to-secondary2/30'
            : 'bg-gradient-to-r from-primary/20 to-secondary2/20'
        }`} />
      </motion.div>

      <motion.div
        className={`mt-4 text-sm sm:text-base font-medium ${
          darkMode ? 'text-blue-300' : 'text-blue-600'
        }`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Loading...
      </motion.div>
    </div>
  )
}

export default LoadingSpinner
