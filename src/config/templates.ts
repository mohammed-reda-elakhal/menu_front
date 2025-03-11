import { lazy } from 'react';
import MinimalistCoffee from '../templates/coffee/MinimalistCoffee';
import ModernCoffee from '../templates/coffee/ModernCoffee';
import VintageCoffee from '../templates/coffee/VintageCoffee';

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

// Map component names to actual components
const componentMap = {
  MinimalistCoffee: MinimalistCoffee,
  ModernCoffee: ModernCoffee,
  VintageCoffee: VintageCoffee,
};

// Transform JSON data into TemplateConfig array
const templates: TemplateConfig[] = templateData.map((template) => ({
  ...template,
  component: componentMap[template.componentName], // Map componentName to actual component
}));

export default templates;