import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiGlobe } from 'react-icons/fi'
import { RiRestaurant2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import restaurantImage from '../assets/menu_cover1.jpg' // Add your image
import logo from '../assets/menu.png'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { t, i18n } = useTranslation()

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  const changeLang = (code) => {
    i18n.changeLanguage(code)
    setShowLangMenu(false)
  }

  // Updated input fields with translations
  const inputFields = [
    {
      id: 'restaurant',
      label: t('signup.form.restaurant.label'),
      type: 'text',
      placeholder: t('signup.form.restaurant.placeholder'),
      icon: FiUser,
    },
    {
      id: 'email',
      label: t('signup.form.email.label'),
      type: 'email',
      placeholder: t('signup.form.email.placeholder'),
      icon: FiMail,
    },
    {
      id: 'password',
      label: t('signup.form.password.label'),
      type: showPassword ? 'text' : 'password',
      placeholder: t('signup.form.password.placeholder'),
      icon: FiLock,
    },
  ]

  // Replace your existing form inputs with this
  const renderInputs = () => (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {inputFields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: focusedInput === null ? 1 : focusedInput === field.id ? 1 : 0.5,
            x: 0,
            scale: focusedInput === field.id ? 1.02 : 1,
          }}
          transition={{ 
            delay: 0.2 * index,
            duration: 0.2
          }}
        >
          <label className="text-gray_bg text-xs sm:text-sm block mb-1 sm:mb-1.5 md:mb-2">{field.label}</label>
          <div className="relative">
            <field.icon className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 transition-colors duration-300
              text-base sm:text-lg md:text-xl ${focusedInput === field.id ? 'text-primary' : 'text-primary/50'}`} 
            />
            <input
              type={field.type}
              className={`w-full bg-secondary1 border-2 rounded-lg sm:rounded-xl px-8 sm:px-9 md:px-10 py-2 sm:py-2.5 md:py-3 
                text-sm sm:text-base text-white transition-all duration-300
                ${focusedInput === field.id 
                  ? 'border-primary shadow-lg shadow-primary/10' 
                  : 'border-primary/20'}`}
              placeholder={field.placeholder}
              onFocus={() => setFocusedInput(field.id)}
              onBlur={() => setFocusedInput(null)}
            />
            {field.id === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300
                  ${focusedInput === 'password' ? 'text-primary' : 'text-primary/50'}`}
              >
                {showPassword ? <FiEyeOff className="text-lg sm:text-xl" /> : <FiEye className="text-lg sm:text-xl" />}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-secondary1 flex relative">
      {/* Language Selector */}
      <div className="fixed top-2 right-2 z-50 sm:top-6 sm:right-6">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-2 bg-secondary1/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg 
              border-2 border-primary/20 text-white hover:border-primary/40 transition-all"
          >
            <span className="text-sm sm:text-base">{languages.find(lang => lang.code === i18n.language)?.flag}</span>
            <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full right-0 mt-2 bg-secondary1 border-2 border-primary/20 
                  rounded-lg shadow-xl overflow-hidden min-w-[160px]"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`flex items-center space-x-2 w-full px-4 py-2 text-left text-white 
                      hover:bg-primary/10 transition-colors
                      ${i18n.language === lang.code ? 'bg-primary/20' : ''}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 -left-4 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-primary/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[60px]" />
      </div>

      {/* Decorative Section */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-secondary1 via-secondary1/95 to-secondary1"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary2/10 rounded-full blur-xl"
          />
        </div>

        {/* Decorative Icons Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-6 gap-8 p-8 rotate-12">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 4,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
                className="text-primary text-2xl"
              >
                <RiRestaurant2Line />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex items-center px-12">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <img 
                  src={logo} 
                  alt="Menuso Logo" 
                  className="h-12 w-auto"
                />
                <h2 className="text-4xl font-bold text-white">
                  Menuso
                </h2>
              </Link>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiUser className="text-primary text-xl" />
                </div>
                <p className="text-gray_bg">{t('signup.features.menu')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMail className="text-primary text-xl" />
                </div>
                <p className="text-gray_bg">{t('signup.features.updates')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiLock className="text-primary text-xl" />
                </div>
                <p className="text-gray_bg">{t('signup.features.security')}</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-primary/5 p-6 rounded-xl border border-primary/10"
            >
              <p className="text-gray_bg italic">{t('signup.quote')}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Form Section */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px]"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary2/30 
              rounded-2xl blur-xl opacity-50 transform rotate-6 scale-105" />

            <motion.div
              initial={{ rotateX: -30 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative bg-secondary1 p-4 sm:p-6 md:p-8 rounded-2xl border border-primary/20 backdrop-blur-xl"
            >
              {/* Form Header */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-2 sm:mb-3 md:mb-4"
                >
                  <Link to="/" className="hover:opacity-80 transition-opacity">
                    <img 
                      src={logo} 
                      alt="Menuso Logo" 
                      className="h-8 sm:h-10 md:h-12 w-auto"
                    />
                  </Link>
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{t('signup.title')}</h2>
                <p className="text-xs sm:text-sm md:text-base text-gray_bg">{t('signup.subtitle')}</p>
              </div>

              {/* Signup Form */}
              <form className="space-y-5 sm:space-y-6">
                {renderInputs()}

                <div className="flex items-start sm:items-center">
                  <input type="checkbox" className="mt-1 sm:mt-0 mr-2 accent-primary" />
                  <label className="text-xs sm:text-sm text-gray_bg">
                    {t('signup.form.terms.text')}{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      {t('signup.form.terms.termsLink')}
                    </a>
                    {' '}{t('signup.form.terms.and')}{' '}
                    <a href="#" className="text-primary hover:text-primary/80">
                      {t('signup.form.terms.privacyLink')}
                    </a>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-secondary2 text-white rounded-lg sm:rounded-xl py-2 sm:py-2.5 md:py-3 
                    text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                  {t('signup.form.submit')}
                </motion.button>

                <p className="text-center text-gray_bg text-xs sm:text-sm mt-3 sm:mt-4">
                  {t('signup.form.login.text')}{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                    {t('signup.form.login.link')}
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup