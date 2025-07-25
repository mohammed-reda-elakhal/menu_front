import { lazy } from 'react';

export interface Template {
  _id: string;
  name: string;
  componentName: string;
  category: string;
  price: number;
  isFree: boolean;
  description: string;
  style: string[];
  imagePreview: {
    url: string;
    publicId: string;
  };
  features: string[];
  demoPath: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const templateComponents: { [key: string]: React.LazyExoticComponent<any> } = {
  DefaultTemplate: lazy(() => import('../templates/DefaultTemplate.jsx')),
  DynamicTemplate: lazy(() => import('../templates/DynamicTemplate.jsx')),
  CoffeTemplateSimple: lazy(() => import('../templates/CoffeTemplateSimple.jsx')),
  MinimalistTemplate: lazy(()=> import('../templates/MinimalistTemplate.jsx')),
  GlassFrostTemplate : lazy(()=>import('../templates/GlassFrostTemplate.jsx')),
  GlassFlowTemplate : lazy(()=> import('../templates/GlassFlowTemplate.jsx')),
  RusticWood : lazy(()=>import('../templates/RusticWood.jsx')),
  ElegantTemplate : lazy(()=>import('../templates/ElegantTemplate.jsx')),

  // Add more template components here
};

class TemplateService {
  getTemplateComponent(componentName: string) {
    console.log('Getting template component for:', componentName);

    // Check if the requested component exists in our templateComponents
    if (templateComponents[componentName]) {
      return templateComponents[componentName];
    }

    // If the component doesn't exist, log a warning and return DefaultTemplate as fallback
    console.warn(`Component ${componentName} not found, using DefaultTemplate instead`);
    return templateComponents['DefaultTemplate'];
  }

  parseTemplateFeatures(features: string[]) {
    try {
      return features.map(feature => JSON.parse(feature)).flat();
    } catch (error) {
      console.error('Error parsing template features:', error);
      return [];
    }
  }

  parseTemplateStyles(styles: string[]) {
    try {
      return styles.map(style => JSON.parse(style)).flat();
    } catch (error) {
      console.error('Error parsing template styles:', error);
      return [];
    }
  }
}

export const templateService = new TemplateService();
