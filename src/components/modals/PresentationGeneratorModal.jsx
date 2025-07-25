import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiZap,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiEdit3,
  FiCopy,
  FiStar,
  FiTrendingUp,
  FiHeart,
  FiUsers,
  FiAward,
  FiTarget
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { usePresentationGenerator } from '../../hooks/usePresentationGenerator';

const PresentationGeneratorModal = ({
  isOpen,
  onClose,
  businessData,
  onPresentationSelect,
  initialLanguage = 'fr'
}) => {
  const { t } = useTranslation();
  const {
    isGenerating,
    isImproving,
    progress,
    error,
    generatedPresentations,
    currentPresentation,
    validationResult,
    generatePresentation,
    generateVariations,
    improvePresentationText,
    validatePresentationText,
    selectPresentation,
    reset,
    clearError,
    PRESENTATION_STYLES,
    STYLE_CONFIGS
  } = usePresentationGenerator();

  const [selectedStyle, setSelectedStyle] = useState(PRESENTATION_STYLES.PROFESSIONAL);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [improvementRequest, setImprovementRequest] = useState('');
  const [showImprovementInput, setShowImprovementInput] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);

  // Available languages
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
  ];

  // Style icons mapping
  const styleIcons = {
    [PRESENTATION_STYLES.PROFESSIONAL]: <FiAward className="w-5 h-5" />,
    [PRESENTATION_STYLES.CASUAL]: <FiUsers className="w-5 h-5" />,
    [PRESENTATION_STYLES.CREATIVE]: <FiStar className="w-5 h-5" />,
    [PRESENTATION_STYLES.WARM]: <FiHeart className="w-5 h-5" />,
    [PRESENTATION_STYLES.MODERN]: <FiTrendingUp className="w-5 h-5" />,
    [PRESENTATION_STYLES.TRADITIONAL]: <FiTarget className="w-5 h-5" />
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset();
      clearError();
    }
  }, [isOpen, reset, clearError]);

  // Validate current presentation when it changes
  useEffect(() => {
    if (currentPresentation?.presentation) {
      validatePresentationText(currentPresentation.presentation);
    }
  }, [currentPresentation, validatePresentationText]);

  const handleClose = () => {
    reset();
    setCustomPrompt('');
    setUseCustomPrompt(false);
    onClose();
  };

  const handleGeneratePresentation = async () => {
    try {
      const enhancedBusinessData = {
        ...businessData,
        customPrompt: useCustomPrompt ? customPrompt : undefined
      };
      await generatePresentation(enhancedBusinessData, selectedStyle, selectedLanguage);
    } catch (error) {
      console.error('Failed to generate presentation:', error);
    }
  };

  const handleGenerateVariations = async () => {
    try {
      const styles = [
        PRESENTATION_STYLES.PROFESSIONAL,
        PRESENTATION_STYLES.CASUAL,
        PRESENTATION_STYLES.WARM
      ];
      const enhancedBusinessData = {
        ...businessData,
        customPrompt: useCustomPrompt ? customPrompt : undefined
      };
      await generateVariations(enhancedBusinessData, styles, selectedLanguage);
    } catch (error) {
      console.error('Failed to generate variations:', error);
    }
  };

  const handleImprovePresentation = async () => {
    if (!currentPresentation?.presentation || !improvementRequest.trim()) {
      return;
    }

    try {
      await improvePresentationText(
        currentPresentation.presentation,
        businessData,
        improvementRequest,
        selectedStyle,
        selectedLanguage
      );
      setImprovementRequest('');
      setShowImprovementInput(false);
    } catch (error) {
      console.error('Failed to improve presentation:', error);
    }
  };

  const handleCopyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleSelectPresentation = () => {
    if (currentPresentation && onPresentationSelect) {
      onPresentationSelect({
        presentation: currentPresentation.presentation,
        bio: currentPresentation.bio,
        suggestedTags: currentPresentation.suggestedTags || []
      });
    }
    handleClose();
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose}
      >
        <motion.div
          className="bg-white dark:bg-secondary1 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-primary/20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                <FiZap className="inline w-6 h-6 mr-2 text-primary" />
                {t('business.presentationGenerator.title') || 'AI Presentation Generator'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray_bg mt-1">
                {t('business.presentationGenerator.subtitle') || 'Create compelling business presentations with AI'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-primary/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-500 dark:text-gray_bg" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Custom Prompt Section - Always Visible */}
              <div className="mb-6">
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <FiZap className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('business.presentationGenerator.customPromptTitle') || 'Custom Business Description (Optional)'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('business.presentationGenerator.customPromptHint') || 'Provide your own description or specific instructions for the AI to follow. Leave empty to use automatic generation based on your business type.'}
                  </p>

                  <textarea
                    value={customPrompt}
                    onChange={(e) => {
                      setCustomPrompt(e.target.value);
                      setUseCustomPrompt(e.target.value.trim().length > 0);
                    }}
                    placeholder={t('business.presentationGenerator.customPromptPlaceholder') || 'e.g., "We are a family-owned coffee shop that has been serving the community for 20 years. We specialize in organic, fair-trade coffee and homemade pastries. Our cozy atmosphere makes us a favorite spot for students and remote workers. Please emphasize our community involvement and sustainability practices."'}
                    className="w-full px-4 py-3 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white text-sm transition-all duration-200"
                    rows="4"
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {t('business.presentationGenerator.customPromptTip') || 'Tip: Be specific about what makes your business unique, your target audience, and key points to highlight'}
                    </p>
                    <div className="flex items-center gap-2">
                      {customPrompt.trim().length > 0 && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <FiCheck className="w-3 h-3" />
                          Custom prompt active
                        </span>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {customPrompt.length}/500
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('business.presentationGenerator.configuration') || 'Configuration'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-2">
                      {t('business.presentationGenerator.language') || 'Language'}
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray_bg mb-2">
                      {t('business.presentationGenerator.style') || 'Presentation Style'}
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                    >
                      {Object.entries(STYLE_CONFIGS).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {STYLE_CONFIGS[selectedStyle]?.description}
                    </p>
                  </div>
                </div>

                {/* Generation Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleGeneratePresentation}
                    disabled={isGenerating || isImproving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiZap className="w-4 h-4" />
                    )}
                    {t('business.presentationGenerator.generate') || 'Generate Presentation'}
                  </button>

                  <button
                    onClick={handleGenerateVariations}
                    disabled={isGenerating || isImproving}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary1 hover:bg-secondary1/80 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FiRefreshCw className="w-4 h-4" />
                    )}
                    {t('business.presentationGenerator.generateVariations') || 'Generate Variations'}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {(isGenerating || isImproving) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray_bg">
                      {isGenerating ?
                        (t('business.presentationGenerator.generating') || 'Generating presentation...') :
                        (t('business.presentationGenerator.improving') || 'Improving presentation...')
                      }
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray_bg">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                  </div>
                </div>
              )}

              {/* Generated Presentations */}
              {generatedPresentations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t('business.presentationGenerator.results') || 'Generated Presentations'}
                  </h3>

                  {/* Presentation Variations */}
                  {generatedPresentations.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {generatedPresentations.map((presentation, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            currentPresentation === presentation
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 dark:border-primary/20 hover:border-primary/50'
                          }`}
                          onClick={() => selectPresentation(presentation)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {styleIcons[presentation.style]}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {STYLE_CONFIGS[presentation.style]?.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray_bg line-clamp-3">
                            {presentation.presentation.substring(0, 100)}...
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Current Presentation Display */}
                  {currentPresentation && (
                    <div className="space-y-4">
                      {/* Main Presentation */}
                      <div className="bg-gray-50 dark:bg-secondary1/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {t('business.presentationGenerator.mainPresentation') || 'Main Presentation'}
                          </h4>
                          <button
                            onClick={() => handleCopyToClipboard(currentPresentation.presentation, 'presentation')}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
                          >
                            {copiedField === 'presentation' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                            {copiedField === 'presentation' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray_bg leading-relaxed">
                          {currentPresentation.presentation}
                        </p>

                        {/* Validation Results */}
                        {validationResult && (
                          <div className="mt-3 p-3 bg-white dark:bg-secondary1 rounded border">
                            <div className="flex items-center gap-2 mb-2">
                              {validationResult.isValid ? (
                                <FiCheck className="w-4 h-4 text-green-500" />
                              ) : (
                                <FiAlertCircle className="w-4 h-4 text-yellow-500" />
                              )}
                              <span className="text-sm font-medium">
                                {validationResult.isValid ? 'Good quality' : 'Suggestions available'}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({validationResult.wordCount} words)
                              </span>
                            </div>
                            {validationResult.suggestions.length > 0 && (
                              <ul className="text-xs text-gray-600 dark:text-gray_bg space-y-1">
                                {validationResult.suggestions.map((suggestion, index) => (
                                  <li key={index}>• {suggestion}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      {currentPresentation.bio && (
                        <div className="bg-gray-50 dark:bg-secondary1/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {t('business.presentationGenerator.bio') || 'Short Bio'}
                            </h4>
                            <button
                              onClick={() => handleCopyToClipboard(currentPresentation.bio, 'bio')}
                              className="flex items-center gap-1 px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
                            >
                              {copiedField === 'bio' ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                              {copiedField === 'bio' ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <p className="text-gray-700 dark:text-gray_bg">
                            {currentPresentation.bio}
                          </p>
                        </div>
                      )}

                      {/* Suggested Tags */}
                      {currentPresentation.suggestedTags && currentPresentation.suggestedTags.length > 0 && (
                        <div className="bg-gray-50 dark:bg-secondary1/30 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            {t('business.presentationGenerator.suggestedTags') || 'Suggested Tags'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentPresentation.suggestedTags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm border border-primary/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Improvement Section */}
                      <div className="bg-gray-50 dark:bg-secondary1/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {t('business.presentationGenerator.improve') || 'Improve Presentation'}
                          </h4>
                          <button
                            onClick={() => setShowImprovementInput(!showImprovementInput)}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
                          >
                            <FiEdit3 className="w-4 h-4" />
                            {showImprovementInput ? 'Cancel' : 'Improve'}
                          </button>
                        </div>

                        {showImprovementInput && (
                          <div className="space-y-3">
                            <textarea
                              value={improvementRequest}
                              onChange={(e) => setImprovementRequest(e.target.value)}
                              placeholder={t('business.presentationGenerator.improvementPlaceholder') || 'Describe what you want to improve (e.g., "Make it more friendly", "Add more details about our coffee", "Emphasize our location")'}
                              className="w-full px-3 py-2 bg-white dark:bg-secondary1/50 border border-gray-300 dark:border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white"
                              rows="3"
                            />
                            <button
                              onClick={handleImprovePresentation}
                              disabled={!improvementRequest.trim() || isImproving}
                              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                            >
                              {isImproving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <FiZap className="w-4 h-4" />
                              )}
                              {t('business.presentationGenerator.applyImprovement') || 'Apply Improvement'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-t border-gray-200 dark:border-primary/20 bg-white dark:bg-secondary1">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 dark:text-gray_bg hover:bg-gray-100 dark:hover:bg-primary/10 rounded-lg transition-colors"
            >
              {t('common.cancel') || 'Cancel'}
            </button>

            {currentPresentation && (
              <button
                onClick={handleSelectPresentation}
                className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                <FiCheck className="w-4 h-4" />
                {t('business.presentationGenerator.usePresentation') || 'Use This Presentation'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PresentationGeneratorModal;
