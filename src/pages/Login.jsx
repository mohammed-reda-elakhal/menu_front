import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiGlobe } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../assets/menu.png'
import SEO from '../components/SEO'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
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

  return (
    <div className="min-h-screen bg-secondary1 flex items-center justify-center px-4 relative overflow-hidden">
      <SEO
        title="Login | Meniwi"
        description="Log in to your Meniwi account to manage your digital restaurant menu."
        keywords="login, sign in, restaurant menu login, digital menu platform"
        url="https://meniwi.com/login"
      />
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-2 bg-secondary1/80 backdrop-blur-sm px-4 py-2 rounded-lg
              border-2 border-primary/20 text-white hover:border-primary/40 transition-all"
          >
            <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
            <FiGlobe className="w-5 h-5" />
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

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 gap-8 p-8 rotate-12">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 4,
                delay: i * 0.1,
                repeat: Infinity,
              }}
              className="text-primary text-xl"
            >
              •
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md"
      >
        {/* Gradient Background */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary2/30
            rounded-2xl blur-xl opacity-50 transform scale-105"
        />

        <motion.div
          initial={{ rotateX: -30 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative bg-secondary1 p-8 rounded-2xl border border-primary/20 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5
              }}
              className="flex justify-center mb-4"
            >
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <motion.img
                  src={logo}
                  alt="Meniwi Logo"
                  className="h-16 w-auto"
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                />
              </Link>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {t('login.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray_bg"
            >
              {t('login.subtitle')}
            </motion.p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-gray_bg text-sm block mb-2">
                  {t('login.form.email.label')}
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type="email"
                    className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3
                      text-white focus:border-primary/40 focus:outline-none transition-colors"
                    placeholder={t('login.form.email.placeholder')}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-gray_bg text-sm block mb-2">
                  {t('login.form.password.label')}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3
                      text-white focus:border-primary/40 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80
                      transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray_bg">
                <input type="checkbox" className="mr-2 accent-primary" />
                {t('login.form.rememberMe')}
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                {t('login.form.forgotPassword')}
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-secondary2 text-white rounded-xl py-3
                font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              {t('login.form.submit')}
            </motion.button>

            <p className="text-center text-gray_bg text-sm">
              {t('login.noAccount')}{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                {t('login.signupLink')}
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login