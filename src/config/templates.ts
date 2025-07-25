import { lazy } from 'react';

// Import the JSON data
import templateData from '../data/templates.json';
import { Template } from '../services/templateService';
import defaultImage from '/images/default.png';

export interface TemplateConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  category: string;
  description: string;
  style: {
    theme: string;
  };
  previewImage: string;
  features: string[];
  demoPath: string;
}

export const DEFAULT_TEMPLATE: Template = {
  _id: "default",
  name: "Default Template",
  componentName: "DefaultTemplate",
  category: "general",
  price: 0,
  isFree: true,
  description: "Default template for all menu types",
  style: [],
  imagePreview: {
    url: defaultImage || 'https://via.placeholder.com/300x200?text=Default+Template', // Fallback to placeholder if defaultImage fails
    publicId: "default-template"
  },
  features: [],
  demoPath: "/templates/default",
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Map component names to lazy-loaded components
const componentMap = {
  DefaultTemplate: lazy(() => import('../templates/DefaultTemplate')),
  DynamicTemplate: lazy(() => import('../templates/DynamicTemplate')),
};

// Transform JSON data into TemplateConfig array
const templates: TemplateConfig[] = templateData.map((template) => ({
  ...template,
  component: componentMap[template.componentName], // Map componentName to lazy-loaded component
}));

export default templates;