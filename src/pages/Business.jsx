import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/apiCalls/authApiCalls'
import { motion } from 'framer-motion'
import { FiLogOut, FiPlus, FiCoffee, FiTrendingUp, FiAward, FiPieChart, FiLoader, FiAlertCircle } from 'react-icons/fi'
import { BsBuildingsFill, BsStars, BsCupHot, BsFillCupFill } from 'react-icons/bs'
import { MdRestaurant, MdFoodBank, MdOutlineDinnerDining, MdCoffeeMaker } from 'react-icons/md'
import { GiCook, GiCoffeeCup, GiKnifeFork, GiCupcake } from 'react-icons/gi'
import logo from '../assets/menu.png'
import { useTranslation } from 'react-i18next'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FiGlobe } from 'react-icons/fi'
import { getBusinessesByPerson, selectBusiness } from '../redux/apiCalls/businessApiCalls'
import CreateBusinessModal from '../components/modals/CreateBusinessModal'
import { useTheme } from '../context/ThemeContext'

const Business = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userId } = useParams()
  const { t, i18n } = useTranslation()
  const { darkMode } = useTheme()
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { user } = useSelector(state => state.auth)
  const { businesses: apiBusinesses, loading, error } = useSelector(state => state.business)

  // Handle logout with smooth transition and direct navigation
  const handleLogout = () => {
    setIsTransitioning(true);

    const logoutAnimation = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Show animation for 0.8s
      dispatch(logoutUser());
      setTimeout(() => {
        navigate('/login', { replace: true }); // Redirect after logout
      }, 200); // Small delay to ensure Redux state is cleared
    };

    logoutAnimation();
  };

  // Effect to handle user ID from params or from Redux state
  useEffect(() => {
    // If user is admin, they can access the dashboard directly
    if (user?.role === 'admin') {
      console.log('Admin user detected, can navigate to dashboard directly');
      // Optionally, redirect admin users directly to the dashboard
      // navigate('/dashboard')
      return;
    }

    // For non-admin users, handle business selection
    if (userId) {
      dispatch(getBusinessesByPerson(userId));
    } else if (user) {
      // If no userId in URL but we have a user in Redux state, redirect to the correct URL
      const currentUserId = user._id || user.id;
      if (currentUserId) {
        console.log('Redirecting to business page with user ID from Redux state');
        navigate(`/business/${currentUserId}`, { replace: true });
      }
    }
  }, [userId, user, navigate, dispatch]);

  // Language options
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  // Fallback data in case API data is not available
  const fallbackBusinesses = [
  ]

  // Use API data if available, otherwise use fallback data
  const businesses = apiBusinesses && apiBusinesses.length > 0 ? apiBusinesses : fallbackBusinesses

  const handleBusinessSelect = async (business) => {
    // Save selected business to Redux and localStorage
    dispatch(selectBusiness(business))

    // Update local state for animation
    setSelectedBusiness(business)
    setIsTransitioning(true)

    // Navigate to dashboard after animation (without business ID in URL)
    setTimeout(() => {
      navigate('/dashboard')
    }, 2000)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300
                   ${darkMode ? 'bg-secondary1' : 'bg-gray-50'}`}>
      {/* Overlay that appears when transitioning */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`fixed inset-0 backdrop-blur-sm z-50 transition-colors duration-300
                    ${darkMode ? 'bg-secondary1/90' : 'bg-gray-800/80'}`}
        >
          {/* Logout animation - only shown when logging out (no selectedBusiness) */}
          {!selectedBusiness && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className={`text-4xl mb-4 transition-colors duration-300
                          ${darkMode ? 'text-primary' : 'text-blue-500'}`}
              >
                <FiLogOut />
              </motion.div>
              <p className={`text-base font-medium transition-colors duration-300
                           ${darkMode ? 'text-white' : 'text-white'}`}>
                {t('business.loggingOut') || 'Logging out...'}
              </p>
            </motion.div>
          )}
        </motion.div>
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
            className={`relative w-36 h-36 mb-4 rounded-xl p-4 backdrop-blur-sm border-2 transition-colors duration-300
                      ${darkMode
                        ? 'bg-white/5 border-primary/30'
                        : 'bg-white/80 border-blue-300/50'}`}
            animate={{
              boxShadow: darkMode
                ? [
                    "0 0 20px rgba(55,104,229,0.3)",
                    "0 0 40px rgba(55,104,229,0.6)",
                    "0 0 20px rgba(55,104,229,0.3)"
                  ]
                : [
                    "0 0 20px rgba(59,130,246,0.2)",
                    "0 0 40px rgba(59,130,246,0.4)",
                    "0 0 20px rgba(59,130,246,0.2)"
                  ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <img
              src={selectedBusiness.logo?.url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
              alt={selectedBusiness.nom}
              className="w-full h-full object-contain rounded-xl shadow-lg"
            />
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <span className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
              Loading
            </span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors duration-300
                             ${darkMode ? 'bg-primary' : 'bg-blue-500'}`} />
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce delay-100 transition-colors duration-300
                             ${darkMode ? 'bg-primary' : 'bg-blue-500'}`} />
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce delay-200 transition-colors duration-300
                             ${darkMode ? 'bg-primary' : 'bg-blue-500'}`} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Existing blur effects */}
        <div className={`absolute top-0 -left-4 w-64 h-64 rounded-full blur-[80px] transition-colors duration-300
                       ${darkMode ? 'bg-primary/10' : 'bg-blue-500/10'}`} />
        <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[80px] transition-colors duration-300
                       ${darkMode ? 'bg-primary/10' : 'bg-blue-500/10'}`} />

        {/* Main decorative icons */}
        <BsBuildingsFill className={`text-[200px] absolute -right-20 -top-20 animate-pulse transition-colors duration-300
                                   ${darkMode ? 'text-primary/10' : 'text-blue-500/10'}`} />
        <BsStars className={`text-[150px] absolute left-10 bottom-20 animate-bounce transition-colors duration-300
                           ${darkMode ? 'text-primary/10' : 'text-blue-500/10'}`} />

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
                className={`text-2xl sm:text-3xl lg:text-4xl transform transition-colors duration-300
                          ${darkMode ? 'text-primary' : 'text-blue-500'}`}
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Updated header with fixed padding and logo */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-10 transition-colors duration-300
                        ${darkMode
                          ? 'bg-secondary1/80 border-primary/10'
                          : 'bg-white/80 border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto"
              />

            <div className={`h-5 w-px transition-colors duration-300 ${darkMode ? 'bg-primary/20' : 'bg-gray-300'}`} /> {/* Divider */}

              <span className={`font-bold text-xl transition-colors duration-300 ${darkMode ? 'text-primary' : 'text-blue-600'}`}>
                Meniwi
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <Menu as="div" className="relative">
              <Menu.Button className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-300
                                     ${darkMode
                                       ? 'text-gray_bg hover:text-primary hover:bg-primary/5'
                                       : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
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
                <Menu.Items className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg transition-colors duration-300
                                      ${darkMode
                                        ? 'bg-secondary1 border border-primary/20'
                                        : 'bg-white border border-gray-200'}`}>
                  <div className="py-1">
                    {languages.map((language) => (
                      <Menu.Item key={language.code}>
                        {({ active }) => (
                          <button
                            onClick={() => i18n.changeLanguage(language.code)}
                            className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-300
                                      ${active
                                        ? darkMode ? 'bg-primary/10' : 'bg-blue-50'
                                        : ''}
                                      ${i18n.language === language.code
                                        ? darkMode ? 'text-primary' : 'text-blue-600'
                                        : darkMode ? 'text-gray_bg' : 'text-gray-600'}`}
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


            {/* Dashboard Button - only for admin users */}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-300
                          ${darkMode
                            ? 'text-gray_bg hover:text-primary hover:bg-primary/5'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
                <FiPieChart className="w-4 h-4" />
                <span>{t('business.dashboard') || 'Dashboard'}</span>
              </button>
            )}

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-300
                        ${darkMode
                          ? 'text-gray_bg hover:text-primary hover:bg-primary/5'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
              <motion.div
                className="w-4 h-4"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <FiLogOut />
              </motion.div>
              <span>{t('business.logout')}</span>
            </motion.button>
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
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 transition-colors duration-300
                        ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('business.title')}
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto transition-colors duration-300
                       ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('business.description')}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <FiLoader className={`text-3xl animate-spin mb-4 transition-colors duration-300
                                  ${darkMode ? 'text-primary' : 'text-blue-500'}`} />
              <p className={`transition-colors duration-300 ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                Loading your businesses...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center py-12">
            <div className={`flex flex-col items-center text-center p-6 rounded-xl transition-colors duration-300
                           ${darkMode
                             ? 'bg-secondary1/50 border border-red-500/20'
                             : 'bg-white/90 border border-red-200 shadow-lg'}`}>
              <FiAlertCircle className="text-red-500 text-3xl mb-4" />
              <p className={`mb-2 font-semibold transition-colors duration-300
                           ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                Failed to load businesses
              </p>
              <p className={`text-sm max-w-md transition-colors duration-300
                           ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* No Businesses State */}
        {!loading && !error && businesses.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className={`flex flex-col items-center text-center p-8 rounded-xl transition-colors duration-300
                           ${darkMode
                             ? 'bg-secondary1/50 border border-primary/20'
                             : 'bg-white/90 border border-blue-100 shadow-lg'}`}>
              <BsBuildingsFill className={`text-5xl mb-4 transition-colors duration-300
                                         ${darkMode ? 'text-primary/50' : 'text-blue-400'}`} />
              <p className={`text-lg mb-2 font-semibold transition-colors duration-300
                           ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('business.noBusiness.title') || 'No businesses found'}
              </p>
              <p className={`text-sm max-w-md mb-6 transition-colors duration-300
                           ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                {t('business.noBusiness.description') || 'Create your first business to get started'}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>{t('business.create.firstBusiness') || 'Create Your First Business'}</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Business Grid */}
        {!loading && !error && businesses.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {/* Business cards */}
            {businesses.map((business) => (
              <motion.div
                key={business._id}
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
                className={`group backdrop-blur-sm rounded-xl
                  shadow-lg hover:shadow-xl
                  transition-all duration-300 p-4 sm:p-5 cursor-pointer
                  transform-gpu perspective-1000 h-full
                  ${selectedBusiness?._id === business._id ? 'opacity-0' : ''}
                  ${darkMode
                    ? 'bg-secondary1/50 border border-primary/20 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(55,104,229,0.1)]'
                    : 'bg-white/90 border border-blue-100 hover:border-blue-300 hover:shadow-blue-100/30'}`}
            >
              <div className="relative mb-2 sm:mb-3">
                {/* Enhanced glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className={`absolute -inset-1 rounded-full blur-xl opacity-0 group-hover:opacity-75
                              transition-all duration-500 animate-gradient
                              ${darkMode
                                ? 'bg-gradient-to-r from-primary/20 via-secondary2/20 to-primary/20'
                                : 'bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-blue-400/20'}`}
                />

                {/* Image container with enhanced 3D effect - now with rounded-xl like the card */}
                <div className={`relative aspect-square overflow-hidden rounded-xl
                                 w-full max-w-[120px] mx-auto p-3
                                 transform-gpu backdrop-blur-sm
                                 ${darkMode
                                   ? 'border-2 border-primary/20 group-hover:border-primary/40 bg-white/5 group-hover:shadow-[0_0_20px_rgba(55,104,229,0.2)]'
                                   : 'border-2 border-blue-100 group-hover:border-blue-200 bg-white/80 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'}`}
                >
                  <motion.img
                    src={business.logo?.url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                    alt={business.nom}
                    className="w-full h-full object-contain"
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

                  {/* Enhanced overlay - now with rounded-xl to match container */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute inset-0 flex items-end justify-center pb-2
                                transform-gpu backdrop-blur-[2px] rounded-xl
                                ${darkMode
                                  ? 'bg-gradient-to-t from-primary/80 via-primary/50 to-transparent'
                                  : 'bg-gradient-to-t from-blue-500/80 via-blue-500/50 to-transparent'}`}
                  >
                    <span className="text-white text-xs font-medium
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {business.type?.nom || business.type || 'Business'}
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
                <h3 className={`font-semibold text-sm sm:text-base truncate px-1 transition-colors duration-300
                                ${darkMode
                                  ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                                  : 'text-gray-800'}`}>
                  {business.nom}
                </h3>
                <p className={`text-xs sm:text-sm truncate opacity-80 group-hover:opacity-100 transition-all
                               ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  {business.type?.nom || business.type || 'Business'}
                </p>
              </motion.div>
            </motion.div>
          ))}

          {/* Add business card - made more compact */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className={`group backdrop-blur-sm rounded-xl border-2 border-dashed
                        shadow-lg hover:shadow-xl transition-all duration-300
                        p-2 sm:p-3 cursor-pointer flex flex-col items-center justify-center
                        aspect-square
                        ${darkMode
                          ? 'bg-secondary1/50 border-primary/30 hover:border-primary/50'
                          : 'bg-white/80 border-blue-200 hover:border-blue-300'}`}
          >

            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className={`absolute -inset-3 rounded-full blur-lg
                            ${darkMode
                              ? 'bg-gradient-to-r from-primary/20 to-secondary2/20'
                              : 'bg-gradient-to-r from-blue-400/20 to-blue-500/20'}`}
              />
              <div className={`relative text-3xl sm:text-4xl mb-1 transition-colors duration-300
                               ${darkMode ? 'text-primary' : 'text-blue-500'}`}>
                <FiPlus />
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              className={`relative text-xs sm:text-sm font-medium mt-1 transition-colors duration-300
                          ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}
            >
              {t('business.addNew')}
            </motion.p>
          </motion.div>
        </div>
        )}

        {/* Added Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-12 pt-8 border-t transition-colors duration-300
                    ${darkMode ? 'border-primary/10' : 'border-gray-200'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-4 rounded-xl transition-colors duration-300
                        ${darkMode
                          ? 'bg-secondary1/30'
                          : 'bg-white/80 shadow-sm border border-blue-50'}`}
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
                className={`text-3xl mb-3 transition-colors duration-300
                          ${darkMode ? 'text-primary' : 'text-blue-500'}`}
              >
                <FiTrendingUp />
              </motion.div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300
                            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('business.features.growth.title')}
              </h3>
              <p className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                {t('business.features.growth.description')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-4 rounded-xl transition-colors duration-300
                        ${darkMode
                          ? 'bg-secondary1/30'
                          : 'bg-white/80 shadow-sm border border-blue-50'}`}
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
                className={`text-3xl mb-3 transition-colors duration-300
                          ${darkMode ? 'text-primary' : 'text-blue-500'}`}
              >
                <FiAward />
              </motion.div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300
                            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('business.features.experience.title')}
              </h3>
              <p className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                {t('business.features.experience.description')}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-4 rounded-xl transition-colors duration-300
                        ${darkMode
                          ? 'bg-secondary1/30'
                          : 'bg-white/80 shadow-sm border border-blue-50'}`}
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
                className={`text-3xl mb-3 transition-colors duration-300
                          ${darkMode ? 'text-primary' : 'text-blue-500'}`}
              >
                <FiPieChart />
              </motion.div>
              <h3 className={`font-semibold mb-2 transition-colors duration-300
                            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('business.features.analytics.title')}
              </h3>
              <p className={`text-sm transition-colors duration-300
                           ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                {t('business.features.analytics.description')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Create Business Modal */}
      <CreateBusinessModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userId={userId || (user && (user.id || user._id))}
      />
    </div>
  )
}

export default Business
