import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiSave, FiX, FiUpload, FiBriefcase, FiMapPin, FiPhone, FiInfo, FiTag, FiGlobe, FiFacebook, FiInstagram, FiLinkedin, FiMessageCircle, FiAlertCircle, FiCheckCircle, FiExternalLink, FiClock, FiPlus, FiTrash2, FiLink, FiEye, FiCrop, FiCheck } from 'react-icons/fi';
import { FaPinterest, FaSnapchat, FaTiktok, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateBusiness } from '../../redux/apiCalls/businessApiCalls';
import Cropper from 'react-easy-crop';

// Validate Moroccan phone number
const validateMoroccanPhone = (phone) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it's a valid Moroccan number
  // Valid formats: 06XXXXXXXX, 07XXXXXXXX, +2126XXXXXXXX, +2127XXXXXXXX
  const moroccanRegex = /^(?:(?:\+|00)212|0)[67]\d{8}$/;
  return moroccanRegex.test(phone);
};

// Format phone number to Moroccan standard format
const formatMoroccanPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // If it starts with 0, replace with +212
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return `+212${digitsOnly.substring(1)}`;
  }

  // If it's just 9 digits (without the leading 0 or country code)
  if (digitsOnly.length === 9 && (digitsOnly.startsWith('6') || digitsOnly.startsWith('7'))) {
    return `+212${digitsOnly}`;
  }

  // If it already has the country code
  if (digitsOnly.startsWith('212') && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }

  // If it already has the + and country code
  if (digitsOnly.startsWith('212') && digitsOnly.length === 12) {
    return `+${digitsOnly}`;
  }

  // Return as is if it doesn't match expected patterns
  return phone;
};



const BusinessSettings = ({ businessData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [phoneErrors, setPhoneErrors] = useState({});

  const defaultData = {
    _id: "",
    nom: "",
    description: "",
    bio: "",
    type: "",
    ville: "",
    adress: "",
    tele: "",
    logo: {
      url: "https://via.placeholder.com/400x400?text=Business+Logo",
      publicId: null
    },
    coverImage: {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      publicId: null
    },
    socialMedia: {},
    // New fields
    operatingHours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false }
    },
    tags: [],
    website: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [businessInfo, setBusinessInfo] = useState(businessData || defaultData);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });

  // Cover image cropping state
  const [showCoverCropper, setShowCoverCropper] = useState(false);
  const [coverCrop, setCoverCrop] = useState({ x: 0, y: 0 });
  const [coverZoom, setCoverZoom] = useState(1);
  const [coverCroppedAreaPixels, setCoverCroppedAreaPixels] = useState(null);
  const [coverCropImageSrc, setCoverCropImageSrc] = useState('');
  const [originalCoverImage, setOriginalCoverImage] = useState(null);

  // Business types for dropdown
  const businessTypes = [
    { value: 'coffee', label: t('business.types.coffee') || 'Coffee Shop' },
    { value: 'restaurant', label: t('business.types.restaurant') || 'Restaurant' },
    { value: 'snack', label: t('business.types.snack') || 'Snack Bar' },
    { value: 'coffeeToGo', label: t('business.types.coffeeToGo') || 'Coffee To Go' },
    { value: 'bakery', label: t('business.types.bakery') || 'Bakery' },
    { value: 'pizzeria', label: t('business.types.pizzeria') || 'Pizzeria' },
    { value: 'other', label: t('business.types.other') || 'Other' }
  ];

  // Fix for getSocialMediaLink function name
  const generateSocialMediaLink = (platform, value) => {
    if (!value) return '';

    switch (platform) {
      case 'facebook':
        return value.startsWith('http') ? value : `https://facebook.com/${value}`;
      case 'instagram':
        return value.startsWith('http') ? value : `https://instagram.com/${value}`;
      case 'linkedin':
        return value.startsWith('http') ? value : `https://linkedin.com/in/${value}`;
      case 'pinterest':
        return value.startsWith('http') ? value : `https://pinterest.com/${value}`;
      case 'snapchat':
        return value.startsWith('http') ? value : `https://snapchat.com/add/${value}`;
      case 'tiktok':
        return value.startsWith('http') ? value : `https://tiktok.com/@${value}`;
      case 'whatsapp':
        // Format: https://wa.me/212XXXXXXXXX (no + sign in the URL)
        const whatsappNumber = formatMoroccanPhone(value).replace('+', '');
        return `https://wa.me/${whatsappNumber}`;
      case 'telegram':
        // Format: https://t.me/+212XXXXXXXXX or username
        if (value.startsWith('@') || !validateMoroccanPhone(value)) {
          // It's a username
          const username = value.startsWith('@') ? value.substring(1) : value;
          return `https://t.me/${username}`;
        } else {
          // It's a phone number
          const telegramNumber = formatMoroccanPhone(value);
          return `https://t.me/${telegramNumber}`;
        }
      default:
        return value.startsWith('http') ? value : `https://${value}`;
    }
  };

  // Social media fields
  const socialMediaFields = [
    { name: 'facebook', icon: <FiFacebook />, label: 'Facebook' },
    { name: 'instagram', icon: <FiInstagram />, label: 'Instagram' },
    { name: 'linkedin', icon: <FiLinkedin />, label: 'LinkedIn' },
    { name: 'pinterest', icon: <FaPinterest />, label: 'Pinterest' },
    { name: 'snapchat', icon: <FaSnapchat />, label: 'Snapchat' },
    { name: 'tiktok', icon: <FaTiktok />, label: 'TikTok' },
    { name: 'whatsapp', icon: <FiMessageCircle />, label: 'WhatsApp' },
    { name: 'telegram', icon: <FaTelegram />, label: 'Telegram' }
  ];

  // Custom type state
  const [showCustomType, setShowCustomType] = useState(false);
  const [customType, setCustomType] = useState('');

  // Tags state
  const [tagInput, setTagInput] = useState('');

  // Operating hours state
  const [daysOfWeek] = useState([
    { id: 'monday', label: t('business.days.monday') || 'Monday' },
    { id: 'tuesday', label: t('business.days.tuesday') || 'Tuesday' },
    { id: 'wednesday', label: t('business.days.wednesday') || 'Wednesday' },
    { id: 'thursday', label: t('business.days.thursday') || 'Thursday' },
    { id: 'friday', label: t('business.days.friday') || 'Friday' },
    { id: 'saturday', label: t('business.days.saturday') || 'Saturday' },
    { id: 'sunday', label: t('business.days.sunday') || 'Sunday' }
  ]);

  // Update local state when businessData changes
  useEffect(() => {
    if (businessData) {
      // Initialize default operating hours structure
      const defaultOperatingHours = {
        monday: { open: "", close: "", closed: false },
        tuesday: { open: "", close: "", closed: false },
        wednesday: { open: "", close: "", closed: false },
        thursday: { open: "", close: "", closed: false },
        friday: { open: "", close: "", closed: false },
        saturday: { open: "", close: "", closed: false },
        sunday: { open: "", close: "", closed: false }
      };

      // Merge existing operating hours with default structure
      const mergedOperatingHours = { ...defaultOperatingHours };
      if (businessData.operatingHours) {
        Object.keys(businessData.operatingHours).forEach(day => {
          if (mergedOperatingHours[day]) {
            mergedOperatingHours[day] = {
              open: businessData.operatingHours[day]?.open || "",
              close: businessData.operatingHours[day]?.close || "",
              closed: businessData.operatingHours[day]?.closed || false
            };
          }
        });
      }

      // Ensure all required fields are initialized
      const updatedBusinessData = {
        ...businessData,
        bio: businessData.bio || "",
        socialMedia: businessData.socialMedia || {},
        operatingHours: mergedOperatingHours,
        tags: businessData.tags || [],
        website: businessData.website || ""
      };

      setBusinessInfo(updatedBusinessData);

      // Check if the business type is not in our predefined list
      const isCustomType = !businessTypes.some(type =>
        type.value === businessData.type?.toLowerCase().replace(/\s+/g, '')
      );

      if (isCustomType) {
        setShowCustomType(true);
        setCustomType(businessData.type || '');
      } else {
        setShowCustomType(false);
        setCustomType('');
      }
    }
  }, [businessData]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    let timer;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for type selection
    if (name === 'type') {
      const isOther = value === 'other';
      setShowCustomType(isOther);

      if (!isOther) {
        setCustomType('');
      }
    }

    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomTypeChange = (e) => {
    setCustomType(e.target.value);
  };

  // Handle operating hours changes
  const handleOperatingHoursChange = (day, field, value) => {
    setBusinessInfo(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: field === 'closed' ? !prev.operatingHours[day].closed : value
        }
      }
    }));
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !businessInfo.tags.includes(tagInput.trim())) {
      setBusinessInfo(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setBusinessInfo(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle website change
  const handleWebsiteChange = (e) => {
    setBusinessInfo(prev => ({
      ...prev,
      website: e.target.value
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;

    // Special handling for WhatsApp and Telegram fields (phone numbers)
    if (name === 'whatsapp' || name === 'telegram') {
      // Validate the phone number
      const isValid = validateMoroccanPhone(value);

      // Update error state
      setPhoneErrors(prev => ({
        ...prev,
        [name]: value && !isValid ? t('business.settings.invalidMoroccanPhone') || 'Please enter a valid Moroccan phone number' : ''
      }));

      // Format the phone number if it's valid
      const formattedValue = isValid ? formatMoroccanPhone(value) : value;

      setBusinessInfo(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [name]: formattedValue
        }
      }));
    } else {
      // Normal handling for other social media fields
      setBusinessInfo(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ message: '', type: '' });

    const updateData = {
      nom: businessInfo.nom,
      description: businessInfo.description,
      bio: businessInfo.bio,
      type: showCustomType ? customType : businessInfo.type,
      ville: businessInfo.ville,
      adress: businessInfo.adress,
      tele: businessInfo.tele,
      socialMedia: businessInfo.socialMedia,
      // New fields
      operatingHours: businessInfo.operatingHours,
      tags: businessInfo.tags,
      website: businessInfo.website
    };
    if (selectedFile) updateData.logo = selectedFile;
    if (selectedCoverFile) updateData.coverImage = selectedCoverFile;

    // Immediately switch to view mode and update directly without waiting for response
    setEditMode(false);
    dispatch(updateBusiness(businessInfo._id, updateData));
    setShowSuccessMessage(true);
  };

  const handleCancel = () => {
    // Reset form to original data
    if (businessData) {
      // Initialize default operating hours structure
      const defaultOperatingHours = {
        monday: { open: "", close: "", closed: false },
        tuesday: { open: "", close: "", closed: false },
        wednesday: { open: "", close: "", closed: false },
        thursday: { open: "", close: "", closed: false },
        friday: { open: "", close: "", closed: false },
        saturday: { open: "", close: "", closed: false },
        sunday: { open: "", close: "", closed: false }
      };

      // Merge existing operating hours with default structure
      const mergedOperatingHours = { ...defaultOperatingHours };
      if (businessData.operatingHours) {
        Object.keys(businessData.operatingHours).forEach(day => {
          if (mergedOperatingHours[day]) {
            mergedOperatingHours[day] = {
              open: businessData.operatingHours[day]?.open || "",
              close: businessData.operatingHours[day]?.close || "",
              closed: businessData.operatingHours[day]?.closed || false
            };
          }
        });
      }

      // Reset business info with properly initialized fields
      setBusinessInfo({
        ...businessData,
        bio: businessData.bio || "",
        socialMedia: businessData.socialMedia || {},
        operatingHours: mergedOperatingHours,
        tags: businessData.tags || [],
        website: businessData.website || ""
      });

      // Reset custom type state
      const isCustomType = !businessTypes.some(type =>
        type.value === businessData.type?.toLowerCase().replace(/\s+/g, '')
      );

      if (isCustomType) {
        setShowCustomType(true);
        setCustomType(businessData.type || '');
      } else {
        setShowCustomType(false);
        setCustomType('');
      }
    }

    // Clear selected files and previews
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedCoverFile(null);
    setCoverPreviewUrl(null);

    // Clear cropping states
    setShowCoverCropper(false);
    setCoverCropImageSrc('');
    setOriginalCoverImage(null);

    // Clear form status and success message
    setFormStatus({ message: '', type: '' });
    setShowSuccessMessage(false);

    // Exit edit mode
    setEditMode(false);
  };

  // Cover image crop complete callback
  const onCoverCropComplete = useCallback((_, croppedAreaPixels) => {
    setCoverCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply the cover image crop
  const applyCoverCrop = async () => {
    if (!coverCropImageSrc || !coverCroppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedCoverImg(coverCropImageSrc, coverCroppedAreaPixels);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreviewUrl(reader.result);
        setShowCoverCropper(false);

        // Create a file from the blob
        const croppedFile = new File([croppedImage], originalCoverImage.name, {
          type: originalCoverImage.type,
          lastModified: new Date().getTime()
        });

        // Update selected cover file with the cropped image
        setSelectedCoverFile(croppedFile);
      };
      reader.readAsDataURL(croppedImage);
    } catch (e) {
      console.error('Error applying cover crop:', e);
      setFormStatus({
        message: t('business.settings.processingError') || 'Error cropping image. Please try another image.',
        type: 'error'
      });
    }
  };

  // Cancel cover image cropping
  const cancelCoverCrop = () => {
    setShowCoverCropper(false);
    setCoverCropImageSrc('');
    // If this is a new image upload (not editing), clear the image
    if (!coverPreviewUrl) {
      setOriginalCoverImage(null);
      setSelectedCoverFile(null);
    }
  };

  // Helper function to create a cropped cover image (16:9 aspect ratio)
  const getCroppedCoverImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        // Use 16:9 aspect ratio for cover images (1600x900 for good quality)
        canvas.width = 1600;
        canvas.height = 900;
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
          1600,
          900
        );

        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, originalCoverImage.type);
      };

      image.onerror = () => {
        reject(new Error('Error loading image'));
      };
    });
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
            message: t('business.settings.invalidFileType') || 'Invalid file type. Please upload an image file.',
            type: 'error'
          });
          return;
        }

        const maxSize = 1 * 1024 * 1024;

        let fileToUpload = file;
        if (file.size > maxSize) {
          setFormStatus({
            message: t('business.settings.compressingImage') || 'Image is large, compressing...',
            type: 'info'
          });

          fileToUpload = await compressImage(file);

          if (fileToUpload.size > maxSize) {
            setFormStatus({
              message: t('business.settings.stillTooLarge') || 'Image is still too large after compression. Please select a smaller image (max 1MB).',
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
          message: t('business.settings.processingError') || 'Error processing image. Please try another image.',
          type: 'error'
        });
      }
    }
  };

  const handleCoverFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setFormStatus({
            message: t('business.settings.invalidFileType') || 'Invalid file type. Please upload an image file.',
            type: 'error'
          });
          return;
        }

        const maxSize = 1 * 1024 * 1024;
        let fileToUpload = file;
        if (file.size > maxSize) {
          setFormStatus({
            message: t('business.settings.compressingImage') || 'Image is large, compressing...',
            type: 'info'
          });

          fileToUpload = await compressImage(file, 1600, 900, 0.8); // 16:9 ratio for cover images

          if (fileToUpload.size > maxSize) {
            setFormStatus({
              message: t('business.settings.stillTooLarge') || 'Image is still too large after compression. Please select a smaller image (max 1MB).',
              type: 'error'
            });
            return;
          }

          setFormStatus({ message: '', type: '' });
        }

        // Store the original file for cropping
        setOriginalCoverImage(fileToUpload);

        // Create a preview for the cropper
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setCoverCropImageSrc(fileReader.result);
          setShowCoverCropper(true);
        };
        fileReader.readAsDataURL(fileToUpload);
      } catch (error) {
        setFormStatus({
          message: t('business.settings.processingError') || 'Error processing image. Please try another image.',
          type: 'error'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
      {/* Cover Image Header Section */}
      <div className="relative w-full h-48 md:h-64 lg:h-72">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative w-full h-full overflow-hidden"
        >
          <img
            src={coverPreviewUrl || (businessInfo.coverImage && businessInfo.coverImage.url) || defaultData.coverImage.url}
            alt={businessInfo.nom ? `${businessInfo.nom} Cover` : 'Business Cover'}
            className="w-full h-full object-cover transition-all duration-300"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Cover Image Upload Button */}
          {editMode && (
            <label htmlFor="cover-upload" className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-black/70 transition-all duration-300 group">
              <FiUpload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <input type="file" id="cover-upload" className="hidden" accept="image/*" onChange={handleCoverFileSelect} />
            </label>
          )}

          {/* Business Name and Type - Bottom left of cover */}
          <div className="absolute bottom-6 left-6 md:left-8 text-white">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
              {businessInfo.nom || 'Business Name'}
            </h1>
            <span className="inline-block px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm md:text-base font-medium border border-white/30">
              {businessInfo.type || 'Business Type'}
            </span>
          </div>
        </motion.div>

        {/* Business Logo - Positioned outside cover container to prevent clipping */}
        <div className="absolute -bottom-10 right-4 md:right-6 lg:right-8 z-30">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-800">
              <img
                src={previewUrl || (businessInfo.logo && businessInfo.logo.url) || defaultData.logo.url}
                alt={businessInfo.nom || 'Business Logo'}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            {editMode && (
              <label htmlFor="logo-upload" className="absolute -bottom-2 -right-2 bg-primary text-white p-2 md:p-3 rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-all duration-300 group-hover:scale-110 z-40">
                <FiUpload className="w-4 h-4 md:w-5 md:h-5" />
                <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </label>
            )}
          </motion.div>
        </div>
      </div>

      {/* Header Actions and Title */}
      <div className="px-6 md:px-8 pt-14 md:pt-16 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent">
              {t('business.settings.title') || 'Business Settings'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
              {t('business.settings.coverImageHint') || 'Cover Image (Recommended: 16:9 ratio, max 1MB)'}
            </p>
          </div>

          {!editMode ? (
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2b54c7' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/business-profile/${businessInfo._id}`)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-secondary2 rounded-full text-white shadow-lg hover:shadow-secondary2/30 transition-all duration-300"
              >
                <FiEye className="w-5 h-5" />
                <span className="font-medium">{t('business.settings.viewProfile') || 'View Profile'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#2b54c7' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-full text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <FiEdit className="w-5 h-5" />
                <span className="font-medium">{t('business.settings.edit') || 'Edit'}</span>
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-500 rounded-full text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300"
              >
                <FiSave className="w-5 h-5" />
                <span className="font-medium">{t('business.settings.save') || 'Save'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500 rounded-full text-white shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                <FiX className="w-5 h-5" />
                <span className="font-medium">{t('business.settings.cancel') || 'Cancel'}</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border bg-green-50 border-green-200 text-green-700"
        >
          {t('business.settings.updateSuccess') || 'Business updated successfully'}
        </motion.div>
      )}

      {formStatus.message && !showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border bg-red-50 border-red-200 text-red-700"
        >
          {formStatus.message}
        </motion.div>
      )}

      {/* Cover Image Cropper Modal */}
      {showCoverCropper && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="rounded-lg w-full max-w-4xl overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                {t('business.settings.cropCoverImage') || 'Crop Cover Image (16:9 ratio)'}
              </h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                onClick={cancelCoverCrop}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-[500px] w-full">
              <Cropper
                image={coverCropImageSrc}
                crop={coverCrop}
                zoom={coverZoom}
                aspect={16 / 9}
                onCropChange={setCoverCrop}
                onZoomChange={setCoverZoom}
                onCropComplete={onCoverCropComplete}
                objectFit="contain"
              />
            </div>

            <div className="p-4 flex justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="mr-2 text-gray-800 dark:text-white">
                  {t('business.settings.zoom') || 'Zoom'}:
                </span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={coverZoom}
                  onChange={(e) => setCoverZoom(Number(e.target.value))}
                  className="w-32"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md flex items-center gap-1 text-white bg-gray-500 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={cancelCoverCrop}
                >
                  <FiX className="w-4 h-4" />
                  <span>{t('business.settings.cancel') || 'Cancel'}</span>
                </button>

                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                  onClick={applyCoverCrop}
                >
                  <FiCheck className="w-4 h-4" />
                  <span>{t('business.settings.applyCrop') || 'Apply Crop'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Information Summary Card */}
      <div className="px-6 md:px-8 pb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-inner border border-gray-200/50 dark:border-gray-600/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{t('business.settings.createdAt') || 'Created At'}:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatDate(businessInfo.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{t('business.settings.updatedAt') || 'Last Updated'}:</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatDate(businessInfo.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="px-6 md:px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiBriefcase className="mr-3 text-primary" />
              {t('business.settings.basicInfo') || 'Basic Information'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.name') || 'Business Name'}
                </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiBriefcase className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  name="nom"
                  value={businessInfo.nom}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder={t('business.settings.namePlaceholder') || 'Enter business name'}
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

              <motion.div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.type') || 'Business Type'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiTag className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <select
                    name="type"
                    value={showCustomType ? 'other' : businessInfo.type}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl
                      ${editMode
                        ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-gray-50 dark:bg-gray-800 border-transparent'}
                      focus:ring-2 focus:ring-primary/20 focus:border-primary
                      text-gray-800 dark:text-white transition-all duration-300
                      placeholder-gray-400 text-base
                      hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed
                      shadow-sm hover:shadow-md group-hover:shadow-lg`}
                  >
                    {businessTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                </div>
              </motion.div>

              {showCustomType && editMode && (
                <motion.div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('business.settings.customType') || 'Custom Business Type'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiTag className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      value={customType}
                      onChange={handleCustomTypeChange}
                      placeholder={t('business.settings.customTypePlaceholder') || 'Enter custom business type'}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl
                        bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600
                        focus:ring-2 focus:ring-primary/20 focus:border-primary
                        text-gray-800 dark:text-white transition-all duration-300
                        placeholder-gray-400 text-base
                        hover:border-primary/50
                        shadow-sm hover:shadow-md group-hover:shadow-lg`}
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.description') || 'Description'}
                </label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
                    <FiInfo className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <textarea
                    name="description"
                    value={businessInfo.description}
                    onChange={handleChange}
                    disabled={!editMode}
                    rows="4"
                    placeholder={t('business.settings.descriptionPlaceholder') || 'Enter business description'}
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

              <motion.div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.bio') || 'Business Bio'}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({(businessInfo.bio || '').length}/500 {t('business.settings.characters') || 'characters'})
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
                    <FiInfo className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <textarea
                    name="bio"
                    value={businessInfo.bio || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    rows="3"
                    maxLength={500}
                    placeholder={t('business.settings.bioPlaceholder') || 'Enter a brief bio about your business (max 500 characters)'}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl
                      ${editMode
                        ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-gray-50 dark:bg-gray-800 border-transparent'}
                      focus:ring-2 focus:ring-primary/20 focus:border-primary
                      text-gray-800 dark:text-white transition-all duration-300
                      placeholder-gray-400 text-base
                      hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed
                      shadow-sm hover:shadow-md group-hover:shadow-lg
                      ${(businessInfo.bio || '').length > 450 ? 'border-amber-400 focus:border-amber-500' : ''}
                      ${(businessInfo.bio || '').length >= 500 ? 'border-red-400 focus:border-red-500' : ''}`}
                  />
                  <div className="absolute bottom-3 right-4 flex items-center pointer-events-none">
                    <div className={`text-xs font-medium transition-colors duration-300 ${
                      (businessInfo.bio || '').length > 450
                        ? (businessInfo.bio || '').length >= 500
                          ? 'text-red-500'
                          : 'text-amber-500'
                        : 'text-gray-400'
                    }`}>
                      {(businessInfo.bio || '').length}/500
                    </div>
                  </div>
                </div>
                {(businessInfo.bio || '').length >= 500 && editMode && (
                  <p className="mt-1 text-sm text-red-500">
                    {t('business.settings.bioMaxLength') || 'Bio has reached the maximum length of 500 characters'}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiPhone className="mr-3 text-primary" />
              {t('business.settings.contactInfo') || 'Contact Information'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <motion.div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.city') || 'City'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiGlobe className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="ville"
                    value={businessInfo.ville}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder={t('business.settings.cityPlaceholder') || 'Enter city'}
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

              <motion.div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.phone') || 'Phone Number'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="tele"
                    value={businessInfo.tele}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder={t('business.settings.phonePlaceholder') || 'Enter phone number'}
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

              <motion.div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.address') || 'Address'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMapPin className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="adress"
                    value={businessInfo.adress}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder={t('business.settings.addressPlaceholder') || 'Enter business address'}
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

              <motion.div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.website') || 'Website URL'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={businessInfo.website || ''}
                    onChange={handleWebsiteChange}
                    disabled={!editMode}
                    placeholder={t('business.settings.websitePlaceholder') || 'https://example.com'}
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
                  {!editMode && businessInfo.website && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <a
                        href={businessInfo.website.startsWith('http') ? businessInfo.website : `https://${businessInfo.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark transition-colors duration-300"
                        title="Open website"
                      >
                        <FiExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiTag className="mr-3 text-primary" />
              {t('business.settings.additionalInfo') || 'Additional Information'}
            </h3>

            <div className="space-y-6">

              {/* Tags */}
              <motion.div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('business.settings.tags') || 'Business Tags'}
                </label>
                {editMode ? (
                  <div className="mb-4">
                    <div className="flex">
                      <div className="relative group flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiTag className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <input
                          type="text"
                          value={tagInput}
                          onChange={handleTagInputChange}
                          className="w-full pl-12 pr-4 py-3.5 border-2 rounded-l-2xl
                            bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600
                            focus:ring-2 focus:ring-primary/20 focus:border-primary
                            text-gray-800 dark:text-white transition-all duration-300
                            placeholder-gray-400 text-base
                            hover:border-primary/50
                            shadow-sm hover:shadow-md group-hover:shadow-lg"
                          placeholder={t('business.settings.addTagPlaceholder') || 'Add a tag'}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addTag}
                        className="bg-primary text-white px-4 py-3.5 rounded-r-2xl hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap mt-3">
                      {businessInfo.tags && businessInfo.tags.map((tag, index) => (
                        <div key={index} className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full px-3 py-1.5 text-sm mr-2 mb-2 flex items-center shadow-sm">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1.5 text-primary/70 hover:text-primary-dark transition-colors duration-300"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                      {(!businessInfo.tags || businessInfo.tags.length === 0) && (
                        <div className="text-gray-500 dark:text-gray-400 text-sm py-1">
                          {t('business.settings.noTags') || 'No tags added yet. Tags help customers find your business.'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap mb-4 py-2">
                    {businessInfo.tags && businessInfo.tags.length > 0 ? (
                      businessInfo.tags.map((tag, index) => (
                        <div key={index} className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full px-3 py-1.5 text-sm mr-2 mb-2 shadow-sm">
                          {tag}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        {t('business.settings.noTags') || 'No tags added'}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Operating Hours Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiClock className="mr-3 text-primary" />
              {t('business.settings.operatingHours') || 'Operating Hours'}
            </h3>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('business.settings.day') || 'Day'}
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('business.settings.openTime') || 'Opening Time'}
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('business.settings.closeTime') || 'Closing Time'}
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('business.settings.closed') || 'Closed'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day) => (
                    <tr key={day.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {day.label}
                      </td>
                      <td className="py-3 px-4">
                        {editMode ? (
                          <input
                            type="time"
                            value={businessInfo.operatingHours?.[day.id]?.open || ''}
                            onChange={(e) => handleOperatingHoursChange(day.id, 'open', e.target.value)}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full"
                            disabled={businessInfo.operatingHours?.[day.id]?.closed}
                          />
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {businessInfo.operatingHours?.[day.id]?.closed ?
                              '-' :
                              businessInfo.operatingHours?.[day.id]?.open || '-'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editMode ? (
                          <input
                            type="time"
                            value={businessInfo.operatingHours?.[day.id]?.close || ''}
                            onChange={(e) => handleOperatingHoursChange(day.id, 'close', e.target.value)}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full"
                            disabled={businessInfo.operatingHours?.[day.id]?.closed}
                          />
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {businessInfo.operatingHours?.[day.id]?.closed ?
                              '-' :
                              businessInfo.operatingHours?.[day.id]?.close || '-'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editMode ? (
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={businessInfo.operatingHours?.[day.id]?.closed || false}
                              onChange={() => handleOperatingHoursChange(day.id, 'closed')}
                              className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {t('business.settings.closed') || 'Closed'}
                            </span>
                          </label>
                        ) : (
                          <span>
                            {businessInfo.operatingHours?.[day.id]?.closed ?
                              <span className="text-sm text-red-500 font-medium">{t('business.settings.closed') || 'Closed'}</span> :
                              <span className="text-sm text-green-500 font-medium">{t('business.settings.open') || 'Open'}</span>}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiMessageCircle className="mr-3 text-primary" />
              {t('business.settings.socialMedia') || 'Social Media Links'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialMediaFields.map(({ name, icon, label }) => {
                const isPhoneField = name === 'whatsapp' || name === 'telegram';
                const hasError = phoneErrors[name] && editMode;
                const isValid = isPhoneField && businessInfo.socialMedia?.[name] && !phoneErrors[name];

                return (
                  <div key={name} className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {React.cloneElement(icon, {
                        className: `w-5 h-5 ${hasError ? 'text-red-500' : isValid ? 'text-green-500' : 'text-gray-400 group-hover:text-primary'} transition-colors duration-300`
                      })}
                    </div>
                    <input
                      type={isPhoneField ? "tel" : "url"}
                      name={name}
                      value={businessInfo.socialMedia?.[name] || ''}
                      onChange={handleSocialMediaChange}
                      disabled={!editMode}
                      placeholder={isPhoneField
                        ? `${label} (e.g., 06XXXXXXXX or +212XXXXXXXX)`
                        : `${label} URL`}
                      className={`w-full pl-12 pr-10 py-3.5 border-2 rounded-2xl
                        ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
                        ${isValid ? 'border-green-500 focus:border-green-500 focus:ring-green-200' : ''}
                        ${editMode && !hasError && !isValid
                          ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                          : 'bg-gray-50 dark:bg-gray-800 border-transparent'}
                        focus:ring-2 ${!hasError && !isValid ? 'focus:ring-primary/20 focus:border-primary' : ''}
                        text-gray-800 dark:text-white transition-all duration-300
                        placeholder-gray-400 text-base
                        hover:border-primary/50 disabled:opacity-70 disabled:cursor-not-allowed
                        shadow-sm hover:shadow-md group-hover:shadow-lg`}
                    />

                    {/* Validation icon or Link icon */}
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      {editMode && isPhoneField && businessInfo.socialMedia?.[name] ? (
                        // Show validation icons in edit mode for phone fields
                        <div className="pointer-events-none">
                          {hasError ? (
                            <FiAlertCircle className="w-5 h-5 text-red-500" />
                          ) : isValid ? (
                            <FiCheckCircle className="w-5 h-5 text-green-500" />
                          ) : null}
                        </div>
                      ) : !editMode && businessInfo.socialMedia?.[name] ? (
                        // Show clickable link icon in view mode when field has a value
                        <a
                          href={generateSocialMediaLink(name, businessInfo.socialMedia[name])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark transition-colors duration-300"
                          title={`Open ${label}`}
                        >
                          <FiExternalLink className="w-5 h-5" />
                        </a>
                      ) : null}
                    </div>

                    {/* Error message */}
                    {hasError && (
                      <p className="mt-1 text-sm text-red-500">{phoneErrors[name]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default BusinessSettings;
