import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import templates, { TemplateConfig } from '../config/templates';

interface TemplateManagerProps {
  menuData: any;
  onSelect?: (template: TemplateConfig) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ menuData, onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateSelect = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    onSelect?.(template);
  };

  const handlePreview = async (template: TemplateConfig) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  if (previewMode && selectedTemplate) {
    const Template = React.lazy(async () => {
      const module = await selectedTemplate.component();
      return { default: module.default };
    });

    return (
      <div className="relative">
        <button
          onClick={() => setPreviewMode(false)}
          className="fixed top-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-lg"
        >
          Exit Preview
        </button>
        <Suspense fallback={<div>Loading template...</div>}>
          <Template menuData={menuData} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Select a Template</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={template.previewImage}
              alt={template.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {template.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handlePreview(template)}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                >
                  Select
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplateManager;
