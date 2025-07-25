import React, { useEffect } from 'react'
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

function Footer() {
  const { t } = useTranslation()
  const { darkMode } = useTheme()

  // Colors are defined in Tailwind classes directly

  // No need for state to force re-render as we're using conditional classes

  // Add the keyframes for gradient animation if not already present
  useEffect(() => {
    if (!document.getElementById('gradient-keyframes-footer')) {
      const keyframes = `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `;
      const style = document.createElement('style');
      style.id = 'gradient-keyframes-footer';
      style.innerHTML = keyframes;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <footer className={`relative border-t transition-all duration-300
      ${darkMode
        ? 'border-primary/20'
        : 'border-gray-800/20'}`}>
      {/* Gradient background */}
      <div className={`absolute inset-0 w-full h-full transition-all duration-300
        bg-gradient-to-b bg-[length:200%_200%] animate-[gradient_15s_ease_infinite]
        ${darkMode
          ? 'from-secondary1 to-secondary1/95'
          : 'from-blue-50 to-white'}`}>
        {/* Enhanced background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] animate-pulse
            ${darkMode ? 'bg-secondary2/10' : 'bg-blue-400/10'}`} />
          <div className={`absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px]
            ${darkMode ? 'bg-primary/5' : 'bg-blue-500/5'}`} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 z-10">
        {/* Motivational Message */}
        <div className="py-8 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className={`text-xl sm:text-2xl font-bold mb-4 transition-colors duration-300
                            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('footer.motivationalTitle')}
              </h3>

              <p className={`text-base mb-6 transition-colors duration-300
                          ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                {t('footer.motivationalMessage')}
              </p>

              <div className="flex justify-center space-x-6">
                {[FiTwitter, FiInstagram, FiGithub, FiLinkedin].map((Icon, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className={`transition-colors duration-300
                              ${darkMode
                                ? 'text-primary hover:text-white'
                                : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`pt-6 border-t transition-colors duration-300
                      ${darkMode ? 'border-primary/20' : 'border-gray-200'}`}>
          <p className={`text-sm text-center transition-colors duration-300
                      ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('footer.bottom.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer