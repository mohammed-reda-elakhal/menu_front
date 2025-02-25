import React from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

function Contact() {
  const { t } = useTranslation()

  return (
    <div className="bg-secondary1 py-12 sm:py-24 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            {t('contact.title.part1')} <span className="text-primary">{t('contact.title.part2')}</span>
          </h2>
          <p className="text-gray_bg text-base sm:text-lg max-w-2xl mx-auto px-2">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-gray_bg mb-2">
                {t('contact.form.name.label')}
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-lg bg-secondary1 border-2 border-primary/20 
                  focus:border-primary/60 focus:outline-none text-white"
                placeholder={t('contact.form.name.placeholder')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray_bg mb-2">
                {t('contact.form.email.label')}
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg bg-secondary1 border-2 border-primary/20 
                  focus:border-primary/60 focus:outline-none text-white"
                placeholder={t('contact.form.email.placeholder')}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray_bg mb-2">
                {t('contact.form.message.label')}
              </label>
              <textarea
                id="message"
                rows="6"
                className="w-full px-4 py-3 rounded-lg bg-secondary1 border-2 border-primary/20 
                  focus:border-primary/60 focus:outline-none text-white resize-none"
                placeholder={t('contact.form.message.placeholder')}
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-primary 
                hover:bg-secondary2 text-white transition-colors duration-300"
            >
              {t('contact.form.button')}
            </motion.button>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FiMail className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{t('contact.info.email.title')}</h3>
                <p className="text-gray_bg">contact@menuso.com</p>
                <p className="text-gray_bg">support@menuso.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FiPhone className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{t('contact.info.phone.title')}</h3>
                <p className="text-gray_bg">+212 500-000000</p>
                <p className="text-gray_bg">+212 600-000000</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact