import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiGlobe, FiAlertCircle, FiPhone, FiMapPin, FiCreditCard } from 'react-icons/fi'
import { RiRestaurant2Line } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../redux/apiCalls/authApiCalls'
import { useTheme } from '../context/ThemeContext'
import logo from '../assets/menu.png'

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { darkMode } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const { t, i18n } = useTranslation()

  const { loading, error, user } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    tele: '',
    ville: '',
    cin: ''
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (user) {
      try {
        if (user.role === 'admin') {
          navigate('/dashboard')
        } else {
          const userId = user._id || user.id
          navigate(`/business${userId ? `/${userId}` : ''}`)
        }
      } catch (error) {
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nom.trim()) errors.nom = t('signup.validation.nameRequired')
    if (!formData.email.trim()) errors.email = t('signup.validation.emailRequired')
    if (!formData.password.trim()) errors.password = t('signup.validation.passwordRequired')
    if (!formData.tele.trim()) errors.tele = t('signup.validation.phoneRequired')
    if (!formData.ville.trim()) errors.ville = t('signup.validation.cityRequired')
    if (!formData.cin.trim()) errors.cin = t('signup.validation.cinRequired')

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('signup.validation.emailInvalid')
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = t('signup.validation.passwordTooShort')
    }

    if (!agreeToTerms) {
      errors.terms = t('signup.validation.termsRequired')
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        dispatch(registerUser({
          ...formData,
          profile: {
            url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            publicId: 'default_profile'
          }
        }))
          .then(result => {
            if (result && result.success) {
              alert(t('signup.success') || 'Registration successful!')

              if (result.autoLogin) {
                if (result.role === 'admin') {
                  navigate('/dashboard')
                } else {
                  const userId = result.user?._id || result.user?.id
                  navigate(`/business/${userId}`)
                }
              } else {
                navigate(`/login?email=${encodeURIComponent(formData.email)}`)
              }
            }
          })
          .catch(error => {
            console.error('Error during registration dispatch:', error)
          })
      } catch (error) {
        console.error('Unexpected error during registration:', error)
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

  const inputFields = [
    {
      id: 'nom',
      name: 'nom',
      label: t('signup.form.name.label'),
      type: 'text',
      placeholder: t('signup.form.name.placeholder'),
      icon: FiUser,
      value: formData.nom,
      error: formErrors.nom
    },
    {
      id: 'email',
      name: 'email',
      label: t('signup.form.email.label'),
      type: 'email',
      placeholder: t('signup.form.email.placeholder'),
      icon: FiMail,
      value: formData.email,
      error: formErrors.email
    },
    {
      id: 'password',
      name: 'password',
      label: t('signup.form.password.label'),
      type: showPassword ? 'text' : 'password',
      placeholder: t('signup.form.password.placeholder'),
      icon: FiLock,
      value: formData.password,
      error: formErrors.password
    },
    {
      id: 'tele',
      name: 'tele',
      label: t('signup.form.phone.label'),
      type: 'tel',
      placeholder: t('signup.form.phone.placeholder'),
      icon: FiPhone,
      value: formData.tele,
      error: formErrors.tele
    },
    {
      id: 'ville',
      name: 'ville',
      label: t('signup.form.city.label'),
      type: 'text',
      placeholder: t('signup.form.city.placeholder'),
      icon: FiMapPin,
      value: formData.ville,
      error: formErrors.ville
    },
    {
      id: 'cin',
      name: 'cin',
      label: t('signup.form.cin.label'),
      type: 'text',
      placeholder: t('signup.form.cin.placeholder'),
      icon: FiCreditCard,
      value: formData.cin,
      error: formErrors.cin
    }
  ]

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
            delay: 0.1 * index,
            duration: 0.2
          }}
        >
          <label className={`text-xs sm:text-sm block mb-1 sm:mb-1.5 md:mb-2 ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>{field.label}</label>
          <div className="relative">
            <field.icon className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 transition-colors duration-300
              text-base sm:text-lg md:text-xl ${focusedInput === field.id ? 'text-primary' : 'text-primary/50'}`}
            />
            <input
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={handleChange}
              className={`w-full border-2 rounded-lg sm:rounded-xl px-8 sm:px-9 md:px-10 py-2 sm:py-2.5 md:py-3
                text-sm sm:text-base transition-all duration-300
                ${darkMode
                  ? 'bg-secondary1 text-white border-primary/20 focus:border-primary/40'
                  : 'bg-white text-gray-800 border-blue-200 focus:border-blue-400'}
                ${field.error ? 'border-red-500' : ''}`}
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
          {field.error && (
            <div className="text-red-500 text-xs mt-1 flex items-center">
              <FiAlertCircle className="mr-1" />
              {field.error}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className={`min-h-screen flex relative transition-colors duration-300
      ${darkMode ? 'bg-secondary1' : 'bg-blue-50'}`}>

      <div className="fixed top-2 right-2 z-50 sm:top-6 sm:right-6">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            className={`flex items-center space-x-2 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg
              border-2 transition-colors duration-300
              ${darkMode
                ? 'bg-secondary1/80 border-primary/20 text-white hover:border-primary/40'
                : 'bg-white/80 border-blue-200 text-gray-700 hover:border-blue-300'}`}
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
                className={`absolute top-full right-0 mt-2 border-2 rounded-lg shadow-xl overflow-hidden min-w-[160px]
                  transition-colors duration-300
                  ${darkMode ? 'bg-secondary1 border-primary/20' : 'bg-white border-blue-200'}`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`flex items-center space-x-2 w-full px-4 py-2 text-left transition-colors
                      ${darkMode
                        ? 'text-white hover:bg-primary/10'
                        : 'text-gray-700 hover:bg-blue-50'}
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

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className={`hidden lg:block lg:w-[45%] xl:w-1/2 relative overflow-hidden
          transition-colors duration-300
          ${darkMode
            ? 'bg-gradient-to-br from-secondary1 via-secondary1/95 to-secondary1'
            : 'bg-gradient-to-br from-blue-100/50 via-primary/5 to-white'}`}
      >
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
            className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl ${
              darkMode ? 'bg-primary/10' : 'bg-primary/20'
            }`}
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
            className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-xl ${
              darkMode ? 'bg-secondary2/10' : 'bg-primary/15'
            }`}
          />
        </div>

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
                className={`text-2xl ${darkMode ? 'text-primary' : 'text-primary/70'}`}
              >
                <RiRestaurant2Line />
              </motion.div>
            ))}
          </div>
        </div>

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
                  alt="Meniwi Logo"
                  className="h-12 w-auto"
                />
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-primary'}`}>
                  Meniwi
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
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/10' : 'bg-primary/20'}`}>
                  <FiUser className="text-primary text-xl" />
                </div>
                <p className={darkMode ? 'text-gray_bg' : 'text-gray-700'}>{t('signup.features.menu')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4"
              >
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/10' : 'bg-primary/20'}`}>
                  <FiMail className="text-primary text-xl" />
                </div>
                <p className={darkMode ? 'text-gray_bg' : 'text-gray-700'}>{t('signup.features.updates')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="flex items-center gap-4"
              >
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/10' : 'bg-primary/20'}`}>
                  <FiLock className="text-primary text-xl" />
                </div>
                <p className={darkMode ? 'text-gray_bg' : 'text-gray-700'}>{t('signup.features.security')}</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className={`p-6 rounded-xl border ${
                darkMode
                  ? 'bg-primary/5 border-primary/10'
                  : 'bg-primary/10 border-primary/20 shadow-sm'
              }`}
            >
              <p className={`italic ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>{t('signup.quote')}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px]"
        >
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 transform rotate-6 scale-105
              transition-colors duration-300
              ${darkMode
                ? 'bg-gradient-to-r from-primary/30 to-secondary2/30'
                : 'bg-gradient-to-r from-blue-100 to-blue-50'}`} />

            <motion.div
              initial={{ rotateX: -30 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className={`relative p-4 sm:p-6 md:p-8 rounded-2xl border backdrop-blur-xl
                transition-colors duration-300
                ${darkMode
                  ? 'bg-secondary1 border-primary/20'
                  : 'bg-white/80 border-blue-100'}`}
            >
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
                      alt="Meniwi Logo"
                      className="h-8 sm:h-10 md:h-12 w-auto"
                    />
                  </Link>
                </motion.div>
                <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('signup.title')}</h2>
                <p className={`text-xs sm:text-sm md:text-base ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>{t('signup.subtitle')}</p>
              </div>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {renderInputs()}

                <div className="flex items-start sm:items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={() => setAgreeToTerms(!agreeToTerms)}
                    className="mt-1 sm:mt-0 mr-2 accent-primary"
                  />
                  <label htmlFor="terms" className={`text-xs sm:text-sm ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
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

                {formErrors.terms && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <FiAlertCircle className="mr-1" />
                    {formErrors.terms}
                  </div>
                )}

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
                  className="w-full bg-primary hover:bg-secondary2 text-white rounded-lg sm:rounded-xl py-2 sm:py-2.5 md:py-3
                    text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25
                    disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? t('signup.form.loading') : t('signup.form.submit')}
                </motion.button>

                <p className={`text-center text-xs sm:text-sm mt-3 sm:mt-4 ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
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