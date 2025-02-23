import React from 'react'
import HeroImage from '../assets/hero1.jpeg'
import { motion } from 'framer-motion'

function Hero() {
  return (
    <div className="relative overflow-hidden bg-secondary1 pt-20 md:pt-24"> {/* Added padding top */}
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-7xl mx-auto">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2 space-y-8 text-center lg:text-left z-10"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Elevate Your <br/>
            <span className="text-primary">Menu Experience</span>
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray_bg max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Transform your restaurant's menu into an interactive digital experience. 
            Create, manage, and share your menu instantly with QR codes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-primary hover:bg-secondary2 text-white rounded-xl 
                font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-primary/20 hover:border-primary/40 
                text-white rounded-xl font-semibold transition-all duration-300"
            >
              View Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2 mt-16 lg:mt-0 relative z-10"
        >
          <div className="relative w-full max-w-md mx-auto"> {/* Changed max-w-lg to max-w-md */}
            {/* Decorative elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary2/30 
              rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-500"/>
            
            {/* Main image container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative bg-secondary1/50 p-2 rounded-[2rem] backdrop-blur-sm 
                border border-primary/20 shadow-2xl"
            >
              <img 
                src={HeroImage} 
                alt="Menu Interface Preview" 
                className="w-full h-auto rounded-[1.8rem] shadow-xl object-cover" // Added object-cover
              />
              
              {/* Floating elements */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2
                }}
                className="absolute -bottom-6 -right-6 bg-secondary1 p-4 rounded-2xl 
                  border border-primary/20 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse"/>
                  <p className="text-white text-sm font-medium">Live Updates</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero