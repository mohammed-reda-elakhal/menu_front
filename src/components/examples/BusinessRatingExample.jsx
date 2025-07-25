import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RatingComponent, RatingStats } from '../../services/RatingService';
import { getBusinessById } from '../../redux/apiCalls/businessApiCalls';

/**
 * Example component showing how to use the RatingService with businesses
 * This can be used as a reference for implementing ratings in other components
 */
const BusinessRatingExample = ({ businessId }) => {
  const dispatch = useDispatch();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Theme colors for the rating component
  const themeColors = {
    text: isDarkMode ? 'text-gray-200' : 'text-gray-800',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getBusinessById(businessId));
        if (result.success) {
          setBusiness(result.business);
        } else {
          setError('Failed to load business');
        }
      } catch (err) {
        setError('An error occurred while loading the business');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [dispatch, businessId]);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Handle rating submission callback
  const handleRatingSubmit = (result) => {
    console.log('Rating submitted:', result);
    // You could update the business state here if needed
    if (result.success && business) {
      setBusiness({
        ...business,
        ratings: result.ratings
      });
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading business...</div>;
  }

  if (error || !business) {
    return <div className="p-4 text-center text-red-500">{error || 'Business not found'}</div>;
  }

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{business.nom}</h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="mb-4">
        <img
          src={business.image?.url || 'https://via.placeholder.com/300'}
          alt={business.nom}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <div className="mb-4">
        <p className={`${themeColors.muted}`}>{business.description}</p>
        <div className="mt-2">
          <span className={`text-sm ${themeColors.text}`}>
            {business.adress}
          </span>
        </div>
      </div>

      {/* Rating Statistics Display */}
      {business.ratings && business.ratings.total > 0 && (
        <div className="mb-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
          <h3 className={`text-sm font-medium mb-2 ${themeColors.text}`}>Current Ratings</h3>
          <RatingStats
            ratings={business.ratings}
            isDarkMode={isDarkMode}
            themeColors={themeColors}
          />
        </div>
      )}

      {/* Compact Rating Stats Display */}
      <div className="mb-4">
        <h3 className={`text-sm font-medium mb-2 ${themeColors.text}`}>Compact Rating Display:</h3>
        <RatingStats
          ratings={business.ratings || { positive: 0, negative: 0, percentage: 0, total: 0 }}
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          compact={true}
        />
      </div>

      {/* Rating Component */}
      <div className="mt-4">
        <RatingComponent
          itemId={business._id}
          itemType="business"
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          hideAfterRating={false} // Keep showing the component after rating
          onRatingSubmit={handleRatingSubmit}
          customStyles={{
            container: 'border border-gray-200 dark:border-gray-700 rounded-lg',
            text: 'font-medium',
            buttons: 'mb-2'
          }}
        />
      </div>
    </div>
  );
};

export default BusinessRatingExample;
