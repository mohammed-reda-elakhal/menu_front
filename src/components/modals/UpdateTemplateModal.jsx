import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle, FiUpload, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateTemplate } from '../../redux/apiCalls/templateApiCalls';
import BaseModal from '../shared/BaseModal';

const UpdateTemplateModal = ({ isOpen, onClose, template }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.template);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    componentName: '',
    category: '',
    price: 0,
    isFree: true,
    description: '',
    style: [],
    features: [],
    demoPath: '',
    isPublished: false
  });

  // Image preview state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Feature input state
  const [featureInput, setFeatureInput] = useState('');
  const [styleInput, setStyleInput] = useState('');

  // Validation state
  const [errors, setErrors] = useState({});

  // Local loading state
  const [localLoading, setLocalLoading] = useState(false);

  // Initialize form data when template changes
  useEffect(() => {
    if (isOpen && template) {
      setFormData({
        name: template.name || '',
        componentName: template.componentName || '',
        category: template.category || '',
        price: template.price || 0,
        isFree: template.isFree || false,
        description: template.description || '',
        style: Array.isArray(template.style) ? template.style : [],
        features: Array.isArray(template.features) ? template.features : [],
        demoPath: template.demoPath || '',
        isPublished: template.isPublished || false
      });
      if (template.imagePreview && template.imagePreview.url) {
        setImagePreview(template.imagePreview.url);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
      setFeatureInput('');
      setStyleInput('');
      setErrors({});
      setLocalLoading(false);
    }
    if (!isOpen) {
      setErrors({});
      setLocalLoading(false);
    }
  }, [isOpen, template]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const newValue = type === 'checkbox' ? checked :
                    (name === 'price' ? parseFloat(value) || 0 : value);

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: t('dashboard.templates.update.imageTypeError') || 'Invalid file type. Please upload a JPG, PNG, or WebP image'
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: t('dashboard.templates.update.imageSizeError') || 'File is too large. Maximum size is 5MB'
      }));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);

    // Clear error
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  // Handle adding a feature
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;

    setFormData(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));

    setFeatureInput('');
  };

  // Handle removing a feature
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Handle adding a style
  const handleAddStyle = () => {
    if (!styleInput.trim()) return;

    setFormData(prev => ({
      ...prev,
      style: [...prev.style, styleInput.trim()]
    }));

    setStyleInput('');
  };

  // Handle removing a style
  const handleRemoveStyle = (index) => {
    setFormData(prev => ({
      ...prev,
      style: prev.style.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('dashboard.templates.update.nameRequired') || 'Template name is required';
    }

    if (!formData.componentName.trim()) {
      newErrors.componentName = t('dashboard.templates.update.componentNameRequired') || 'Component name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = t('dashboard.templates.update.categoryRequired') || 'Category is required';
    }

    if (!formData.isFree && (isNaN(formData.price) || formData.price <= 0)) {
      newErrors.price = t('dashboard.templates.update.priceRequired') || 'Valid price is required for non-free templates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !template?._id) {
      return;
    }
    setLocalLoading(true);
    // Create form data for API call
    const templateData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'style' || key === 'features') {
        templateData.append(key, JSON.stringify(formData[key]));
      } else {
        templateData.append(key, formData[key]);
      }
    });
    if (imageFile) {
      templateData.append('imagePreview', imageFile);
    }
    try {
      const result = await dispatch(updateTemplate(template._id, templateData));
      setLocalLoading(false);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      setLocalLoading(false);
      console.error('Error updating template:', error);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Template: ${template?.name || ''}`}
      maxWidth="max-w-3xl"
      onSubmit={handleSubmit}
      isLoading={localLoading}
      submitText="Update Template"
    >
      {/* Form Content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.name') || 'Template Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('dashboard.templates.update.namePlaceholder') || 'Enter template name'}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Component Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.componentName') || 'Component Name'} *
              </label>
              <input
                type="text"
                name="componentName"
                value={formData.componentName}
                onChange={handleChange}
                placeholder={t('dashboard.templates.update.componentNamePlaceholder') || 'Enter component name (e.g., ModernCoffee)'}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.componentName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.componentName && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.componentName}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.category') || 'Category'} *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder={t('dashboard.templates.update.categoryPlaceholder') || 'Enter category (e.g., coffee, restaurant)'}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.category
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Price and Free Toggle */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('dashboard.templates.update.isFree') || 'Free Template'}
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('dashboard.templates.update.price') || 'Price (DH)'} *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Demo Path */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.demoPath') || 'Demo Path'}
              </label>
              <input
                type="text"
                name="demoPath"
                value={formData.demoPath}
                onChange={handleChange}
                placeholder={t('dashboard.templates.update.demoPathPlaceholder') || 'Enter demo path (e.g., /templates/coffee-modern)'}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {t('dashboard.templates.update.isPublished') || 'Publish Template'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('dashboard.templates.update.isPublishedDescription') || 'Make this template visible to users'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            {/* Template Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.image') || 'Template Image'}
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center ${
                  errors.image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } hover:border-primary transition-colors cursor-pointer`}
                onClick={() => fileInputRef.current.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Template preview"
                      className="mx-auto max-h-48 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                      >
                        <span>{t('dashboard.templates.update.uploadImage') || 'Upload an image'}</span>
                      </label>
                      <p className="pl-1">{t('dashboard.templates.update.dragDrop') || 'or drag and drop'}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('dashboard.templates.update.imageRequirements') || 'PNG, JPG, WebP up to 5MB'}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.description') || 'Description'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('dashboard.templates.update.descriptionPlaceholder') || 'Enter template description'}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.features') || 'Features'}
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder={t('dashboard.templates.update.featurePlaceholder') || 'Add a feature'}
                  className="flex-1 px-4 py-3 rounded-l-xl border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-3 bg-primary text-white rounded-r-xl hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-primary hover:text-red-500 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dashboard.templates.update.styles') || 'Styles'}
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={styleInput}
                  onChange={(e) => setStyleInput(e.target.value)}
                  placeholder={t('dashboard.templates.update.stylePlaceholder') || 'Add a style (e.g., modern, minimalist)'}
                  className="flex-1 px-4 py-3 rounded-l-xl border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStyle();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddStyle}
                  className="px-4 py-3 bg-primary text-white rounded-r-xl hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.style.map((style, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-secondary2/10 text-secondary2 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{style}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStyle(index)}
                      className="text-secondary2 hover:text-red-500 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default UpdateTemplateModal;
