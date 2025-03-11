import { lazy } from 'react';

// Import the JSON data
import templateData from '../data/templates.json';

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

// Map component names to lazy-loaded components
const componentMap = {
  MinimalistCoffee: lazy(() => import('../templates/coffee/MinimalistCoffee')),
  ModernCoffee: lazy(() => import('../templates/coffee/ModernCoffee')),
  VintageCoffee: lazy(() => import('../templates/coffee/VintageCoffee')),
};

// Transform JSON data into TemplateConfig array
const templates: TemplateConfig[] = templateData.map((template) => ({
  ...template,
  component: componentMap[template.componentName], // Map componentName to lazy-loaded component
}));

export default templates;