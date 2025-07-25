import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSave, FiAlertCircle, FiCheckCircle, FiUpload, FiType, FiFileText, FiDollarSign, FiTag, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdImage } from 'react-icons/md';
import { useTheme } from '../../../context/ThemeContext';

const SupplementForm = ({ supplement, categories = [], onSubmit, isUpdate = false }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: supplement?.nom || '',
    description: supplement?.description || '',
    price: supplement?.prix || '',
    categoryId: supplement?.categorie?._id || '',
    image: null,
    visible: supplement?.visible ?? true
  });

  const [imagePreview, setImagePreview] = useState(supplement?.image?.url || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('dashboard.forms.supplement.nameRequired') || 'Supplement name is required';
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = t('dashboard.forms.supplement.priceRequired') || 'Valid price is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = t('dashboard.forms.supplement.categoryRequired') || 'Category is required';
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setFormStatus({ message: '', type: '' });

    try {
      // Create FormData object for API submission
      const submitData = new FormData();
      submitData.append('nom', formData.name);
      submitData.append('description', formData.description);
      submitData.append('prix', formData.price);
      submitData.append('categorie', formData.categoryId);
      submitData.append('visible', formData.visible);

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await onSubmit(submitData);
      setFormStatus({
        message: isUpdate
          ? t('dashboard.products.supplements.updateSuccess')
          : t('dashboard.products.supplements.createSuccess'),
        type: 'success'
      });
    } catch (error) {
      setFormStatus({
        message: error.message || t('dashboard.common.error'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setErrors({ ...errors, image: '' });

    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: t('dashboard.forms.supplement.imageTypeError') });
        return;
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors({ ...errors, image: t('dashboard.forms.supplement.imageSizeError') });
        return;
      }

      // Create a preview for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Store the actual file for upload
      setFormData({ ...formData, image: file });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status message */}
      {formStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg flex items-center gap-2 ${
            formStatus.type === 'success'
              ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-500/10 text-green-600'
              : darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-500/10 text-red-600'
          }`}
        >
          {formStatus.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{formStatus.message}</span>
        </motion.div>
      )}

      {/* Image Upload Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('dashboard.forms.supplement.image')}
          </label>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('dashboard.forms.supplement.imageRequirements.recommended')}
          </span>
        </div>

        <div className="flex flex-col items-center">
          {imagePreview ? (
            <div className="relative group mb-3">
              <img
                src={imagePreview}
                alt="Supplement preview"
                className={`w-full h-[200px] object-cover rounded-lg border-2 transition-colors ${
                  darkMode
                    ? 'border-primary/20 group-hover:border-primary/50'
                    : 'border-blue-200 group-hover:border-blue-400'
                }`}
              />
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                onClick={triggerFileInput}
              >
                <button
                  type="button"
                  className={`text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
                    darkMode
                      ? 'bg-primary/80 hover:bg-primary'
                      : 'bg-blue-600/80 hover:bg-blue-600'
                  }`}
                >
                  <FiUpload className="w-4 h-4" />
                  <span>{t('dashboard.forms.supplement.changeImage')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className={`w-full h-[150px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors mb-3 ${
                darkMode
                  ? 'border-gray-500 hover:border-primary bg-gray-800/30'
                  : 'border-gray-300 hover:border-blue-500 bg-gray-50'
              }`}
            >
              <MdImage className={`w-10 h-10 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('dashboard.forms.supplement.addImage')}
              </span>
              <span className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('dashboard.forms.supplement.imageRequirements.format')} • {t('dashboard.forms.supplement.imageRequirements.size')}
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          {errors.image && (
            <p className="text-red-500 text-xs mt-1 self-start">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Supplement Name */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('dashboard.forms.supplement.name')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiType className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? `bg-secondary1/50 text-white ${errors.name ? 'border-red-500' : 'border-primary/20'}`
                : `bg-white text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-300'}`
              }`}
            placeholder={t('dashboard.forms.supplement.namePlaceholder') || 'Enter supplement name'}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('dashboard.forms.supplement.category')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiTag className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              appearance-none ${
                darkMode
                  ? `bg-secondary1/50 text-white ${errors.categoryId ? 'border-red-500' : 'border-primary/20'}`
                  : `bg-white text-gray-900 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`
              }`}
          >
            <option value="" className={darkMode ? 'bg-gray-800' : 'bg-white'}>
              {t('dashboard.forms.supplement.selectCategory')}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                {category.nom}
              </option>
            ))}
          </select>
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {errors.categoryId && (
          <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('dashboard.forms.supplement.price')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? `bg-secondary1/50 text-white ${errors.price ? 'border-red-500' : 'border-primary/20'}`
                : `bg-white text-gray-900 ${errors.price ? 'border-red-500' : 'border-gray-300'}`
              }`}
            placeholder="0.00"
          />
        </div>
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* Supplement Description */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {t('dashboard.forms.supplement.description')}
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <FiFileText className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              darkMode
                ? 'bg-secondary1/50 border-primary/20 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder={t('dashboard.forms.supplement.descriptionPlaceholder') || 'Enter supplement description'}
          />
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center space-x-3 pt-2">
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            name="visible"
            id="visible"
            checked={formData.visible}
            onChange={handleChange}
            className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out ${
              darkMode ? 'border-gray-700' : 'border-gray-300'
            }`}
          />
          <label
            htmlFor="visible"
            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
              formData.visible
                ? 'bg-primary'
                : darkMode ? 'bg-gray-600' : 'bg-gray-400'
            }`}
          ></label>
        </div>
        <label htmlFor="visible" className={`text-sm font-medium cursor-pointer flex items-center ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {formData.visible ? <FiEye className="mr-1" /> : <FiEyeOff className="mr-1" />}
          {formData.visible ? t('dashboard.forms.supplement.visible') : t('dashboard.forms.supplement.hidden')}
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white shadow-md
            ${loading
              ? 'bg-primary/50 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 transform hover:scale-[1.01]'
            } transition-all duration-200`}
          style={{
            boxShadow: darkMode
              ? '0 4px 12px rgba(55, 104, 229, 0.3)'
              : '0 4px 12px rgba(55, 104, 229, 0.2)'
          }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>{isUpdate ? t('dashboard.common.updating') : t('dashboard.common.creating')}</span>
            </>
          ) : (
            <>
              <FiSave className="w-5 h-5" />
              <span>{isUpdate ? t('dashboard.forms.update') : t('dashboard.forms.create')}</span>
            </>
          )}
        </button>
      </div>

      {/* Custom CSS for toggle switch */}
      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: ${darkMode ? '#3768e5' : '#3768e5'};
        }
        .toggle-label {
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>
    </form>
  );
};

export default SupplementForm;