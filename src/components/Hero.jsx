import React, { useMemo } from 'react'
import HeroImage from '../assets/hero1.jpeg'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { RiRestaurant2Line, RiCupLine, RiStore2Line } from 'react-icons/ri'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import { BiDish } from 'react-icons/bi'
import { FaUtensils } from 'react-icons/fa'

function Hero() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  // Memoize the icons array to prevent recreating on each render
  const icons = useMemo(() => [
    RiRestaurant2Line,
    RiCupLine,
    RiStore2Line,
    MdOutlineRestaurantMenu,
    BiDish,
    FaUtensils
  ], [])

  // Simplified animations for better performance
  const baseAnimation = prefersReducedMotion ? {} : {
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.1, 1],
  }

  return (
    <div className="relative overflow-hidden bg-secondary1 pt-16 md:pt-20">
      {/* Optimized background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
      </div>

      {/* Reduced number of decorative icons for better performance */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-8 p-8 rotate-12">
          {icons.slice(0, 4).map((Icon, index) => (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`${index}-${i}`}
                initial={{ opacity: 0 }}
                animate={baseAnimation}
                transition={{
                  duration: 3,
                  delay: (index + i) * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary text-2xl transform"
              >
                <Icon />
              </motion.div>
            ))
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-6xl mx-auto">
        {/* Text content with optimized animations */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 space-y-6 text-center lg:text-left z-10"
        >
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('hero.title.part1')} <br className="mb-2"/>
            <span className="text-primary block mt-4">{t('hero.title.part2')}</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray_bg max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t('hero.description')}
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
              {t('hero.buttons.getStarted')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-primary/20 hover:border-primary/40 
                text-white rounded-xl font-semibold transition-all duration-300"
            >
              {t('hero.buttons.viewDemo')}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Image section with optimized sizing and animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 mt-8 lg:mt-0 relative z-10"
        >
          <div className="relative w-full max-w-[260px] sm:max-w-[300px] mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary2/20 
              rounded-[2rem] blur-xl opacity-50" />
            
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
              className="relative bg-secondary1/50 p-2 rounded-[2rem] backdrop-blur-sm 
                border border-primary/20 shadow-lg"
            >
              <img 
                src={HeroImage} 
                alt="Menu Interface Preview"
                loading="eager"
                className="w-full h-auto aspect-[3/4] rounded-[1.8rem] shadow-lg object-cover"
              />
              
              {/* Simplified floating element */}
              <div className="absolute -bottom-4 -right-4 bg-secondary1 p-2 sm:p-3 rounded-xl 
                border border-primary/20 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-white text-xs font-medium">{t('hero.liveUpdates')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero