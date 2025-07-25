import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSave, FiAlertCircle, FiCheckCircle, FiUpload, FiType, FiFileText, FiCrop, FiCheck, FiX } from 'react-icons/fi';
import { MdImage } from 'react-icons/md';
import Cropper from 'react-easy-crop';
import { useTheme } from '../../../context/ThemeContext';

const ExtractedCategoryForm = ({ categoryName, onSubmit, onSuccess }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: categoryName || '',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [originalImage, setOriginalImage] = useState(null);

  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [isCreated, setIsCreated] = useState(false);

  // Crop complete callback
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply the crop
  const applyCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageDimensions({ width: 800, height: 800 });
        setShowCropper(false);

        // Create a file from the blob
        const croppedFile = new File([croppedImage], originalImage.name, {
          type: originalImage.type,
          lastModified: new Date().getTime()
        });

        // Update form data with the cropped image
        setFormData({ ...formData, image: croppedFile });
      };
      reader.readAsDataURL(croppedImage);
    } catch (e) {
      console.error('Error applying crop:', e);
      setErrors({ ...errors, image: 'Error cropping image' });
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    setShowCropper(false);
    setCropImageSrc('');
    // If this is a new image upload (not editing), clear the image
    if (!imagePreview) {
      setOriginalImage(null);
      setFormData({ ...formData, image: null });
    }
  };

  // Helper function to create a cropped image
  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        // Fill with white background (for transparent images)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the cropped image
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          800,
          800
        );

        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, originalImage.type);
      };

      image.onerror = () => {
        reject(new Error('Error loading image'));
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('dashboard.forms.category.nameRequired') || 'Category name is required';
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If image is not 800x800 and we're not in the cropper, show the cropper
    // Only check for File objects (new uploads), not for existing image URLs
    if (formData.image instanceof File && (imageDimensions.width !== 800 || imageDimensions.height !== 800) && !showCropper) {
      // Read the image for the cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(formData.image);
      return;
    }

    setLoading(true);
    setFormStatus({ message: '', type: '' });

    try {
      await onSubmit(formData);
      setFormStatus({
        message: t('dashboard.products.categories.createSuccess') || 'Category created successfully',
        type: 'success'
      });
      setIsCreated(true);
      if (onSuccess) onSuccess(formData.name);
    } catch (error) {
      setFormStatus({
        message: error.message || t('dashboard.common.error') || 'An error occurred',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setErrors({ ...errors, image: '' });

    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: t('dashboard.forms.category.imageTypeError') || 'Invalid image type' });
        return;
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors({ ...errors, image: t('dashboard.forms.category.imageSizeError') || 'Image too large' });
        return;
      }

      // Store the original file and prepare for cropping
      setOriginalImage(file);

      // Create a preview for the cropper
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          // Always show the cropper for any image
          setCropImageSrc(reader.result);
          setShowCropper(true);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);

      // Store the actual file for upload
      setFormData({ ...formData, image: file });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // If the category has been created, show a success message
  if (isCreated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 rounded-lg mb-4 ${
          darkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-100 text-green-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5" />
          <span className="font-medium">{formData.name} - {t('dashboard.products.categories.createSuccess')}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg mb-4">
      {/* Status message */}
      {formStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg flex items-center gap-2 mb-4 ${
            formStatus.type === 'success'
              ? darkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-100 text-green-600'
              : darkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-600'
          }`}
        >
          {formStatus.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{formStatus.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - Image Upload */}
        <div className="md:col-span-1">
          <div className="flex justify-between items-center mb-2">
            <label className={`block text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('dashboard.forms.category.image')}
            </label>
          </div>

          {/* Image Cropper Modal */}
          {showCropper && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className={`rounded-lg w-full max-w-3xl overflow-hidden ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`p-4 flex justify-between items-center border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <h3 className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Crop Image to 800x800px</h3>
                  <button
                    type="button"
                    className={`${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={cancelCrop}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative h-[400px] w-full">
                  <Cropper
                    image={cropImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    objectFit="contain"
                  />
                </div>

                <div className={`p-4 flex justify-between border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center">
                    <span className={`mr-2 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>Zoom:</span>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-32"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-md flex items-center gap-1 text-white ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-500 hover:bg-gray-400'
                      }`}
                      onClick={cancelCrop}
                    >
                      <FiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>

                    <button
                      type="button"
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                      onClick={applyCrop}
                    >
                      <FiCheck className="w-4 h-4" />
                      <span>Apply Crop</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-2 text-xs text-center text-gray-500">
            {t('dashboard.forms.category.recommendedSize') || 'Recommended size'}: 800x800px
          </div>

          {imagePreview ? (
            <div className="relative group mb-3">
              <img
                src={imagePreview}
                alt="Category preview"
                className="w-full h-[120px] object-cover rounded-lg border-2 border-primary/20"
              />

              {/* Image dimensions indicator */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                {imageDimensions.width} x {imageDimensions.height}px
                {imageDimensions.width === 800 && imageDimensions.height === 800 ?
                  <span className="ml-1 text-green-400">• Optimal</span> :
                  <span className="ml-1 text-yellow-400">• Not optimal</span>
                }
              </div>

              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-lg"
              >
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="bg-primary/80 hover:bg-primary text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <FiUpload className="w-4 h-4" />
                    <span>{t('dashboard.forms.category.changeImage')}</span>
                  </button>

                  {/* Only show crop button for new uploads, not for existing images */}
                  {originalImage && (imageDimensions.width !== 800 || imageDimensions.height !== 800) && (
                    <button
                      type="button"
                      className="bg-green-600/80 hover:bg-green-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                      onClick={() => {
                        // If we have the original image, show the cropper
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCropImageSrc(reader.result);
                          setShowCropper(true);
                        };
                        reader.readAsDataURL(originalImage);
                      }}
                    >
                      <FiCrop className="w-4 h-4" />
                      <span>Crop Image</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className={`w-full h-[120px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                darkMode
                  ? 'border-gray-500 hover:border-primary'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <MdImage className={`w-8 h-8 mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{t('dashboard.forms.category.addImage')}</span>
              <span className={`text-xs mt-1 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>JPG, PNG, WebP • {t('dashboard.forms.category.maxSize')}: 5MB</span>
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
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}
        </div>

        {/* Right column - Form Fields */}
        <div className="md:col-span-2 space-y-4">
          {/* Category Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('dashboard.forms.category.name')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiType className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                  ${darkMode
                    ? `bg-secondary1/50 text-white ${errors.name ? 'border-red-500' : 'border-primary/20'}`
                    : `bg-white text-gray-800 ${errors.name ? 'border-red-500' : 'border-gray-300'}`
                  }`}
                placeholder={t('dashboard.forms.category.namePlaceholder') || 'Enter category name'}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category Description */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('dashboard.forms.category.description')}
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FiFileText className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                  ${darkMode
                    ? 'bg-secondary1/50 border-primary/20 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                  }`}
                placeholder={t('dashboard.forms.category.descriptionPlaceholder') || 'Enter category description'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white
                ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} transition-colors`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{t('dashboard.common.creating')}</span>
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  <span>{t('dashboard.forms.create')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ExtractedCategoryForm;
