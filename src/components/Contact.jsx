import React from 'react'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

function Contact() {
  const { t } = useTranslation()
  const { darkMode } = useTheme()

  return (
    <div className={`py-12 sm:py-24 px-3 sm:px-6 lg:px-8 transition-colors duration-300
      ${darkMode ? 'bg-secondary1' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 transition-colors duration-300
            ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('contact.title.part1')} <span className="text-primary">{t('contact.title.part2')}</span>
          </h2>
          <p className={`text-base sm:text-lg max-w-2xl mx-auto px-2 transition-colors duration-300
            ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Contact Form */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="name" className={`block mb-2 transition-colors duration-300
                ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
                {t('contact.form.name.label')}
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-300
                  focus:border-primary/60 focus:outline-none
                  ${darkMode
                    ? 'bg-secondary1 border-primary/20 text-white'
                    : 'bg-white border-blue-100 text-gray-800'}`}
                placeholder={t('contact.form.name.placeholder')}
              />
            </div>
            <div>
              <label htmlFor="email" className={`block mb-2 transition-colors duration-300
                ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
                {t('contact.form.email.label')}
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-300
                  focus:border-primary/60 focus:outline-none
                  ${darkMode
                    ? 'bg-secondary1 border-primary/20 text-white'
                    : 'bg-white border-blue-100 text-gray-800'}`}
                placeholder={t('contact.form.email.placeholder')}
              />
            </div>
            <div>
              <label htmlFor="message" className={`block mb-2 transition-colors duration-300
                ${darkMode ? 'text-gray_bg' : 'text-gray-700'}`}>
                {t('contact.form.message.label')}
              </label>
              <textarea
                id="message"
                rows="6"
                className={`w-full px-4 py-3 rounded-lg border-2 resize-none transition-colors duration-300
                  focus:border-primary/60 focus:outline-none
                  ${darkMode
                    ? 'bg-secondary1 border-primary/20 text-white'
                    : 'bg-white border-blue-100 text-gray-800'}`}
                placeholder={t('contact.form.message.placeholder')}
              ></textarea>
            </div>
            <button
              className="w-full py-3 px-6 rounded-lg font-semibold bg-primary
                hover:bg-secondary2 text-white transition-colors duration-300"
            >
              {t('contact.form.button')}
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${darkMode ? 'bg-primary/10' : 'bg-blue-100'}`}>
                <FiMail className="text-primary text-xl" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 transition-colors duration-300
                  ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('contact.info.email.title')}
                </h3>
                <p className={`transition-colors duration-300
                  ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  contact@menuso.com
                </p>
                <p className={`transition-colors duration-300
                  ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  support@menuso.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg transition-colors duration-300
                ${darkMode ? 'bg-primary/10' : 'bg-blue-100'}`}>
                <FiPhone className="text-primary text-xl" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 transition-colors duration-300
                  ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('contact.info.phone.title')}
                </h3>
                <p className={`transition-colors duration-300
                  ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  +212 500-000000
                </p>
                <p className={`transition-colors duration-300
                  ${darkMode ? 'text-gray_bg' : 'text-gray-600'}`}>
                  +212 600-000000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact