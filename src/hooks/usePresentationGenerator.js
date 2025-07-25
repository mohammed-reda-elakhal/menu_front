import { useState, useCallback } from 'react';
import { 
  generateBusinessPresentation, 
  generateMultiplePresentations, 
  improvePresentation,
  validatePresentation,
  PRESENTATION_STYLES,
  STYLE_CONFIGS
} from '../services/presentationGenerationService';

/**
 * Custom hook for business presentation generation
 * Provides state management and methods for generating, improving, and validating presentations
 */
export const usePresentationGenerator = () => {
  const [state, setState] = useState({
    isGenerating: false,
    isImproving: false,
    progress: 0,
    error: null,
    generatedPresentations: [],
    currentPresentation: null,
    validationResult: null
  });

  // Reset state
  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      isImproving: false,
      progress: 0,
      error: null,
      generatedPresentations: [],
      currentPresentation: null,
      validationResult: null
    });
  }, []);

  // Generate a single presentation
  const generatePresentation = useCallback(async (businessData, style = PRESENTATION_STYLES.PROFESSIONAL, language = 'fr') => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null
    }));

    try {
      const result = await generateBusinessPresentation(
        businessData,
        style,
        language,
        (progress) => {
          setState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      if (result.success) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          currentPresentation: result.data,
          generatedPresentations: [result.data],
          progress: 100
        }));
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message,
        progress: 0
      }));
      throw error;
    }
  }, []);

  // Generate multiple presentation variations
  const generateVariations = useCallback(async (businessData, styles = [PRESENTATION_STYLES.PROFESSIONAL, PRESENTATION_STYLES.CASUAL], language = 'fr') => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      progress: 0,
      error: null
    }));

    try {
      const results = await generateMultiplePresentations(
        businessData,
        styles,
        language,
        (progress) => {
          setState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedPresentations: results,
        currentPresentation: results[0] || null,
        progress: 100
      }));

      return results;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message,
        progress: 0
      }));
      throw error;
    }
  }, []);

  // Improve existing presentation
  const improvePresentationText = useCallback(async (currentPresentation, businessData, improvementRequest, style = PRESENTATION_STYLES.PROFESSIONAL, language = 'fr') => {
    setState(prev => ({
      ...prev,
      isImproving: true,
      progress: 0,
      error: null
    }));

    try {
      const result = await improvePresentation(
        currentPresentation,
        businessData,
        improvementRequest,
        style,
        language,
        (progress) => {
          setState(prev => ({
            ...prev,
            progress
          }));
        }
      );

      if (result.success) {
        setState(prev => ({
          ...prev,
          isImproving: false,
          currentPresentation: {
            ...prev.currentPresentation,
            presentation: result.data.improvedPresentation,
            changesExplanation: result.data.changesExplanation
          },
          progress: 100
        }));
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isImproving: false,
        error: error.message,
        progress: 0
      }));
      throw error;
    }
  }, []);

  // Validate presentation
  const validatePresentationText = useCallback((presentationText) => {
    const validationResult = validatePresentation(presentationText);
    setState(prev => ({
      ...prev,
      validationResult
    }));
    return validationResult;
  }, []);

  // Select a presentation from generated variations
  const selectPresentation = useCallback((presentation) => {
    setState(prev => ({
      ...prev,
      currentPresentation: presentation
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    // State
    isGenerating: state.isGenerating,
    isImproving: state.isImproving,
    progress: state.progress,
    error: state.error,
    generatedPresentations: state.generatedPresentations,
    currentPresentation: state.currentPresentation,
    validationResult: state.validationResult,

    // Methods
    generatePresentation,
    generateVariations,
    improvePresentationText,
    validatePresentationText,
    selectPresentation,
    reset,
    clearError,

    // Constants
    PRESENTATION_STYLES,
    STYLE_CONFIGS
  };
};
