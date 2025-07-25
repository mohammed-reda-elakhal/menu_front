import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const FloatingThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Get current location to check if we're on the menu page
  const location = useLocation();
  const isMenuPage = location.pathname.includes('/menu/');

  // Show the toggle button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect if user is at the bottom of the page or near the footer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if there's a footer element
      const footer = document.querySelector('footer');

      if (footer) {
        // Get the position of the footer
        const footerRect = footer.getBoundingClientRect();
        // If the footer is visible or we're close to it, move the button up
        setIsAtBottom(footerRect.top < window.innerHeight + 100);
      } else {
        // If no footer, just check if we're near the bottom
        setIsAtBottom(documentHeight - scrollPosition < 100);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Don't render anything if not visible yet or if we're on the menu page
  if (!isVisible || isMenuPage) return null;

  return (
    <motion.div
      className="fixed z-50" // Visible on all screen sizes
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        bottom: isAtBottom ? '80px' : '24px', // Move up when at bottom of page
        right: windowWidth > 768 ? '32px' : '24px' // More space on larger screens
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3
      }}
    >
      <motion.button
        whileHover={{
          scale: 1.1,
          boxShadow: darkMode
            ? "0 0 15px rgba(250, 204, 21, 0.5)"
            : "0 0 15px rgba(59, 130, 246, 0.5)"
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            darkMode
              ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 5px rgba(250, 204, 21, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 5px rgba(59, 130, 246, 0.3)",
            darkMode
              ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 12px rgba(250, 204, 21, 0.5)"
              : "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 12px rgba(59, 130, 246, 0.5)",
            darkMode
              ? "0 4px 12px rgba(0, 0, 0, 0.3), 0 0 5px rgba(250, 204, 21, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 5px rgba(59, 130, 246, 0.3)",
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        onClick={handleThemeChange}
        className={`p-2.5 sm:p-3 rounded-full transition-all duration-300 relative shadow-lg ${
          darkMode
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }`}
        style={{
          backdropFilter: 'blur(5px)',
          border: darkMode
            ? '1px solid rgba(250, 204, 21, 0.2)'
            : '1px solid rgba(59, 130, 246, 0.2)'
        }}
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
              <FiSun className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <FiMoon className="w-5 h-5 sm:w-6 sm:h-6" />
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
    </motion.div>
  );
};

export default FloatingThemeToggle;
