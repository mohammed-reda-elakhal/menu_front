import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiSave, FiAlertCircle, FiFacebook, FiInstagram, FiLinkedin, FiMessageCircle, FiCheckCircle, FiClock, FiTag, FiGlobe, FiImage, FiCrop, FiZap } from 'react-icons/fi';
import { FaPinterest, FaSnapchat, FaTiktok, FaTelegram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createBusiness, getBusinessesByPerson } from '../../redux/apiCalls/businessApiCalls';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import PresentationGeneratorModal from './PresentationGeneratorModal';

// Validate Moroccan phone number
const validateMoroccanPhone = (phone) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it's a valid Moroccan number
  // Valid formats: 06XXXXXXXX, 07XXXXXXXX, +2126XXXXXXXX, +2127XXXXXXXX
  const moroccanRegex = /^(?:(?:\+|00)212|0)[67]\d{8}$/;
  return moroccanRegex.test(digitsOnly);
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

const CreateBusinessModal = ({ isOpen, onClose, userId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const { loading } = useSelector(state => state.business);
  const { user } = useSelector(state => state.auth);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step titles
  const stepTitles = [
    t('business.create.steps.basicInfo') || 'Basic Information',
    t('business.create.steps.businessDetails') || 'Business Details',
    t('business.create.steps.visualIdentity') || 'Visual Identity',
    t('business.create.steps.contactSocial') || 'Contact & Social',
    t('business.create.steps.reviewSubmit') || 'Review & Submit'
  ];

  // Predefined business types
  const businessTypes = [
    { value: 'coffee', label: t('business.types.coffee') || 'Coffee' },
    { value: 'restaurant', label: t('business.types.restaurant') || 'Restaurant' },
    { value: 'snack', label: t('business.types.snack') || 'Snack' },
    { value: 'coffeeToGo', label: t('business.types.coffeeToGo') || 'Coffee Emportée' },
    { value: 'bakery', label: t('business.types.bakery') || 'Bakery' },
    { value: 'pizzeria', label: t('business.types.pizzeria') || 'Pizzeria' },
    { value: 'other', label: t('business.types.other') || 'Other' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    bio: '',
    type: 'coffee',  // Default type
    customType: '',  // For custom type when 'other' is selected
    ville: '',
    adress: '',
    tele: '',
    website: '',
    tags: [],
    operatingHours: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
      pinterest: '',
      snapchat: '',
      tiktok: '',
      whatsapp: '',
      telegram: ''
    }
  });

  // Show custom type input when 'other' is selected
  const [showCustomType, setShowCustomType] = useState(false);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(null);

  // Cover image cropping state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    height: 50.625, // 16:9 aspect ratio (90 * 9/16)
    x: 5,
    y: 24.6875 // Center vertically ((100 - 50.625) / 2)
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  // Tags input state
  const [tagInput, setTagInput] = useState('');

  // Operating hours state
  const [showOperatingHours, setShowOperatingHours] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });

  // Presentation generator state
  const [showPresentationGenerator, setShowPresentationGenerator] = useState(false);

  // Step navigation functions
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Reset form and step when modal closes
  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      nom: '',
      description: '',
      bio: '',
      type: 'coffee',
      customType: '',
      ville: '',
      adress: '',
      tele: '',
      website: '',
      tags: [],
      operatingHours: {
        monday: { open: '', close: '', closed: false },
        tuesday: { open: '', close: '', closed: false },
        wednesday: { open: '', close: '', closed: false },
        thursday: { open: '', close: '', closed: false },
        friday: { open: '', close: '', closed: false },
        saturday: { open: '', close: '', closed: false },
        sunday: { open: '', close: '', closed: false }
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        linkedin: '',
        pinterest: '',
        snapchat: '',
        tiktok: '',
        whatsapp: '',
        telegram: ''
      }
    });
    setShowCustomType(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedCoverImage(null);
    setCoverImagePreviewUrl(null);
    setTagInput('');
    setShowOperatingHours(false);
    setErrors({});
    setFormStatus({ message: '', type: '' });
    setPhoneErrors({});
    // Reset cropping state
    setShowCropModal(false);
    setCropImageSrc(null);
    setCrop({
      unit: '%',
      width: 90,
      height: 50.625,
      x: 5,
      y: 24.6875
    });
    setCompletedCrop(null);
    // Reset presentation generator
    setShowPresentationGenerator(false);
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for type selection
    if (name === 'type') {
      const isOther = value === 'other';
      setShowCustomType(isOther);

      // If switching from 'other' to a predefined type, clear customType
      if (!isOther) {
        setFormData(prev => ({
          ...prev,
          customType: '',
          [name]: value
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle presentation selection from AI generator
  const handlePresentationSelect = (presentationData) => {
    setFormData(prev => ({
      ...prev,
      description: presentationData.presentation,
      bio: presentationData.bio,
      tags: [...prev.tags, ...presentationData.suggestedTags.filter(tag => !prev.tags.includes(tag))]
    }));

    // Clear any existing errors for these fields
    setErrors(prev => ({
      ...prev,
      description: '',
      bio: ''
    }));
  };

  // State for phone validation errors
  const [phoneErrors, setPhoneErrors] = useState({});

  // Handle social media input changes
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

      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [name]: formattedValue
        }
      }));
    } else {
      // Normal handling for other social media fields
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [name]: value
        }
      }));
    }
  };

  // Handle operating hours changes
  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  // Handle tags input
  const handleTagsKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          logo: t('business.create.errors.invalidFileType') || 'Invalid file type. Please upload an image file.'
        }));
        return;
      }

      // Validate file size (max 1MB)
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          logo: t('business.create.errors.fileTooLarge') || 'File is too large. Maximum size is 1MB.'
        }));
        return;
      }

      setSelectedFile(file);

      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);

      // Clear logo error
      setErrors(prev => ({
        ...prev,
        logo: ''
      }));
    }
  };

  // Handle cover image selection
  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          coverImage: t('business.create.errors.invalidFileType') || 'Invalid file type. Please upload an image file.'
        }));
        return;
      }

      // Validate file size (max 2MB for cover image)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          coverImage: t('business.create.errors.fileTooLarge') || 'File is too large. Maximum size is 2MB.'
        }));
        return;
      }

      // Create a preview URL for cropping
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setCropImageSrc(fileReader.result);
        setShowCropModal(true);
      };
      fileReader.readAsDataURL(file);

      // Clear cover image error
      setErrors(prev => ({
        ...prev,
        coverImage: ''
      }));
    }
  };

  // Create cropped image
  const getCroppedImg = useCallback((image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Use 16:9 aspect ratio for cover images (1600x900 for good quality)
    const targetWidth = 1600;
    const targetHeight = 900;

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  }, []);

  // Handle crop completion
  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    try {
      const croppedImageFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        'cover-image.jpg'
      );

      setSelectedCoverImage(croppedImageFile);

      // Create preview URL for the cropped image
      const previewUrl = URL.createObjectURL(croppedImageFile);
      setCoverImagePreviewUrl(previewUrl);

      // Close crop modal
      setShowCropModal(false);
      setCropImageSrc(null);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [completedCrop, getCroppedImg]);

  // Handle crop cancel
  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropImageSrc(null);
    setCrop({
      unit: '%',
      width: 90,
      height: 50.625,
      x: 5,
      y: 24.6875
    });
    setCompletedCrop(null);
  };

  // Validate current step
  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.nom.trim()) {
          newErrors.nom = t('business.create.errors.nameRequired') || 'Business name is required';
        }
        if (!formData.description.trim()) {
          newErrors.description = t('business.create.errors.presentationRequired') || 'Business presentation is required';
        }
        if (!formData.ville.trim()) {
          newErrors.ville = t('business.create.errors.cityRequired') || 'City is required';
        }
        if (!formData.adress.trim()) {
          newErrors.adress = t('business.create.errors.addressRequired') || 'Address is required';
        }
        if (!formData.tele.trim()) {
          newErrors.tele = t('business.create.errors.phoneRequired') || 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.tele.replace(/\s/g, ''))) {
          newErrors.tele = t('business.create.errors.invalidPhone') || 'Please enter a valid phone number';
        }
        break;

      case 2: // Business Details
        if (formData.type === 'other' && !formData.customType.trim()) {
          newErrors.customType = t('business.create.errors.customTypeRequired') || 'Custom business type is required';
        }
        break;

      case 3: // Visual Identity - optional, no validation needed
        break;

      case 4: // Contact & Social - optional, no validation needed
        break;

      case 5: // Review & Submit - validate all required fields
        if (!formData.nom.trim()) {
          newErrors.nom = t('business.create.errors.nameRequired') || 'Business name is required';
        }
        if (!formData.description.trim()) {
          newErrors.description = t('business.create.errors.presentationRequired') || 'Business presentation is required';
        }
        if (!formData.ville.trim()) {
          newErrors.ville = t('business.create.errors.cityRequired') || 'City is required';
        }
        if (!formData.adress.trim()) {
          newErrors.adress = t('business.create.errors.addressRequired') || 'Address is required';
        }
        if (!formData.tele.trim()) {
          newErrors.tele = t('business.create.errors.phoneRequired') || 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.tele.replace(/\s/g, ''))) {
          newErrors.tele = t('business.create.errors.invalidPhone') || 'Please enter a valid phone number';
        }
        if (formData.type === 'other' && !formData.customType.trim()) {
          newErrors.customType = t('business.create.errors.customTypeRequired') || 'Custom business type is required';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate form (for final submission)
  const validateForm = () => {
    return validateCurrentStep();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ message: '', type: '' });

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare business data
      const businessData = {
        ...formData,
        // If 'other' is selected, use the custom type value
        type: formData.type === 'other' ? formData.customType : formData.type,
        person: userId,
        logo: selectedFile,
        coverImage: selectedCoverImage
      };

      // Remove customType from the data sent to the API
      delete businessData.customType;

      // Dispatch create business action
      const result = await dispatch(createBusiness(businessData));

      if (!result.success) {
        throw new Error(result.error || 'Failed to create business');
      }

      // Show success message
      setFormStatus({
        message: t('business.create.success') || 'Business created successfully',
        type: 'success'
      });

      // Reset form
      resetForm();

      // Refresh businesses list
      dispatch(getBusinessesByPerson(userId));

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      setFormStatus({
        message: error.message || 'An error occurred while creating business',
        type: 'error'
      });
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
  };

  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

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

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderBusinessDetails();
      case 3:
        return renderVisualIdentity();
      case 4:
        return renderContactSocial();
      case 5:
        return renderReviewSubmit();
      default:
        return null;
    }
  };

  // Step 1: Basic Information
  const renderBasicInformation = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('business.create.steps.basicInfo') || 'Basic Information'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray_bg">
          {t('business.create.steps.basicInfoDesc') || 'Enter the essential information about your business'}
        </p>
      </div>

      {/* Business name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          {t('business.create.name') || 'Business Name'} *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t('business.create.nameHint') || 'The official name of your business as customers will see it'}
        </p>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white dark:bg-secondary1/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
            text-gray-900 dark:text-white ${errors.nom ? 'border-red-500' : 'border-gray-300 dark:border-primary/20'}`}
          placeholder={t('business.create.namePlaceholder') || 'e.g., Café Central, Restaurant Le Jardin, Boulangerie Moderne'}
        />
        {errors.nom && (
          <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
        )}
      </div>

      {/* Business Presentation */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg">
            {t('business.create.presentation') || 'Business Presentation'} *
          </label>
          <button
            type="button"
            onClick={() => setShowPresentationGenerator(true)}
            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-xs rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiZap className="w-3 h-3" />
            {t('business.create.generateWithAI') || 'Generate with AI'}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t('business.create.presentationHint') || 'Write a compelling presentation of your business that customers will see. Describe what makes your business special, your main offerings, and what customers can expect.'}
        </p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          maxLength="1000"
          className={`w-full px-4 py-3 bg-white dark:bg-secondary1/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
            text-gray-900 dark:text-white ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-primary/20'}`}
          placeholder={t('business.create.presentationPlaceholder') || 'e.g., "Welcome to our cozy coffee shop! We serve freshly roasted coffee, homemade pastries, and provide a warm atmosphere perfect for work or relaxation. Our specialty is our signature blend coffee and artisanal croissants."'}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {formData.description.length}/1000 {t('business.create.characters') || 'characters'}
          </p>
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          {t('business.create.city') || 'City'} *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t('business.create.cityHint') || 'The city where your business is located'}
        </p>
        <input
          type="text"
          name="ville"
          value={formData.ville}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white dark:bg-secondary1/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
            text-gray-900 dark:text-white ${errors.ville ? 'border-red-500' : 'border-gray-300 dark:border-primary/20'}`}
          placeholder={t('business.create.cityPlaceholder') || 'e.g., Casablanca, Rabat, Marrakech'}
        />
        {errors.ville && (
          <p className="text-red-500 text-xs mt-1">{errors.ville}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          {t('business.create.address') || 'Complete Address'} *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t('business.create.addressHint') || 'Full address where customers can find your business (street, neighborhood, landmarks)'}
        </p>
        <input
          type="text"
          name="adress"
          value={formData.adress}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white dark:bg-secondary1/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
            text-gray-900 dark:text-white ${errors.adress ? 'border-red-500' : 'border-gray-300 dark:border-primary/20'}`}
          placeholder={t('business.create.addressPlaceholder') || 'e.g., 123 Rue Mohammed V, Quartier Gueliz, near Hassan II Mosque'}
        />
        {errors.adress && (
          <p className="text-red-500 text-xs mt-1">{errors.adress}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          {t('business.create.phone') || 'Business Phone Number'} *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {t('business.create.phoneHint') || 'Main phone number for customer inquiries and reservations'}
        </p>
        <input
          type="tel"
          name="tele"
          value={formData.tele}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-white dark:bg-secondary1/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
            text-gray-900 dark:text-white ${errors.tele ? 'border-red-500' : 'border-gray-300 dark:border-primary/20'}`}
          placeholder={t('business.create.phonePlaceholder') || 'e.g., 0612345678 or 0522123456'}
        />
        {errors.tele && (
          <p className="text-red-500 text-xs mt-1">{errors.tele}</p>
        )}
      </div>
    </div>
  );

  // Step 2: Business Details
  const renderBusinessDetails = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('business.create.steps.businessDetails') || 'Business Details'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray_bg">
          {t('business.create.steps.businessDetailsDesc') || 'Tell us more about your business type and specialties'}
        </p>
      </div>

      {/* Business type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          {t('business.create.type') || 'Business Type'}
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
        >
          {businessTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Business Type */}
      {showCustomType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
            {t('business.create.customType') || 'Custom Business Type'} *
          </label>
          <input
            type="text"
            name="customType"
            value={formData.customType}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-white dark:bg-secondary1/50 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
              text-gray-900 dark:text-white ${errors.customType ? 'border-red-500' : 'border-gray-300 dark:border-primary/20'}`}
            placeholder={t('business.create.customTypePlaceholder') || 'Enter your business type'}
          />
          {errors.customType && (
            <p className="text-red-500 text-xs mt-1">{errors.customType}</p>
          )}
        </div>
      )}

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          {t('business.create.bio') || 'Bio'}
          <span className="text-xs text-gray-500 dark:text-gray_bg ml-2">(Max 500 characters)</span>
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          maxLength="500"
          className="w-full px-4 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
          placeholder={t('business.create.bioPlaceholder') || 'Enter a short bio about your business'}
        />
        <div className="text-xs text-gray-500 dark:text-gray_bg mt-1 text-right">
          {formData.bio.length}/500
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          <FiGlobe className="inline w-4 h-4 mr-1" />
          {t('business.create.website') || 'Website'}
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
          placeholder={t('business.create.websitePlaceholder') || 'https://www.example.com'}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-1">
          <FiTag className="inline w-4 h-4 mr-1" />
          {t('business.create.tags') || 'Tags'}
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagsKeyDown}
            className="w-full px-4 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
            placeholder={t('business.create.tagsPlaceholder') || 'Type a tag and press Enter'}
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/20 text-primary border border-primary/30"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary hover:text-red-400 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray_bg">
            {t('business.create.tagsHint') || 'Add tags to help customers find your business (e.g., coffee, breakfast, wifi)'}
          </p>
        </div>
      </div>
    </div>
  );

  // Step 3: Visual Identity
  const renderVisualIdentity = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('business.create.steps.visualIdentity') || 'Visual Identity'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray_bg">
          {t('business.create.steps.visualIdentityDesc') || 'Upload your business logo and cover image (optional but recommended)'}
        </p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-2">
          {t('business.create.logo') || 'Business Logo'}
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-xl border-2 border-gray-300 dark:border-primary/30 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-white/5">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Logo Preview"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <FiUpload className="text-gray-400 dark:text-gray_bg text-2xl" />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/gif"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
            >
              {t('business.create.uploadLogo') || 'Upload Logo'}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray_bg mt-1">
              {t('business.create.logoHint') || 'Recommended: Square image, max 1MB'}
            </p>
            {errors.logo && (
              <p className="text-red-500 text-xs mt-1">{errors.logo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-2">
          <FiImage className="inline w-4 h-4 mr-1" />
          {t('business.create.coverImage') || 'Cover Image'}
        </label>
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-20 rounded-xl border-2 border-gray-300 dark:border-primary/30 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-white/5">
            {coverImagePreviewUrl ? (
              <img
                src={coverImagePreviewUrl}
                alt="Cover Image Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiImage className="text-gray-400 dark:text-gray_bg text-2xl" />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              ref={coverImageInputRef}
              onChange={handleCoverImageSelect}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg, image/gif"
            />
            <button
              type="button"
              onClick={() => coverImageInputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
            >
              <FiCrop className="w-4 h-4" />
              {t('business.create.uploadCoverImage') || 'Upload & Crop Cover Image'}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray_bg mt-1">
              {t('business.create.coverImageHint') || 'Upload an image and crop it to 16:9 aspect ratio (1600x900px), max 2MB'}
            </p>
            {errors.coverImage && (
              <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Contact & Social
  const renderContactSocial = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('business.create.steps.contactSocial') || 'Contact & Social'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray_bg">
          {t('business.create.steps.contactSocialDesc') || 'Add your social media links and operating hours (optional)'}
        </p>
      </div>

      {/* Social Media Section */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray_bg mb-4">
          {t('business.create.socialMedia') || 'Social Media Links'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialMediaFields.map(({ name, icon, label }) => {
            const isPhoneField = name === 'whatsapp' || name === 'telegram';
            const hasError = phoneErrors[name];
            const isValid = isPhoneField && formData.socialMedia[name] && !phoneErrors[name];

            return (
              <div key={name} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {React.cloneElement(icon, {
                    className: `w-5 h-5 ${hasError ? 'text-red-500' : isValid ? 'text-green-500' : 'text-gray_bg group-hover:text-primary'} transition-colors duration-300`
                  })}
                </div>
                <input
                  type={isPhoneField ? "tel" : "url"}
                  name={name}
                  value={formData.socialMedia[name]}
                  onChange={handleSocialMediaChange}
                  placeholder={isPhoneField
                    ? `${label} (e.g., 06XXXXXXXX or +212XXXXXXXX)`
                    : `${label} URL`}
                  className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl
                    ${hasError ? 'border-red-500' : ''}
                    ${isValid ? 'border-green-500' : 'border-gray-300 dark:border-primary/20'}
                    bg-white dark:bg-secondary1/50
                    focus:ring-2 ${!hasError && !isValid ? 'focus:ring-primary/20 focus:border-primary' : ''}
                    ${hasError ? 'focus:ring-red-200 focus:border-red-500' : ''}
                    ${isValid ? 'focus:ring-green-200 focus:border-green-500' : ''}
                    text-gray-900 dark:text-white transition-all duration-300`}
                />

                {/* Validation icon */}
                {isPhoneField && formData.socialMedia[name] && (
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    {hasError ? (
                      <FiAlertCircle className="w-5 h-5 text-red-500" />
                    ) : isValid ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                )}

                {/* Error message */}
                {hasError && (
                  <p className="mt-1 text-sm text-red-500">{phoneErrors[name]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Operating Hours Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray_bg">
            <FiClock className="inline w-5 h-5 mr-2" />
            {t('business.create.operatingHours') || 'Operating Hours'}
          </h4>
          <button
            type="button"
            onClick={() => setShowOperatingHours(!showOperatingHours)}
            className="text-primary hover:text-primary/80 transition-colors text-sm"
          >
            {showOperatingHours ? 'Hide' : 'Show'} Hours
          </button>
        </div>

        {showOperatingHours && (
          <div className="space-y-3 bg-gray-50 dark:bg-secondary1/30 p-4 rounded-lg">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-600 dark:text-gray_bg capitalize">
                  {day.slice(0, 3)}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.operatingHours[day].closed}
                      onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray_bg">Closed</span>
                  </label>
                  {!formData.operatingHours[day].closed && (
                    <>
                      <input
                        type="time"
                        value={formData.operatingHours[day].open}
                        onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded text-gray-900 dark:text-white text-sm"
                      />
                      <span className="text-gray-600 dark:text-gray_bg">to</span>
                      <input
                        type="time"
                        value={formData.operatingHours[day].close}
                        onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded text-gray-900 dark:text-white text-sm"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 dark:text-gray_bg mt-2">
              {t('business.create.operatingHoursHint') || 'Set your business operating hours for each day of the week'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 5: Review & Submit
  const renderReviewSubmit = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-4">
          <FiCheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('business.create.steps.reviewSubmit') || 'Review & Submit'}
        </h3>
        <p className="text-gray-600 dark:text-gray_bg max-w-md mx-auto">
          {t('business.create.steps.reviewSubmitDesc') || 'Review all your information before creating your business'}
        </p>
      </div>

      {/* Review Cards */}
      <div className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-secondary1 dark:to-secondary1/50 rounded-2xl p-6 border border-gray-200 dark:border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Business Name</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.nom || 'Not provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.type === 'other' ? formData.customType : businessTypes.find(t => t.value === formData.type)?.label || 'Not provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">City</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.ville || 'Not provided'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.tele || 'Not provided'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.adress || 'Not provided'}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('business.create.presentation') || 'Business Presentation'}</span>
                <span className="text-gray-900 dark:text-white font-medium leading-relaxed">{formData.description || t('business.create.notProvided') || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Card */}
        {(formData.bio || formData.website || formData.tags.length > 0) && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-secondary1 dark:to-secondary1/50 rounded-2xl p-6 border border-gray-200 dark:border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FiTag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Details</h4>
            </div>
            <div className="space-y-4">
              {formData.bio && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bio</span>
                  <span className="text-gray-900 dark:text-white font-medium leading-relaxed">{formData.bio}</span>
                </div>
              )}
              {formData.website && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Website</span>
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors">{formData.website}</a>
                </div>
              )}
              {formData.tags.length > 0 && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visual Identity Card */}
        {(selectedFile || selectedCoverImage) && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-secondary1 dark:to-secondary1/50 rounded-2xl p-6 border border-gray-200 dark:border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FiImage className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Visual Identity</h4>
            </div>
            <div className="flex gap-6">
              {selectedFile && (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl border-2 border-gray-200 dark:border-primary/20 overflow-hidden mb-3 bg-white dark:bg-secondary1/50 shadow-sm">
                    <img src={previewUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray_bg">Logo</span>
                </div>
              )}
              {selectedCoverImage && (
                <div className="text-center">
                  <div className="w-32 h-20 rounded-2xl border-2 border-gray-200 dark:border-primary/20 overflow-hidden mb-3 shadow-sm">
                    <img src={coverImagePreviewUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray_bg">Cover Image</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media Card */}
        {Object.values(formData.socialMedia).some(value => value) && (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-secondary1 dark:to-secondary1/50 rounded-2xl p-6 border border-gray-200 dark:border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.socialMedia).map(([platform, url]) => {
                if (!url) return null;
                const field = socialMediaFields.find(f => f.name === platform);
                return (
                  <div key={platform} className="flex items-center gap-3 p-3 bg-white dark:bg-secondary1/30 rounded-xl border border-gray-100 dark:border-primary/10">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {React.cloneElement(field?.icon || <FiGlobe />, { className: "w-4 h-4 text-gray-600 dark:text-gray-300" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{platform}</div>
                      <div className="text-sm text-gray-900 dark:text-white font-medium truncate">{url}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-lg font-semibold text-red-800 dark:text-red-400">Please fix the following errors:</h4>
          </div>
          <ul className="space-y-2">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                <span className="font-medium">{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div
              className="bg-white dark:bg-secondary1 rounded-2xl shadow-2xl border border-gray-200 dark:border-primary/20 w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 bg-white dark:bg-secondary1 border-b border-gray-200 dark:border-primary/10">
                <div className="flex justify-between items-center p-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t('business.create.title') || 'Create New Business'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray_bg mt-2 font-medium">
                      Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-500 dark:text-gray_bg hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-primary/10 rounded-lg transition-all duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-secondary1/30 dark:to-secondary1/20">
                  <div className="flex items-center justify-between mb-4">
                    {Array.from({ length: totalSteps }, (_, index) => {
                      const stepNumber = index + 1;
                      const isCompleted = stepNumber < currentStep;
                      const isCurrent = stepNumber === currentStep;

                      return (
                        <div key={stepNumber} className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer transform hover:scale-105
                              ${isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' : ''}
                              ${isCurrent ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg ring-4 ring-primary/20' : ''}
                              ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500' : ''}`}
                            onClick={() => goToStep(stepNumber)}
                          >
                            {isCompleted ? <FiCheckCircle className="w-5 h-5" /> : stepNumber}
                          </div>
                          {stepNumber < totalSteps && (
                            <div className={`w-16 h-2 mx-3 rounded-full transition-all duration-500
                              ${isCompleted ? 'bg-gradient-to-r from-green-500 to-primary' : 'bg-gray-200 dark:bg-gray-600'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray_bg text-center">
                    {stepTitles[currentStep - 1]}
                  </div>
                </div>
              </div>

              {/* Body - Scrollable */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto px-6 py-4 custom-scrollbar">
                  {/* Status message */}
                  {formStatus.message && (
                    <div className={`mb-6 p-4 rounded-xl ${formStatus.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'} shadow-sm`}>
                      {formStatus.message}
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="pb-4">
                    {renderStepContent()}
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="flex-shrink-0 bg-white dark:bg-secondary1 border-t border-gray-200 dark:border-primary/10">
                <div className="p-6 flex justify-between items-center">
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <button
                        onClick={prevStep}
                        className="px-6 py-3 text-gray-600 dark:text-gray_bg hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-primary/10 transition-all duration-200 border border-gray-300 dark:border-primary/20 rounded-xl font-medium"
                        disabled={loading}
                      >
                        {t('business.create.navigation.previous') || 'Previous'}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 text-gray-600 dark:text-gray_bg hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-primary/10 transition-all duration-200 rounded-xl font-medium"
                      disabled={loading}
                    >
                      {t('business.create.cancel') || 'Cancel'}
                    </button>

                    {currentStep < totalSteps ? (
                      <button
                        onClick={nextStep}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                        disabled={loading}
                      >
                        {t('business.create.navigation.next') || 'Next'}
                        <FiCheckCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={loading || Object.keys(errors).length > 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all duration-200 font-medium
                          ${loading || Object.keys(errors).length > 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'}`}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>{t('business.create.creating') || 'Creating...'}</span>
                          </>
                        ) : (
                          <>
                            <FiSave className="w-5 h-5" />
                            <span>{t('business.create.create') || 'Create Business'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image Crop Modal */}
          <AnimatePresence>
            {showCropModal && (
              <>
                {/* Crop Modal Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCropCancel}
                />

                {/* Crop Modal */}
                <motion.div
                  className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div
                    className="bg-white dark:bg-secondary1 rounded-xl shadow-xl border border-gray-200 dark:border-primary/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Crop Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-primary/10">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <FiCrop className="w-5 h-5 mr-2" />
                        {t('business.create.cropCoverImage') || 'Crop Cover Image'}
                      </h3>
                      <button
                        onClick={handleCropCancel}
                        className="text-gray-500 dark:text-gray_bg hover:text-gray-700 dark:hover:text-white transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Crop Modal Body */}
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray_bg mb-2">
                          {t('business.create.cropInstructions') || 'Adjust the crop area to select the part of your image you want to use as cover image. The image will be resized to 1600x900 pixels (16:9 aspect ratio).'}
                        </p>
                      </div>

                      {cropImageSrc && (
                        <div className="flex justify-center mb-4">
                          <ReactCrop
                            crop={crop}
                            onChange={(newCrop) => setCrop(newCrop)}
                            onComplete={(newCrop) => setCompletedCrop(newCrop)}
                            aspect={16 / 9}
                            className="max-w-full max-h-[60vh]"
                          >
                            <img
                              ref={imgRef}
                              src={cropImageSrc}
                              alt="Crop preview"
                              className="max-w-full max-h-[60vh] object-contain"
                              onLoad={() => {
                                // Set initial crop when image loads
                                const { width, height } = imgRef.current;
                                const aspectRatio = 16 / 9;
                                let cropWidth, cropHeight;

                                if (width / height > aspectRatio) {
                                  // Image is wider than 16:9
                                  cropHeight = height * 0.8;
                                  cropWidth = cropHeight * aspectRatio;
                                } else {
                                  // Image is taller than 16:9
                                  cropWidth = width * 0.8;
                                  cropHeight = cropWidth / aspectRatio;
                                }

                                const newCrop = {
                                  unit: 'px',
                                  width: cropWidth,
                                  height: cropHeight,
                                  x: (width - cropWidth) / 2,
                                  y: (height - cropHeight) / 2
                                };

                                setCrop(newCrop);
                                setCompletedCrop(newCrop);
                              }}
                            />
                          </ReactCrop>
                        </div>
                      )}
                    </div>

                    {/* Crop Modal Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-primary/10 flex justify-end gap-3">
                      <button
                        onClick={handleCropCancel}
                        className="px-4 py-2 text-gray-500 dark:text-gray_bg hover:text-gray-700 dark:hover:text-white transition-colors"
                      >
                        {t('business.create.cancel') || 'Cancel'}
                      </button>
                      <button
                        onClick={handleCropComplete}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                      >
                        <FiCrop className="w-4 h-4" />
                        {t('business.create.applyCrop') || 'Apply Crop'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Presentation Generator Modal */}
      <PresentationGeneratorModal
        isOpen={showPresentationGenerator}
        onClose={() => setShowPresentationGenerator(false)}
        businessData={{
          nom: formData.nom,
          type: formData.type,
          customType: formData.customType,
          ville: formData.ville,
          adress: formData.adress,
          tags: formData.tags,
          bio: formData.bio
        }}
        onPresentationSelect={handlePresentationSelect}
        initialLanguage="fr"
      />
    </AnimatePresence>
  );
};

export default CreateBusinessModal;
