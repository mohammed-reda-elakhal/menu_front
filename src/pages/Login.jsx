import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logo from '../assets/menu.png'

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-secondary1 flex items-center justify-center px-4 relative overflow-hidden">
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
          className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary2/30 
            rounded-2xl blur-xl opacity-50 transform scale-105"
        />

        <motion.div
          initial={{ rotateX: -30 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative bg-secondary1 p-8 rounded-2xl border border-primary/20 backdrop-blur-xl"
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
                  alt="Menuso Logo" 
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
              className="text-2xl font-bold text-white mb-2"
            >
              Welcome Back
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray_bg"
            >
              Sign in to manage your digital menu
            </motion.p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-gray_bg text-sm block mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type="email"
                    className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3 
                      text-white focus:border-primary/40 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-gray_bg text-sm block mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-secondary1 border-2 border-primary/20 rounded-xl px-10 py-3 
                      text-white focus:border-primary/40 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 
                      transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray_bg">
                <input type="checkbox" className="mr-2 accent-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-secondary2 text-white rounded-xl py-3 
                font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              Sign In
            </motion.button>

            <p className="text-center text-gray_bg text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login