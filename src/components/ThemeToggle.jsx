import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  // Track theme changes for animation
  const handleThemeChange = () => {
    setIsAnimating(true);
    toggleDarkMode();

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Add a tooltip to show current theme
  const tooltipText = darkMode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleThemeChange}
      className={`p-2 rounded-full transition-all duration-300 relative ${
        darkMode
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      } ${className}`}
      aria-label={tooltipText}
      title={tooltipText}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={darkMode ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {darkMode ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Ripple effect on click */}
      {isAnimating && (
        <span className="absolute inset-0 rounded-full animate-ping-once opacity-75"
          style={{
            backgroundColor: darkMode ? 'rgba(250, 204, 21, 0.3)' : 'rgba(59, 130, 246, 0.3)'
          }}
        />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
