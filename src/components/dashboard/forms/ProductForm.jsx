import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSave, FiAlertCircle, FiCheckCircle, FiUpload, FiType, FiFileText, FiDollarSign, FiTag, FiList, FiEye, FiEyeOff, FiCrop, FiCheck, FiX, FiHash, FiStar } from 'react-icons/fi';
import { MdImage, MdLocalFireDepartment, MdOutlineEmojiFoodBeverage, MdOutlineRestaurantMenu, MdOutlineLocalFireDepartment } from 'react-icons/md';
import { GiChiliPepper, GiMeat } from 'react-icons/gi';
import Cropper from 'react-easy-crop';
import { useTheme } from '../../../context/ThemeContext';

const ProductForm = ({ product, categories = [], categoryId, onSubmit, isUpdate = false }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: product?.nom || '',
    description: product?.description || '',
    price: product?.prix || '',
    promoPrice: product?.promo_prix || '',
    categoryId: product?.categorie?._id || categoryId || '',
    image: product?.image || null,
    components: Array.isArray(product?.composant) ? product?.composant.join(', ') : '',
    visible: product?.visible ?? true,
    // New attributes
    isVegetarian: product?.isVegetarian ?? false,
    isSpicy: product?.isSpicy ?? false,
    isHalal: product?.isHalal ?? false,
    isBest: product?.isBest ?? false,
    calories: (product?.calories !== undefined && product?.calories !== null && !isNaN(product?.calories)) ? product.calories : '',
    tags: Array.isArray(product?.tags) ? product?.tags.join(', ') : ''
  });

  console.log('Initial form data:', { product, categoryId, formData });

  const [imagePreview, setImagePreview] = useState(
    product?.image?.url || ''
  );

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



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('dashboard.forms.product.nameRequired') || 'Product name is required';
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = t('dashboard.forms.product.priceRequired') || 'Valid price is required';
    }
    if (formData.promoPrice && (isNaN(parseFloat(formData.promoPrice)) || parseFloat(formData.promoPrice) <= 0)) {
      newErrors.promoPrice = t('dashboard.forms.product.promoPriceInvalid') || 'Promo price must be a valid number';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = t('dashboard.forms.product.categoryRequired') || 'Category is required';
    }

    // Validate image - only for new products, not for updates
    if (!isUpdate && !formData.image) {
      newErrors.image = 'Image is required';
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
      // Process components and tags from comma-separated string to array
      const processedFormData = {
        ...formData,
        components: formData.components ? formData.components.split(',').map(item => item.trim()).filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(',').map(item => item.trim()).filter(Boolean) : []
      };

      console.log('Processed form data:', processedFormData);

      await onSubmit(processedFormData);
      setFormStatus({
        message: isUpdate
          ? t('dashboard.products.products.updateSuccess')
          : t('dashboard.products.products.createSuccess'),
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
        setErrors({ ...errors, image: t('dashboard.forms.product.imageTypeError') });
        return;
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors({ ...errors, image: t('dashboard.forms.product.imageSizeError') });
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
    }
  };

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

  // Check dimensions of existing image when component loads
  const checkExistingImageDimensions = () => {
    if (imagePreview && typeof imagePreview === 'string' && imagePreview.startsWith('http')) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        // Handle error loading image
        setImageDimensions({ width: 0, height: 0 });
      };
      img.src = imagePreview;
    }
  };

  // Call once when component mounts
  useState(() => {
    if (imagePreview) {
      checkExistingImageDimensions();
    }
  });

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
              ? darkMode ? 'bg-green-500/10 text-green-500' : 'bg-green-100 text-green-600'
              : darkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-600'
          }`}
        >
          {formStatus.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{formStatus.message}</span>
        </motion.div>
      )}

      {/* Image Upload Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className={`block text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('dashboard.forms.product.image')}
          </label>
          <span className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {t('dashboard.forms.product.imageRequirements.recommended')}: 800x800px
          </span>
        </div>

        <div className="flex flex-col items-center">
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

          {imagePreview ? (
            <div className="relative group mb-3">
              <img
                src={imagePreview}
                alt="Product preview"
                className={`w-full h-[200px] object-cover rounded-lg border-2 transition-colors ${
                  darkMode
                    ? 'border-primary/20 group-hover:border-primary/50'
                    : 'border-primary/30 group-hover:border-primary/70'
                }`}
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
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className="bg-primary/80 hover:bg-primary text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <FiUpload className="w-4 h-4" />
                    <span>{t('dashboard.forms.product.changeImage')}</span>
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
              className={`w-full h-[150px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors mb-3 ${
                darkMode
                  ? 'border-gray-500 hover:border-primary'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <MdImage className={`w-10 h-10 mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <span className={`${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{t('dashboard.forms.product.addImage')}</span>
              <span className={`text-xs mt-1 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>{t('dashboard.forms.product.imageRequirements.format')} • {t('dashboard.forms.product.imageRequirements.size')}</span>
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

      {/* Product Name */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('dashboard.forms.product.name')} *
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
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? `bg-secondary1/50 text-white ${errors.name ? 'border-red-500' : 'border-primary/20'}`
                : `bg-white text-gray-800 ${errors.name ? 'border-red-500' : 'border-gray-300'}`
              }`}
            placeholder={t('dashboard.forms.product.namePlaceholder') || 'Enter product name'}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('dashboard.forms.product.category')} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiTag className={`h-5 w-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none
              ${darkMode
                ? `bg-secondary1/50 text-white ${errors.categoryId ? 'border-red-500' : 'border-primary/20'}`
                : `bg-white text-gray-800 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`
              }`}
          >
            <option value="">{t('dashboard.forms.product.selectCategory')}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.nom}
              </option>
            ))}
          </select>
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
            darkMode ? 'text-white' : 'text-gray-700'
          }`}>
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {errors.categoryId && (
          <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
        )}
      </div>

      {/* Product Description */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('dashboard.forms.product.description')}
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
            rows="3"
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? 'bg-secondary1/50 border-primary/20 text-white'
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            placeholder={t('dashboard.forms.product.descriptionPlaceholder') || 'Enter product description'}
          />
        </div>
      </div>

      {/* Price Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Regular Price */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('dashboard.forms.product.price')} *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className={`h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
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
                  : `bg-white text-gray-800 ${errors.price ? 'border-red-500' : 'border-gray-300'}`
                }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        {/* Promo Price */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('dashboard.forms.product.promo_price')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className={`h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              name="promoPrice"
              value={formData.promoPrice}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                ${darkMode
                  ? `bg-secondary1/50 text-white ${errors.promoPrice ? 'border-red-500' : 'border-primary/20'}`
                  : `bg-white text-gray-800 ${errors.promoPrice ? 'border-red-500' : 'border-gray-300'}`
                }`}
              placeholder="0.00"
            />
          </div>
          {errors.promoPrice && (
            <p className="text-red-500 text-xs mt-1">{errors.promoPrice}</p>
          )}
        </div>
      </div>

      {/* Components */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('dashboard.forms.product.components')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiList className={`h-5 w-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <input
            type="text"
            name="components"
            value={formData.components}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? 'bg-secondary1/50 border-primary/20 text-white'
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            placeholder={t('dashboard.forms.product.componentsPlaceholder') || 'Enter components separated by commas'}
          />
        </div>
        <p className={`text-xs mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>{t('dashboard.forms.product.componentsHelp')}</p>
      </div>

      {/* Tags */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('dashboard.forms.product.tags') || 'Tags'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiHash className={`h-5 w-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? 'bg-secondary1/50 border-primary/20 text-white'
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            placeholder={t('dashboard.forms.product.tagsPlaceholder') || 'Enter tags separated by commas'}
          />
        </div>
        <p className={`text-xs mt-1 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>{t('dashboard.forms.product.tagsHelp') || 'Separate tags with commas (e.g., spicy, popular, new)'}</p>
      </div>

      {/* Calories */}
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {t('dashboard.forms.product.calories') || 'Calories'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdOutlineRestaurantMenu className={`h-5 w-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              ${darkMode
                ? 'bg-secondary1/50 border-primary/20 text-white'
                : 'bg-white border-gray-300 text-gray-800'
              }`}
            placeholder={t('dashboard.forms.product.caloriesPlaceholder') || 'Enter calories (e.g., 250)'}
          />
        </div>
      </div>

      {/* Product Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Vegetarian Toggle */}
        <div className="flex items-center space-x-3">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="isVegetarian"
              id="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
            />
            <label
              htmlFor="isVegetarian"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.isVegetarian ? 'bg-green-500' : 'bg-gray-600'}`}
            ></label>
          </div>
          <label htmlFor="isVegetarian" className={`text-sm font-medium cursor-pointer flex items-center ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <MdOutlineEmojiFoodBeverage className={`mr-1 ${formData.isVegetarian ? 'text-green-500' : ''}`} />
            {t('dashboard.forms.product.vegetarian') || 'Vegetarian'}
          </label>
        </div>

        {/* Spicy Toggle */}
        <div className="flex items-center space-x-3">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="isSpicy"
              id="isSpicy"
              checked={formData.isSpicy}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
            />
            <label
              htmlFor="isSpicy"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.isSpicy ? 'bg-red-500' : 'bg-gray-600'}`}
            ></label>
          </div>
          <label htmlFor="isSpicy" className={`text-sm font-medium cursor-pointer flex items-center ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <GiChiliPepper className={`mr-1 ${formData.isSpicy ? 'text-red-500' : ''}`} />
            {t('dashboard.forms.product.spicy') || 'Spicy'}
          </label>
        </div>

        {/* Halal Toggle */}
        <div className="flex items-center space-x-3">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="isHalal"
              id="isHalal"
              checked={formData.isHalal}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
            />
            <label
              htmlFor="isHalal"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.isHalal ? 'bg-blue-500' : 'bg-gray-600'}`}
            ></label>
          </div>
          <label htmlFor="isHalal" className={`text-sm font-medium cursor-pointer flex items-center ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <GiMeat className={`mr-1 ${formData.isHalal ? 'text-blue-500' : ''}`} />
            {t('dashboard.forms.product.halal') || 'Halal'}
          </label>
        </div>

        {/* Best Product Toggle */}
        <div className="flex items-center space-x-3">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              name="isBest"
              id="isBest"
              checked={formData.isBest}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
            />
            <label
              htmlFor="isBest"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.isBest ? 'bg-yellow-500' : 'bg-gray-600'}`}
            ></label>
          </div>
          <label htmlFor="isBest" className={`text-sm font-medium cursor-pointer flex items-center ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <FiStar className={`mr-1 ${formData.isBest ? 'text-yellow-500' : ''}`} />
            {t('dashboard.forms.product.best') || 'Best Product'}
          </label>
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center space-x-3 pt-4">
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            name="visible"
            id="visible"
            checked={formData.visible}
            onChange={handleChange}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
          />
          <label
            htmlFor="visible"
            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.visible ? 'bg-primary' : 'bg-gray-600'}`}
          ></label>
        </div>
        <label htmlFor="visible" className={`text-sm font-medium cursor-pointer flex items-center ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {formData.visible ? <FiEye className="mr-1" /> : <FiEyeOff className="mr-1" />}
          {formData.visible ? t('dashboard.forms.product.visible') : t('dashboard.forms.product.hidden')}
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white
            ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} transition-colors`}
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
          border-color: #3768e5;
        }
        .toggle-label {
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>
    </form>
  );
};

export default ProductForm;
