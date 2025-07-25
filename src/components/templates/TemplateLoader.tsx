import React, { Suspense } from 'react';
import { Template, templateService } from '../../services/templateService';

interface TemplateLoaderProps {
  template: Template;
  menuData: any;
}

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ template, menuData }) => {
  const TemplateComponent = templateService.getTemplateComponent(template.componentName);

  return (
    <Suspense fallback={<div>Loading template...</div>}>
      <TemplateComponent 
        menuData={menuData}
        styles={templateService.parseTemplateStyles(template.style)}
        features={templateService.parseTemplateFeatures(template.features)}
      />
    </Suspense>
  );
};

export default TemplateLoader;
