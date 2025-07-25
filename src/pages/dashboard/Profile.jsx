import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPersonById } from '../../redux/apiCalls/personApiCalls';
import ProfileSettings from '../../components/dashboard/ProfileSettings';
import LoadingSpinner from '../../components/LoadingSpinner';

const Profile = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // Get the id parameter from the URL
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from auth state and person data from person state
  const { user } = useSelector(state => state.auth);
  const { currentPerson, loading } = useSelector(state => state.person);

  useEffect(() => {
    const fetchPersonData = async () => {
      setIsLoading(true);
      try {
        // If id is provided in URL, use it; otherwise use the logged-in user's id
        const personId = id || (user && (user.id || user._id));

        if (!personId) {
          throw new Error('No person ID available');
        }


        const result = await dispatch(getPersonById(personId));

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch person data');
        }
      } catch (err) {

        setError(err.message || 'An error occurred while fetching profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonData();
  }, [dispatch, id, user]);

  if (isLoading || loading) {
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
            {t('profile.pageTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('profile.pageDescription')}
          </p>
        </div>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <ProfileSettings personData={currentPerson} />
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
