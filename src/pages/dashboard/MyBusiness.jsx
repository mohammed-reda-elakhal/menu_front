import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessById } from '../../redux/apiCalls/businessApiCalls';
import BusinessSettings from '../../components/dashboard/BusinessSettings';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyBusiness = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { businessId } = useParams();

  const [error, setError] = useState(null);

  // Get business states from Redux
  const { selectedBusiness, currentBusiness, loading } = useSelector(state => state.business);

  // Function to fetch business data
  const fetchBusinessData = async () => {
    setError(null);
    try {
      const targetBusinessId = businessId || (selectedBusiness && selectedBusiness._id);

      if (!targetBusinessId) {
        throw new Error('No business ID available. Please select a business first.');
      }

      const result = await dispatch(getBusinessById(targetBusinessId));

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch business data');
      }
    } catch (err) {
      console.error('Error fetching business data:', err);
      setError(err.message || 'An error occurred while fetching business data');
    }
  };

  useEffect(() => {
    fetchBusinessData();
  }, [dispatch, businessId, selectedBusiness]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('business.settings.pageTitle') || 'My Business'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('business.settings.pageDescription') || 'View and manage your business information'}
          </p>
        </div>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <div className="mt-4">
              <button
                onClick={() => navigate('/business')}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition-colors"
              >
                {t('business.settings.backToBusinesses') || 'Back to Businesses'}
              </button>
            </div>
          </div>
        ) : (
          <BusinessSettings businessData={currentBusiness} />
        )}
      </motion.div>
    </div>
  );
};

export default MyBusiness;
