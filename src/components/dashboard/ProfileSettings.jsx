import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiEdit, FiSave, FiX, FiUpload, FiCalendar, FiClock, FiPackage, FiDollarSign, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updatePerson, uploadProfilePhoto, updatePassword } from '../../redux/apiCalls/personApiCalls';
import { useTheme } from '../../context/ThemeContext';

const ProfileSettings = ({ personData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.person);
  const { darkMode } = useTheme();

  const defaultData = {
    _id: "",
    nom: "",
    tele: "",
    email: "",
    role: "client",
    ville: "",
    active: true,
    verify: false,
    cin: "",
    profile: {
      url: "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png",
      publicId: null
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [userData, setUserData] = useState(personData || defaultData);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordFormStatus, setPasswordFormStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    if (personData) {
      setUserData(personData);
    }
  }, [personData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.newPassword) {
      errors.newPassword = t('profile.validation.passwordRequired') || 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = t('profile.validation.passwordTooShort') || 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = t('profile.validation.confirmPasswordRequired') || 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('profile.validation.passwordsDoNotMatch') || 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFormStatus({ message: '', type: '' });

    if (!validatePasswordForm()) {
      return;
    }

    try {
      const result = await dispatch(updatePassword(userData._id, passwordData.newPassword));

      if (!result.success) {
        throw new Error(result.error || 'Failed to update password');
      }

      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });

      setPasswordFormStatus({
        message: t('profile.passwordUpdateSuccess') || 'Password updated successfully',
        type: 'success'
      });
    } catch (error) {
      setPasswordFormStatus({
        message: error.message || 'An error occurred while updating password',
        type: 'error'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ message: '', type: '' });

    try {
      const updateResult = await dispatch(updatePerson(userData._id, {
        nom: userData.nom,
        email: userData.email,
        tele: userData.tele,
        ville: userData.ville,
        cin: userData.cin
      }));

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Failed to update profile');
      }

      if (selectedFile) {
        try {
          setFormStatus({
            message: t('profile.uploading') || 'Uploading profile photo...',
            type: 'info'
          });

          const formData = new FormData();
          formData.append('image', selectedFile);

          if (selectedFile.size > 1 * 1024 * 1024) {
            const compressedFile = await compressImage(selectedFile, 400, 400, 0.5);

            formData.delete('image');
            formData.append('image', compressedFile);
          }

          const photoResult = await dispatch(uploadProfilePhoto(userData._id, formData));

          if (!photoResult.success) {
            throw new Error(photoResult.error || 'Failed to upload profile photo');
          }
        } catch (photoError) {
          throw photoError;
        }
      }

      setFormStatus({
        message: t('profile.updateSuccess') || 'Profile updated successfully',
        type: 'success'
      });
      setEditMode(false);

    } catch (error) {
      setFormStatus({
        message: error.message || 'An error occurred while updating profile',
        type: 'error'
      });
    }
  };

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (error) => {
        reject(error);
        URL.revokeObjectURL(img.src);
      };
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setFormStatus({
            message: t('profile.invalidFileType') || 'Invalid file type. Please upload an image file.',
            type: 'error'
          });
          return;
        }

        const maxSize = 1 * 1024 * 1024;

        let fileToUpload = file;
        if (file.size > maxSize) {
          setFormStatus({
            message: t('profile.compressingImage') || 'Image is large, compressing...',
            type: 'info'
          });

          fileToUpload = await compressImage(file);

          if (fileToUpload.size > maxSize) {
            setFormStatus({
              message: t('profile.stillTooLarge') || 'Image is still too large after compression. Please select a smaller image (max 1MB).',
              type: 'error'
            });
            return;
          }

          setFormStatus({ message: '', type: '' });
        }

        setSelectedFile(fileToUpload);

        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(fileToUpload);
      } catch (error) {
        setFormStatus({
          message: t('profile.processingError') || 'Error processing image. Please try another image.',
          type: 'error'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format plan period for display
  const formatPlanPeriod = (period) => {
    if (!period) return '';

    const periodMap = {
      '1_month': t('profile.plan.oneMonth') || '1 Month',
      '3_months': t('profile.plan.threeMonths') || '3 Months',
      '6_months': t('profile.plan.sixMonths') || '6 Months',
      '1_ans': t('profile.plan.oneYear') || '1 Year',
      '2_ans': t('profile.plan.twoYears') || '2 Years'
    };

    return periodMap[period] || period.replace('_', ' ');
  };

  // Calculate remaining time until plan expiration
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  // State to control plan section visibility
  const [isPlanSectionOpen, setIsPlanSectionOpen] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!userData.ownerPlan?.endDate) return;

    const endDate = new Date(userData.ownerPlan.endDate);
    const now = new Date();
    const difference = endDate - now;

    if (difference <= 0) {
      setRemainingTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: true
      });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setRemainingTime({
      days,
      hours,
      minutes,
      seconds,
      expired: false
    });
  }, [userData.ownerPlan?.endDate]);

  useEffect(() => {
    if (userData.ownerPlan?.endDate) {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [userData.ownerPlan?.endDate, calculateTimeLeft]);

  return (
    <div className="max-w-7xl mx-auto bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent">
          {t('profile.title') || 'Profile Settings'}
        </h2>
        {!editMode ? (
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#2b54c7' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-full text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            <FiEdit className="w-5 h-5" />
            <span className="font-medium">{t('profile.edit') || 'Edit'}</span>
          </motion.button>
        ) : (
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-500 rounded-full text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
            >
              <FiSave className="w-5 h-5" />
              <span className="font-medium">{loading ? 'Saving...' : 'Save'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditMode(false)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500 rounded-full text-white shadow-lg hover:shadow-red-500/30 transition-all duration-300"
            >
              <FiX className="w-5 h-5" />
              <span className="font-medium">Cancel</span>
            </motion.button>
          </div>
        )}
      </div>

      {formStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border ${
            formStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {formStatus.message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mb-6 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src={previewUrl || (userData.profile && userData.profile.url) || defaultData.profile.url}
                  alt={userData.nom || 'User'}
                  className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 shadow-xl transition-all duration-300 group-hover:border-primary/40"
                />
                {editMode && (
                  <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-all duration-300 group-hover:scale-110">
                    <FiUpload className="w-6 h-6" />
                    <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleFileSelect} />
                  </label>
                )}
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{userData.nom}</h3>
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              {userData.role}
            </span>

            <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-inner">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">{t('profile.status') || 'Status'}:</span>
                <span className={`font-medium ${userData.active ? 'text-green-500' : 'text-red-500'}`}>
                  {userData.active ? (t('profile.active') || 'Active') : (t('profile.inactive') || 'Inactive')}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">{t('profile.verified') || 'Verified'}:</span>
                <span className={`font-medium ${userData.verify ? 'text-green-500' : 'text-red-500'}`}>
                  {userData.verify ? (t('profile.yes') || 'Yes') : (t('profile.no') || 'No')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{t('profile.memberSince') || 'Member Since'}:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(userData.createdAt)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-2 space-y-6">

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['name', 'email', 'phone', 'city', 'cin'].map((field, index) => (
              <motion.div
                key={field}
                className={`${field === 'cin' ? 'col-span-2' : 'col-span-2 md:col-span-1'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t(`profile.${field}`) || field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {field === 'name' && <FiUser className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />}
                    {field === 'email' && <FiMail className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />}
                    {field === 'phone' && <FiPhone className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />}
                    {field === 'city' && <FiMapPin className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />}
                    {field === 'cin' && <FiCreditCard className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />}
                  </div>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field === 'name' ? 'nom' : field === 'phone' ? 'tele' : field === 'city' ? 'ville' : field}
                    value={field === 'name' ? userData.nom :
                           field === 'phone' ? userData.tele :
                           field === 'city' ? userData.ville :
                           userData[field]}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder={`Enter your ${field.replace('_', ' ')}`}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl
                      ${editMode
                        ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-gray-50 dark:bg-gray-800 border-transparent'}
                      focus:ring-2 focus:ring-primary/20 focus:border-primary
                      text-gray-800 dark:text-white transition-all duration-300
                      placeholder-gray-400 text-base
                      hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed
                      shadow-sm hover:shadow-md group-hover:shadow-lg`}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </form>

          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl shadow-inner backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {t('profile.changePassword') || 'Change Password'}
              </h3>

              {passwordFormStatus.message && (
                <div className={`mb-4 p-3 rounded-lg ${passwordFormStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {passwordFormStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['newPassword', 'confirmPassword'].map((field, index) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t(`profile.${field}`) || field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        name={field}
                        value={passwordData[field]}
                        onChange={handlePasswordChange}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        className={`w-full px-4 py-3.5 border-2 rounded-2xl
                          bg-white dark:bg-gray-700
                          ${passwordErrors[field] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}
                          focus:ring-2 focus:ring-primary/20 focus:border-primary
                          text-gray-800 dark:text-white transition-all duration-300
                          placeholder-gray-400 text-base
                          shadow-sm hover:shadow-md group-hover:shadow-lg`}
                      />
                      {passwordErrors[field] && (
                        <p className="text-red-500 text-sm mt-1.5">{passwordErrors[field]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-primary rounded-full text-white shadow-lg
                    hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
                >
                  <FiSave className="w-5 h-5" />
                  <span className="font-medium">
                    {loading ? t('profile.updating') || 'Updating...' : t('profile.updatePassword') || 'Update Password'}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Plan Information Section - Moved to bottom and made collapsible */}
          {userData.ownerPlan && (
            <div className="mt-8">
              <motion.button
                onClick={() => setIsPlanSectionOpen(!isPlanSectionOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-t-xl ${
                  darkMode
                    ? isPlanSectionOpen ? 'bg-primary/30' : 'bg-gray-700/80'
                    : isPlanSectionOpen ? 'bg-primary/20' : 'bg-gray-100'
                } transition-colors duration-300`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-2">
                  <FiPackage className={`w-5 h-5 ${isPlanSectionOpen ? 'text-primary' : darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <span className={`font-semibold ${isPlanSectionOpen ? 'text-primary' : darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('profile.plan.title') || 'Your Plan'}
                  </span>
                </div>
                {isPlanSectionOpen ? (
                  <FiChevronUp className={`w-5 h-5 ${isPlanSectionOpen ? 'text-primary' : darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                ) : (
                  <FiChevronDown className={`w-5 h-5 ${isPlanSectionOpen ? 'text-primary' : darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                )}
              </motion.button>

              <AnimatePresence>
                {isPlanSectionOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden rounded-b-xl shadow-lg"
                  >
                    <div className={`p-5 ${darkMode ? 'bg-gray-800/90' : 'bg-white'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {userData.ownerPlan.plan.title}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            userData.ownerPlan.plan.type === 'payee'
                              ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {userData.ownerPlan.plan.type === 'payee'
                              ? t('profile.plan.premium') || 'Premium'
                              : t('profile.plan.free') || 'Free'}
                          </span>
                        </div>

                        {userData.ownerPlan.plan.type === 'payee' && (
                          <div className="flex items-center gap-1 text-lg font-bold">
                            <FiDollarSign className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
                              {userData.ownerPlan.price} <span className="text-sm">{t('profile.plan.currency') || 'DH'}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Countdown Timer */}
                      {userData.ownerPlan.plan.type === 'payee' && !remainingTime.expired && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} backdrop-blur-sm`}
                        >
                          <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {t('profile.plan.timeRemaining') || 'Time Remaining'}:
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { value: remainingTime.days, label: t('profile.plan.days') || 'Days' },
                              { value: remainingTime.hours, label: t('profile.plan.hours') || 'Hours' },
                              { value: remainingTime.minutes, label: t('profile.plan.minutes') || 'Mins' },
                              { value: remainingTime.seconds, label: t('profile.plan.seconds') || 'Secs' }
                            ].map((item, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <div className={`w-full py-2 px-1 rounded-lg text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-sm`}>
                                  <span className="text-lg font-bold">{item.value}</span>
                                </div>
                                <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiCalendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {t('profile.plan.startDate') || 'Start Date'}:
                            <span className="font-medium ml-1">
                              {formatDate(userData.ownerPlan.startDate)}
                            </span>
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiCalendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {t('profile.plan.endDate') || 'End Date'}:
                            <span className="font-medium ml-1">
                              {formatDate(userData.ownerPlan.endDate)}
                            </span>
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <FiClock className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {t('profile.plan.period') || 'Period'}:
                            <span className="font-medium ml-1">
                              {formatPlanPeriod(userData.ownerPlan.period)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
