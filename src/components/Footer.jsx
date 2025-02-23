import React from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import logo from '../assets/menu.png'

function Footer() {
  return (
    <footer className="bg-secondary1 border-t border-primary/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <img src={logo} alt="Menuso Logo" className="h-8 w-auto" />
            <p className="text-gray_bg text-sm max-w-xs">
              Transform your restaurant's menu into an interactive digital experience with Menuso.
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
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Features', 'Pricing', 'Contact'].map((item, index) => (
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
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item, index) => (
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
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray_bg text-sm mb-4">
              Subscribe to our newsletter for updates and tips.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-secondary1 border-2 border-primary/20 
                  focus:border-primary/60 focus:outline-none text-white text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 bg-primary hover:bg-secondary2 
                  text-white rounded-lg transition-colors duration-300 text-sm"
              >
                Subscribe
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
                Privacy
              </a>
              <a href="#" className="text-gray_bg hover:text-primary text-sm transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="text-gray_bg hover:text-primary text-sm transition-colors duration-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer