import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/menu.png'
import { MdUpdate } from 'react-icons/md'
import { BiDevices } from 'react-icons/bi'
import { IoShareSocialSharp } from 'react-icons/io5'

function About() {
  return (
    <div className="bg-secondary1 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-12"
      >
        <img src={logo} alt="Menuso Logo" className="h-12 w-auto" />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Transform Your <span className="text-primary">Menu Experience</span>
          </h2>
          <p className="text-gray_bg text-lg max-w-2xl mx-auto mb-8">
            Elevate your restaurant's presence with our innovative digital menu solution
          </p>
          
          {/* New description section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto bg-primary/5 p-6 rounded-xl border border-primary/10"
          >
            <p className="text-gray_bg text-md leading-relaxed">
              <span className="text-primary font-semibold">Menuso</span> is your all-in-one digital menu management platform, 
              designed specifically for modern restaurants and cafes. We combine elegant design with powerful functionality, 
              allowing you to create, update, and share your digital menus effortlessly. With QR code integration and 
              real-time updates, your menu stays dynamic and accessible to your customers at all times.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary1 p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <MdUpdate className="text-primary text-3xl" />
              <h3 className="text-xl font-semibold text-primary">Real-time Updates</h3>
            </div>
            <p className="text-gray_bg">Update your menu instantly through an intuitive management interface</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary1 p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <BiDevices className="text-primary text-3xl" />
              <h3 className="text-xl font-semibold text-primary">Interactive Design</h3>
            </div>
            <p className="text-gray_bg">Beautiful, responsive layouts that work seamlessly across all devices</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-secondary1 p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <IoShareSocialSharp className="text-primary text-3xl" />
              <h3 className="text-xl font-semibold text-primary">Easy Sharing</h3>
            </div>
            <p className="text-gray_bg">Share your menu instantly via QR codes and social media integration</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default About