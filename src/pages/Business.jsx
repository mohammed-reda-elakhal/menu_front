import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogOut, FiPlus, FiCoffee, FiTrendingUp, FiAward, FiPieChart } from 'react-icons/fi'
import { BsBuildingsFill, BsStars, BsCupHot, BsFillCupFill } from 'react-icons/bs'
import { MdRestaurant, MdFoodBank, MdOutlineDinnerDining, MdCoffeeMaker } from 'react-icons/md'
import { GiCook, GiCoffeeCup, GiKnifeFork, GiCupcake } from 'react-icons/gi'
import logo from '../assets/menu.png'
import { useTranslation } from 'react-i18next'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FiGlobe } from 'react-icons/fi'

const Business = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Language options
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  // Enhanced fake data with real-looking images
  const businesses = [
    {
      id: 1,
      name: "Le Gourmet Restaurant",
      image: "https://cdn-icons-png.flaticon.com/512/4063/4063770.png",
      type: "Fine Dining"
    },
    {
      id: 2,
      name: "Café Parisien",
      image: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
      type: "Café"
    },
    {
      id: 3,
      name: "Sushi Master",
      image: "https://cdn-icons-png.flaticon.com/512/2252/2252075.png",
      type: "Japanese"
    },
    {
      id: 4,
      name: "Pizza Palace",
      image: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
      type: "Italian"
    },
    {
      id: 5,
      name: "Burger House",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
      type: "Fast Food"
    },
    {
      id: 6,
      name: "Tea Corner",
      image: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png",
      type: "Tea House"
    }
  ]

  const handleBusinessSelect = async (business) => {
    setSelectedBusiness(business)
    setIsTransitioning(true)

    setTimeout(() => {
      navigate(`/dashboard/${business.id}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-secondary1 relative overflow-hidden">
      {/* Overlay that appears when transitioning */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-secondary1/90 backdrop-blur-sm z-50"
        />
      )}

      {/* Selected business animation */}
      {selectedBusiness && isTransitioning && (
        <motion.div
          initial={{
            position: 'fixed',
            scale: 0.5,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            zIndex: 51
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="relative w-32 h-32 mb-4 rounded-xl "
            animate={{
              boxShadow: [
                "0 0 20px rgba(55,104,229,0.3)",
                "0 0 40px rgba(55,104,229,0.6)",
                "0 0 20px rgba(55,104,229,0.3)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <img
              src={selectedBusiness.image}
              alt={selectedBusiness.name}
              className="w-full h-full rounded-full object-cover rounded-xl shadow-lg"
            />
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-gray_bg text-sm">Loading</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Existing blur effects */}
        <div className="absolute top-0 -left-4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />

        {/* Main decorative icons */}
        <BsBuildingsFill className="text-primary/10 text-[200px] absolute -right-20 -top-20 animate-pulse" />
        <BsStars className="text-primary/10 text-[150px] absolute left-10 bottom-20 animate-bounce" />

        {/* Added decorative food icons */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-8 p-8 rotate-12">
            {[
              MdRestaurant, GiCoffeeCup, MdFoodBank, GiCook,
              BsCupHot, GiKnifeFork, MdOutlineDinnerDining,
              BsFillCupFill, GiCupcake, MdCoffeeMaker, FiCoffee
            ].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary text-2xl sm:text-3xl lg:text-4xl transform"
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Updated header with fixed padding and logo */}
      <header className="bg-secondary1/80 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto"
              />

            <div className="h-5 w-px bg-primary/20" /> {/* Divider */}

              <span className="text-primary font-bold text-xl">Meniwi</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 text-sm text-gray_bg
                hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                <FiGlobe className="w-4 h-4" />
                <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-secondary1
                  border border-primary/20 shadow-lg">
                  <div className="py-1">
                    {languages.map((language) => (
                      <Menu.Item key={language.code}>
                        {({ active }) => (
                          <button
                            onClick={() => i18n.changeLanguage(language.code)}
                            className={`flex items-center w-full px-4 py-2 text-sm
                              ${active ? 'bg-primary/10' : ''}
                              ${i18n.language === language.code ? 'text-primary' : 'text-gray_bg'}`}
                          >
                            <span className="mr-2">{language.flag}</span>
                            <span>{language.label}</span>
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Logout Button */}
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray_bg
              hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
              <FiLogOut className="w-4 h-4" />
              <span>{t('business.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content - adjusted grid and spacing */}
      <main className="container mx-auto p-3 sm:p-4 lg:p-6">
        {/* Added Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {t('business.title')}
          </h2>
          <p className="text-gray_bg text-sm sm:text-base max-w-2xl mx-auto">
            {t('business.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {/* Business cards - made more compact */}
          {businesses.map((business) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
                y: -5
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBusinessSelect(business)}
              className={`group bg-secondary1/50 backdrop-blur-sm rounded-xl
                border border-primary/20 hover:border-primary/40
                shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                hover:shadow-[0_8px_30px_rgba(55,104,229,0.1)]
                transition-all duration-300 p-2 sm:p-3 cursor-pointer
                transform-gpu perspective-1000
                ${selectedBusiness?.id === business.id ? 'opacity-0' : ''}`}
            >
              <div className="relative mb-2 sm:mb-3">
                {/* Enhanced glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary2/20 to-primary/20
                    rounded-full blur-xl opacity-0 group-hover:opacity-75
                    transition-all duration-500 animate-gradient"
                />

                {/* Image container with enhanced 3D effect */}
                <div className="relative aspect-square overflow-hidden rounded-full
                  border-2 border-primary/20 group-hover:border-primary/40
                  w-full max-w-[100px] mx-auto
                  transform-gpu group-hover:shadow-[0_0_20px_rgba(55,104,229,0.2)]"
                >
                  <motion.img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover"
                    whileHover={{
                      scale: 1.15,
                      rotate: 5
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    loading="lazy"
                  />

                  {/* Enhanced overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t
                      from-primary/80 via-primary/50 to-transparent
                      flex items-end justify-center pb-2
                      transform-gpu backdrop-blur-[2px]"
                  >
                    <span className="text-white text-xs font-medium
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {business.type}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced business info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-1"
              >
                <h3 className="text-white font-semibold text-sm sm:text-base
                  truncate px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {business.name}
                </h3>
                <p className="text-gray_bg text-xs sm:text-sm truncate
                  opacity-80 group-hover:opacity-100 transition-opacity">
                  {business.type}
                </p>
              </motion.div>
            </motion.div>
          ))}

          {/* Add business card - made more compact */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-secondary1/50 backdrop-blur-sm rounded-xl
              border-2 border-dashed border-primary/30 hover:border-primary/50
              shadow-lg hover:shadow-xl transition-all duration-300
              p-2 sm:p-3 cursor-pointer flex flex-col items-center justify-center
              aspect-square"
          >
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -inset-3 bg-gradient-to-r from-primary/20 to-secondary2/20
                  rounded-full blur-lg"
              />
              <FiPlus className="relative text-3xl sm:text-4xl text-primary mb-1" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              className="relative text-gray_bg text-xs sm:text-sm font-medium mt-1"
            >
              {t('business.addNew')}
            </motion.p>
          </motion.div>
        </div>

        {/* Added Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-primary/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-4"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary text-3xl mb-3"
              >
                <FiTrendingUp />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">
                {t('business.features.growth.title')}
              </h3>
              <p className="text-gray_bg text-sm">
                {t('business.features.growth.description')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary text-3xl mb-3"
              >
                <FiAward />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">
                {t('business.features.experience.title')}
              </h3>
              <p className="text-gray_bg text-sm">
                {t('business.features.experience.description')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-4"
            >
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary text-3xl mb-3"
              >
                <FiPieChart />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">
                {t('business.features.analytics.title')}
              </h3>
              <p className="text-gray_bg text-sm">
                {t('business.features.analytics.description')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Business
