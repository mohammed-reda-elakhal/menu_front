import React, { useMemo } from 'react'
import HeroImage from '../assets/hero1.jpeg'
import { useTranslation } from 'react-i18next'
import { RiRestaurant2Line, RiCupLine, RiStore2Line } from 'react-icons/ri'
import { MdOutlineRestaurantMenu } from 'react-icons/md'
import { BiDish } from 'react-icons/bi'
import { FaUtensils } from 'react-icons/fa'

function Hero() {
  const { t } = useTranslation()

  // Memoize the icons array to prevent recreating on each render
  const icons = useMemo(() => [
    RiRestaurant2Line,
    RiCupLine,
    RiStore2Line,
    MdOutlineRestaurantMenu,
    BiDish,
    FaUtensils
  ], [])

  return (
    <div className="relative overflow-hidden bg-secondary1 pt-12 md:pt-16">
      {/* Optimized background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
      </div>

      {/* Reduced number of decorative icons for better performance */}
      <div className="absolute inset-0 opacity-10 pointer-events-none hidden md:block">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-8 p-8 rotate-12">
          {icons.slice(0, 3).map((Icon, index) => (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`${index}-${i}`}
                className="text-primary text-2xl animate-pulse"
              >
                <Icon />
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative min-h-[80vh] sm:min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-3 sm:px-6 lg:px-8 py-6 lg:py-12 max-w-6xl mx-auto">
        {/* Text content */}
        <div className="lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {t('hero.title.part1')} <br className="mb-2"/>
            <span className="text-primary block mt-4">{t('hero.title.part2')}</span>
          </h1>

          <p className="text-base sm:text-lg text-gray_bg max-w-xl mx-auto lg:mx-0 px-4 sm:px-0">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
            <button
              className="px-8 py-4 bg-primary hover:bg-secondary2 active:bg-primary/90 text-white rounded-xl
                font-semibold transition-colors duration-300 shadow-lg hover:shadow-primary/25"
            >
              {t('hero.buttons.getStarted')}
            </button>
            <button
              className="px-8 py-4 border-2 border-primary/20 hover:border-primary/40 active:bg-primary/10
                text-white rounded-xl font-semibold transition-colors duration-300"
            >
              {t('hero.buttons.viewDemo')}
            </button>
          </div>
        </div>

        {/* Image section */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 relative z-10">
          <div className="relative w-full max-w-[220px] sm:max-w-[300px] mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary2/20
              rounded-[2rem] blur-xl opacity-50" />

            <div
              className="relative bg-secondary1/50 p-2 rounded-[2rem] backdrop-blur-sm
                border border-primary/20 shadow-lg hover:shadow-lg transition-shadow duration-300"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero