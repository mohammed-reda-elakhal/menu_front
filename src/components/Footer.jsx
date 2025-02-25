import React from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import logo from '../assets/menu.png'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-secondary1 border-t border-primary/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <img src={logo} alt="Menuso Logo" className="h-8 w-auto" />
            <p className="text-gray_bg text-sm max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {[FiTwitter, FiInstagram, FiGithub, FiLinkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray_bg hover:text-primary transition-colors duration-300"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks.title')}</h3>
            <ul className="space-y-2">
              {t('footer.quickLinks.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray_bg hover:text-primary transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-2">
              {t('footer.legal.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray_bg hover:text-primary transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray_bg text-sm mb-4">
              {t('footer.newsletter.description')}
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="w-full px-4 py-2 rounded-lg bg-secondary1 border-2 border-primary/20 
                  focus:border-primary/60 focus:outline-none text-white text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 bg-primary hover:bg-secondary2 
                  text-white rounded-lg transition-colors duration-300 text-sm"
              >
                {t('footer.newsletter.button')}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray_bg text-sm">
              © {new Date().getFullYear()} Menuso. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray_bg hover:text-primary text-sm transition-colors duration-300">
                {t('footer.bottom.privacy')}
              </a>
              <a href="#" className="text-gray_bg hover:text-primary text-sm transition-colors duration-300">
                {t('footer.bottom.terms')}
              </a>
              <a href="#" className="text-gray_bg hover:text-primary text-sm transition-colors duration-300">
                {t('footer.bottom.contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer