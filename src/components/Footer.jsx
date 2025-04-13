import React from 'react'
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import logo from '../assets/menu.png'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-secondary1 border-t border-primary/20">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <img src={logo} alt="Menuso Logo" className="h-8 w-auto" />
            <p className="text-gray_bg text-sm max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4 justify-start">
              {[FiTwitter, FiInstagram, FiGithub, FiLinkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray_bg hover:text-primary active:text-primary/80 transition-colors duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:mt-0">
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks.title')}</h3>
            <ul className="space-y-3">
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
          <div className="sm:mt-0">
            <h3 className="text-white font-semibold mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-3">
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
          <div className="sm:mt-0">
            <h3 className="text-white font-semibold mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray_bg text-sm mb-4">
              {t('footer.newsletter.description')}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary1 border-2 border-primary/20
                  focus:border-primary/60 focus:outline-none text-white text-sm"
              />
              <button
                className="w-full py-2.5 px-4 bg-primary hover:bg-secondary2 active:bg-primary/90
                  text-white rounded-lg transition-colors duration-300 text-sm font-medium"
              >
                {t('footer.newsletter.button')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-primary/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray_bg text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Menuso. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer