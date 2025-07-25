import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiGlobe, FiAlertCircle } from 'react-icons/fi'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/apiCalls/authApiCalls'
import logo from '../assets/menu.png'
import { useTheme } from '../context/ThemeContext'

function Login() {
  const { darkMode } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [formErrors, setFormErrors] = useState({})

  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Get auth state from Redux
  const { loading, error, user } = useSelector(state => state.auth)

  // Extract email from URL query parameters and password from location state if present
  useEffect(() => {
    // Only run this effect if user is not already logged in
    if (user) return;

    const searchParams = new URLSearchParams(location.search)
    const emailFromURL = searchParams.get('email')
    const passwordFromState = location.state?.password
    const autoLogin = searchParams.get('autoLogin') === 'true'

    // Update form data with values from URL/state if available
    if (emailFromURL || passwordFromState) {
      setFormData(prev => ({
        ...prev,
        ...(emailFromURL && { email: emailFromURL }),
        ...(passwordFromState && { password: passwordFromState })
      }))

      // Auto login if both email and password are available and autoLogin is true
      if (autoLogin && emailFromURL && passwordFromState && !loading) {
        // Use a single dispatch call for login
        dispatch(loginUser({
          email: emailFromURL,
          password: passwordFromState
        }))
      }
    }
  }, [location.search, location.state, dispatch, loading, user])

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      try {
        // Navigate based on user role
        if (user.role === 'admin') {
          navigate('/dashboard')
        } else {
          // For client role, navigate to business page with user ID
          const userId = user._id || user.id
          navigate(`/business${userId ? `/${userId}` : ''}`)
        }
      } catch (error) {
        console.error('Error during navigation:', error)
        // If there's an error, navigate to a safe default route
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  // Handle input changes with debounced validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    const validators = {
      email: [
        {
          isValid: Boolean(formData.email),
          message: t('login.validation.emailRequired')
        },
        {
          isValid: !formData.email || /\S+@\S+\.\S+/.test(formData.email),
          message: t('login.validation.emailInvalid')
        }
      ],
      password: [
        {
          isValid: Boolean(formData.password),
          message: t('login.validation.passwordRequired')
        }
      ]
    }

    // Process all validators
    Object.entries(validators).forEach(([field, rules]) => {
      // Find the first rule that fails
      const failedRule = rules.find(rule => !rule.isValid)
      if (failedRule) {
        errors[field] = failedRule.message
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        // Disable form during submission by setting loading state in Redux
        dispatch(loginUser({
          email: formData.email,
          password: formData.password
        }))
        // Navigation is handled by the useEffect that watches the user state
        // This prevents duplicate navigation logic and makes the code more maintainable
      } catch (error) {
        console.error('Unexpected error during login:', error)
      }
    }
  }

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
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300
      ${darkMode ? 'bg-secondary1' : 'bg-blue-50'}`}>
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-lg
              border-2 transition-colors duration-300
              ${darkMode
                ? 'bg-secondary1/80 border-primary/20 text-white hover:border-primary/40'
                : 'bg-white/80 border-blue-200 text-gray-700 hover:border-blue-300'}`}
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
                className={`absolute top-full right-0 mt-2 border-2 rounded-lg shadow-xl overflow-hidden min-w-[160px]
                  ${darkMode ? 'bg-secondary1 border-primary/20' : 'bg-white border-blue-200'}`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`flex items-center space-x-2 w-full px-4 py-2 text-left transition-colors
                      ${darkMode
                        ? `text-white hover:bg-primary/10 ${i18n.language === lang.code ? 'bg-primary/20' : ''}`
                        : `text-gray-700 hover:bg-blue-100 ${i18n.language === lang.code ? 'bg-blue-200' : ''}`}`}
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
          className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl
            ${darkMode ? 'bg-primary/10' : 'bg-blue-200/30'}`}
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
          className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-xl
            ${darkMode ? 'bg-secondary2/10' : 'bg-blue-100/50'}`}
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
          className={`absolute inset-0 bg-gradient-to-r rounded-2xl blur-xl opacity-50 transform scale-105
            ${darkMode ? 'from-primary/30 to-secondary2/30' : 'from-blue-200/30 to-blue-100/30'}`}
        />

        <motion.div
          initial={{ rotateX: -30 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className={`relative p-8 rounded-2xl border backdrop-blur-xl
            transition-colors duration-300
            ${darkMode
              ? 'bg-secondary1 border-primary/20'
              : 'bg-white/80 border-blue-100'}`}
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
              className={`text-2xl font-bold mb-2
                ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              {t('login.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={darkMode ? 'text-gray_bg' : 'text-gray-600'}
            >
              {t('login.subtitle')}
            </motion.p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className={`text-sm block mb-2
                  ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
                  {t('login.form.email.label')}
                </label>
                <div className="relative">
                  <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2
                    ${darkMode ? 'text-primary' : 'text-primary'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-10 py-3 focus:outline-none transition-colors
                      ${darkMode
                        ? `bg-secondary1 text-white focus:border-primary/40 ${formErrors.email ? 'border-red-500' : 'border-primary/20'}`
                        : `bg-white text-gray-800 focus:border-primary/60 ${formErrors.email ? 'border-red-500' : 'border-blue-200'}`}`}
                    placeholder={t('login.form.email.placeholder')}
                  />
                </div>
                {formErrors.email && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {formErrors.email}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className={`text-sm block mb-2
                  ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
                  {t('login.form.password.label')}
                </label>
                <div className="relative">
                  <FiLock className={`absolute left-3 top-1/2 -translate-y-1/2
                    ${darkMode ? 'text-primary' : 'text-primary'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-10 py-3 focus:outline-none transition-colors
                      ${darkMode
                        ? `bg-secondary1 text-white focus:border-primary/40 ${formErrors.password ? 'border-red-500' : 'border-primary/20'}`
                        : `bg-white text-gray-800 focus:border-primary/60 ${formErrors.password ? 'border-red-500' : 'border-blue-200'}`}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors
                      ${darkMode ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-primary/80'}`}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formErrors.password && (
                  <div className="text-red-500 text-sm mt-1 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {formErrors.password}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className={`flex items-center
                ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 accent-primary"
                />
                {t('login.form.rememberMe')}
              </label>
              <a href="#" className={`transition-colors
                ${darkMode ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-primary/80'}`}>
                {t('login.form.forgotPassword')}
              </a>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-sm flex items-center">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25
                disabled:opacity-70 disabled:cursor-not-allowed
                ${darkMode
                  ? 'bg-primary hover:bg-secondary2 text-white'
                  : 'bg-primary hover:bg-primary/90 text-white'}`}
            >
              {loading ? t('login.form.loading') : t('login.form.submit')}
            </motion.button>

            <p className={`text-center text-sm
              ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
              {t('login.noAccount')}{' '}
              <Link to="/signup" className={`transition-colors font-semibold
                ${darkMode ? 'text-primary hover:text-primary/80' : 'text-primary hover:text-primary/80'}`}>
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