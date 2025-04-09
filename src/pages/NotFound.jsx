import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import SEO from '../components/SEO';
import logo from '../assets/menu.png';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary1 flex flex-col items-center justify-center p-4">
      <SEO
        title="Page Not Found | 404 Error"
        description="The page you are looking for does not exist. Return to the Meniwi homepage."
        url="https://meniwi.com/404"
      />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
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

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <Link to="/">
          <motion.img
            src={logo}
            alt="Meniwi Logo"
            className="h-16 w-auto mx-auto mb-6"
            whileHover={{
              scale: 1.05,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 }
            }}
          />
        </Link>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl font-bold text-primary mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray_bg mb-8"
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary2 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <FiArrowLeft />
            Go Back
          </motion.button>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 bg-secondary1 border-2 border-primary/20 hover:border-primary/40 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <FiHome />
              Go Home
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
