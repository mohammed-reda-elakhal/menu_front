import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { rateProduct, checkProductRatingStatus } from '../redux/apiCalls/produitApiCalls';
import { rateBusiness, checkRatingStatus as checkBusinessRatingStatus } from '../redux/apiCalls/businessApiCalls';

/**
 * A reusable rating component that can be used for both products and businesses
 *
 * @param {Object} props - Component props
 * @param {string} props.itemId - ID of the item to rate (product or business)
 * @param {string} props.itemType - Type of item ('product' or 'business')
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {Object} props.themeColors - Theme colors object
 * @param {string} props.themeColors.text - Text color
 * @param {string} props.themeColors.muted - Muted text color
 * @param {string} props.themeColors.accent - Accent color
 * @param {string} props.themeColors.border - Border color
 * @param {Object} props.customStyles - Custom styles for the component
 * @param {string} props.customStyles.container - Custom class for the container
 * @param {string} props.customStyles.text - Custom class for the text
 * @param {string} props.customStyles.buttons - Custom class for the buttons
 * @param {boolean} props.hideAfterRating - Whether to hide the component after rating (default: true)
 * @param {number} props.hideDelay - Delay in ms before hiding the component after rating (default: 1500)
 * @param {Function} props.onRatingSubmit - Callback function called after rating is submitted
 * @param {Function} props.onRatingCheck - Callback function called after rating status is checked
 * @returns {JSX.Element} Rating component
 */
const RatingComponent = ({
  itemId,
  itemType = 'product', // 'product' or 'business'
  isDarkMode = false,
  themeColors = {
    text: 'text-gray-800 dark:text-gray-200',
    muted: 'text-gray-500 dark:text-gray-400',
    accent: 'text-blue-600 dark:text-blue-400',
    border: 'border-gray-200 dark:border-gray-700'
  },
  customStyles = {
    container: '',
    text: '',
    buttons: ''
  },
  hideAfterRating = true,
  hideDelay = 1500,
  onRatingSubmit,
  onRatingCheck
}) => {
  const dispatch = useDispatch();
  const [ratingState, setRatingState] = useState({
    hasRated: false,
    isLoading: false,
    ratings: {
      positive: 0,
      negative: 0,
      percentage: 0,
      total: 0
    }
  });
  const [showRatingUI, setShowRatingUI] = useState(true);

  // Generate a unique device ID or get from localStorage
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  // Check if user has already rated this item
  useEffect(() => {
    if (!itemId) return;

    const deviceId = getDeviceId();
    const checkRating = async () => {
      try {
        let result;

        if (itemType === 'product') {
          result = await dispatch(checkProductRatingStatus(itemId, deviceId));
        } else if (itemType === 'business') {
          result = await dispatch(checkBusinessRatingStatus(itemId, deviceId));
        }

        if (result?.success) {
          setRatingState({
            hasRated: result.hasRated,
            isLoading: false,
            ratings: result.ratings
          });

          // Call the onRatingCheck callback if provided
          if (onRatingCheck) {
            onRatingCheck(result);
          }
        }
      } catch (error) {
        console.error(`Error checking ${itemType} rating status:`, error);
      }
    };

    checkRating();
  }, [dispatch, itemId, itemType, onRatingCheck]);

  // Handle rating submission
  const handleRate = async (rating) => {
    if (!itemId) return;

    setRatingState(prev => ({ ...prev, isLoading: true }));

    try {
      const deviceId = getDeviceId();
      let result;

      if (itemType === 'product') {
        result = await dispatch(rateProduct(itemId, rating, deviceId));
      } else if (itemType === 'business') {
        result = await dispatch(rateBusiness(itemId, rating, deviceId));
      }

      if (result?.success) {
        setRatingState({
          hasRated: true,
          isLoading: false,
          ratings: result.ratings
        });

        // Call the onRatingSubmit callback if provided
        if (onRatingSubmit) {
          onRatingSubmit(result);
        }

        // Hide rating UI after a delay if hideAfterRating is true
        if (hideAfterRating) {
          setTimeout(() => {
            setShowRatingUI(false);
          }, hideDelay);
        }
      } else if (result?.alreadyRated) {
        setRatingState(prev => ({
          ...prev,
          hasRated: true,
          isLoading: false
        }));

        // Hide rating UI after a delay if hideAfterRating is true
        if (hideAfterRating) {
          setTimeout(() => {
            setShowRatingUI(false);
          }, hideDelay);
        }
      } else {
        setRatingState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error(`Error rating ${itemType}:`, error);
      setRatingState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // If user has already rated and we're not showing the rating UI anymore
  if (ratingState.hasRated && !showRatingUI) {
    return null;
  }

  // If user has already rated but we're still showing the rating UI
  if (ratingState.hasRated && showRatingUI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`w-full mt-2 px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'} text-center ${customStyles.container}`}
      >
        <p className={`text-[10px] ${themeColors.accent} font-medium ${customStyles.text}`}>
          Thanks for rating!
        </p>
      </motion.div>
    );
  }

  // Default rating UI
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full mt-2 px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/80'} ${customStyles.container}`}
    >
      <p className={`text-[10px] ${themeColors.muted} text-center mb-1 ${customStyles.text}`}>
        Rate this {itemType}
      </p>
      <div className={`flex justify-center gap-3 ${customStyles.buttons}`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={ratingState.isLoading}
          onClick={() => handleRate('positive')}
          className={`p-1.5 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}
            text-green-500 shadow-sm transition-all duration-200 ${ratingState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={ratingState.isLoading}
          onClick={() => handleRate('negative')}
          className={`p-1.5 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}
            text-red-500 shadow-sm transition-all duration-200 ${ratingState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

/**
 * A component to display rating statistics
 *
 * @param {Object} props - Component props
 * @param {Object} props.ratings - Rating statistics
 * @param {number} props.ratings.positive - Number of positive ratings
 * @param {number} props.ratings.negative - Number of negative ratings
 * @param {number} props.ratings.percentage - Percentage of positive ratings
 * @param {number} props.ratings.total - Total number of ratings
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 * @param {Object} props.themeColors - Theme colors object
 * @param {string} props.themeColors.text - Text color
 * @param {string} props.themeColors.muted - Muted text color
 * @param {Object} props.customStyles - Custom styles for the component
 * @param {string} props.customStyles.container - Custom class for the container
 * @param {string} props.customStyles.text - Custom class for the text
 * @param {boolean} props.compact - Whether to show a compact version
 * @returns {JSX.Element} Rating statistics component
 */
const RatingStats = ({
  ratings,
  isDarkMode = false,
  themeColors = {
    text: 'text-gray-800 dark:text-gray-200',
    muted: 'text-gray-500 dark:text-gray-400'
  },
  customStyles = {
    container: '',
    text: ''
  },
  compact = false
}) => {
  if (!ratings || ratings.total === 0) {
    return null;
  }

  // Compact version (just shows percentage)
  if (compact) {
    return (
      <div className={`inline-flex items-center ${customStyles.container}`}>
        <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
          ratings.percentage >= 70
            ? 'bg-green-100 text-green-800'
            : ratings.percentage >= 40
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
        }`}>
          {ratings.percentage}% Positive
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div className={`flex items-center gap-2 ${customStyles.container}`}>
      <div className="flex items-center">
        <span className="text-green-500 mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </span>
        <span className={`text-sm ${themeColors.text} ${customStyles.text}`}>{ratings.positive}</span>
      </div>
      <div className="flex items-center">
        <span className="text-red-500 mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
          </svg>
        </span>
        <span className={`text-sm ${themeColors.text} ${customStyles.text}`}>{ratings.negative}</span>
      </div>
      <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
        ratings.percentage >= 70
          ? 'bg-green-100 text-green-800'
          : ratings.percentage >= 40
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
      }`}>
        {ratings.percentage}% Positive
      </div>
    </div>
  );
};

export { RatingComponent, RatingStats };
