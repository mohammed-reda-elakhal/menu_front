import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import { RiRestaurant2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import restaurantImage from '../assets/menu_cover1.jpg' // Add your image
import logo from '../assets/menu.png'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  // Input fields configuration
  const inputFields = [
    {
      id: 'restaurant',
      label: 'Restaurant Name',
      type: 'text',
      placeholder: 'Your Restaurant Name',
      icon: FiUser,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      icon: FiMail,
    },
    {
      id: 'password',
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      placeholder: '••••••••',
      icon: FiLock,
    },
  ]

  // Replace your existing form inputs with this
  const renderInputs = () => (
    <div className="space-y-4">
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
            delay: 0.2 * index,
            duration: 0.2
          }}
        >
          <label className="text-gray_bg text-sm block mb-2">{field.label}</label>
          <div className="relative">
            <field.icon className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300
              ${focusedInput === field.id ? 'text-primary' : 'text-primary/50'}`} 
            />
            <input
              type={field.type}
              className={`w-full bg-secondary1 border-2 rounded-xl px-10 py-3 
                text-white transition-all duration-300
                ${focusedInput === field.id 
                  ? 'border-primary shadow-lg shadow-primary/10' 
                  : 'border-primary/20'}`}
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
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-secondary1 flex">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Decorative Section */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-secondary1 via-secondary1/95 to-secondary1"
      >
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

        {/* Decorative Icons Grid */}
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
                className="text-primary text-2xl"
              >
                <RiRestaurant2Line />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content */}
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
                  alt="Menuso Logo" 
                  className="h-12 w-auto"
                />
                <h2 className="text-4xl font-bold text-white">
                  Menuso
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiUser className="text-primary text-xl" />
                </div>
                <p className="text-gray_bg">Create and manage your digital menu</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMail className="text-primary text-xl" />
                </div>
                <p className="text-gray_bg">Instant updates and notifications</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="flex items-center gap-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiLock className="text-primary text-xl" />
                </div>
                <p className="text-gray_bg">Secure and reliable platform</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="bg-primary/5 p-6 rounded-xl border border-primary/10"
            >
              <p className="text-gray_bg italic">
                "Join thousands of restaurants already transforming their menu experience with Menuso"
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary2/30 
              rounded-2xl blur-xl opacity-50 transform rotate-6 scale-105" />

            <motion.div
              initial={{ rotateX: -30 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative bg-secondary1 p-8 rounded-2xl border border-primary/20 backdrop-blur-xl"
            >
              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <Link to="/" className="hover:opacity-80 transition-opacity">
                    <img 
                      src={logo} 
                      alt="Menuso Logo" 
                      className="h-12 w-auto"
                    />
                  </Link>
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray_bg">Get started with your restaurant's digital menu</p>
              </div>

              {/* Signup Form */}
              <form className="space-y-6">
                {renderInputs()}

                <div className="flex items-center">
                  <input type="checkbox" className="mr-2 accent-primary" />
                  <label className="text-sm text-gray_bg">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-secondary2 text-white rounded-xl py-3 
                    font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                  Create Account
                </motion.button>

                <p className="text-center text-gray_bg text-sm">
                  Already have an account?{' '}
                  <a href="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                    Sign in
                  </a>
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