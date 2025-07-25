import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PresentationGeneratorModal from '../components/modals/PresentationGeneratorModal';

const PresentationGeneratorDemo = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [generatedPresentation, setGeneratedPresentation] = useState(null);

  // Sample business data for testing
  const sampleBusinessData = {
    nom: 'Café Central',
    type: 'coffee',
    ville: 'Casablanca',
    adress: '123 Rue Mohammed V, Quartier Gueliz',
    tags: ['coffee', 'wifi', 'cozy'],
    bio: 'A cozy coffee shop in the heart of Casablanca'
  };

  const handlePresentationSelect = (presentationData) => {
    setGeneratedPresentation(presentationData);
    console.log('Generated presentation:', presentationData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Presentation Generator Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the AI-powered business presentation generator with sample data or custom prompts
          </p>
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sample Business Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Name
              </label>
              <p className="text-gray-900 dark:text-white">{sampleBusinessData.nom}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <p className="text-gray-900 dark:text-white">{sampleBusinessData.type}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <p className="text-gray-900 dark:text-white">{sampleBusinessData.ville}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <p className="text-gray-900 dark:text-white">{sampleBusinessData.adress}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {sampleBusinessData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FiZap className="w-5 h-5" />
            Open AI Presentation Generator
          </button>
        </div>

        {/* Generated Presentation Display */}
        {generatedPresentation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Generated Presentation
            </h2>

            <div className="space-y-6">
              {/* Main Presentation */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Main Presentation
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {generatedPresentation.presentation}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {generatedPresentation.bio && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Short Bio
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {generatedPresentation.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              {generatedPresentation.suggestedTags && generatedPresentation.suggestedTags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Suggested Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedPresentation.suggestedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Presentation Generator Modal */}
        <PresentationGeneratorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          businessData={sampleBusinessData}
          onPresentationSelect={handlePresentationSelect}
          initialLanguage="en"
        />
      </div>
    </div>
  );
};

export default PresentationGeneratorDemo;
