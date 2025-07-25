import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkRatingStatus, rateBusiness } from '../redux/apiCalls/businessApiCalls';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Generate a unique device ID for the current browser
const generateDeviceId = () => {
  // Check if we already have a device ID in localStorage
  let deviceId = localStorage.getItem('device_id');

  // If not, create a new one
  if (!deviceId) {
    // Create a random ID based on timestamp and random number
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('device_id', deviceId);
  }

  return deviceId;
};

const BusinessRating = ({ businessId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const { ratings, ratingLoading, error } = useSelector(state => state.business);
  const [deviceId] = useState(generateDeviceId());
  const [showThankYou, setShowThankYou] = useState(false);

  // Check if the user has already rated this business
  useEffect(() => {
    if (businessId && deviceId) {
      dispatch(checkRatingStatus(businessId, deviceId));
    }
  }, [dispatch, businessId, deviceId]);

  // Handle rating submission
  const handleRate = async (rating) => {
    if (businessId && deviceId) {
      const result = await dispatch(rateBusiness(businessId, rating, deviceId));

      if (result.success) {
        setShowThankYou(true);
        // Hide the entire component after 2 seconds
        setTimeout(() => {
          // This will trigger the component to return null since ratings.hasRated will be true
        }, 2000);
      }
    }
  };

  // If the user has already rated, don't show the rating component at all
  if (ratings.hasRated) {
    return null;
  }

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-xl transition-all duration-300
                   hover:shadow-lg
                   ${darkMode
                     ? 'bg-secondary1/80 border border-primary/20 hover:shadow-primary/5'
                     : 'bg-white border border-blue-100 hover:shadow-blue-100/20'}`}>
      <h2 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {t('businesses.rateThisBusiness')}
      </h2>

      {showThankYou ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-6"
        >
          <motion.div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300
                      ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <FiThumbsUp className="text-3xl text-green-500" />
          </motion.div>
          <p className={`font-medium text-lg mb-2 transition-colors duration-300 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {t('businesses.thankYou')}
          </p>
          <p className={`text-sm text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('businesses.yourRatingHelps')}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center">
          <p className={`text-sm mb-4 text-center transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('businesses.howWasYourExperience')}
          </p>

          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRate('positive')}
              disabled={ratingLoading}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300
                        ${darkMode
                          ? 'hover:bg-primary/10'
                          : 'hover:bg-green-50'}`}
            >
              <div className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <FiThumbsUp className="text-2xl text-green-500" />
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('businesses.good')}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRate('negative')}
              disabled={ratingLoading}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300
                        ${darkMode
                          ? 'hover:bg-primary/10'
                          : 'hover:bg-red-50'}`}
            >
              <div className={`p-2 rounded-full transition-colors duration-300 ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <FiThumbsDown className="text-2xl text-red-500" />
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('businesses.bad')}
              </span>
            </motion.button>
          </div>

          {ratingLoading && (
            <div className="mt-4">
              <div className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 transition-colors duration-300
                             ${darkMode ? 'border-primary' : 'border-blue-500'}`}></div>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}

          {ratings.total > 0 && (
            <div className={`mt-6 pt-4 w-full transition-colors duration-300
                           ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <p className={`text-xs text-center transition-colors duration-300 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                {t('businesses.currentRating')}: {ratings.percentage}% {t('businesses.positive')} ({ratings.total} {t('businesses.votes')})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessRating;
