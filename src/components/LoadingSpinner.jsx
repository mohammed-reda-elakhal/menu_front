import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/menu.png'

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary1">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1,
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-16 h-16 sm:w-20 sm:h-20"
      >
        <img 
          src={logo} 
          alt="Loading..." 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary2/20 rounded-full blur-lg" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0.5, 1, 0.5],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mt-4 text-white/80 text-sm sm:text-base"
      >
        Loading...
      </motion.div>
    </div>
  )
}

export default LoadingSpinner
