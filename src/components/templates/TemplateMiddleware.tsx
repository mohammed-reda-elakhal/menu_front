import React, { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Template, templateService } from '../../services/templateService';

interface TemplateMiddlewareProps {
  templateId?: string;
  componentName?: string;
  menuData: any;
}

/**
 * TemplateMiddleware component
 * 
 * This component serves as a middleware between template data and template components.
 * It can load a template either by:
 * 1. templateId - Loads a template from the Redux store by ID
 * 2. componentName - Directly loads a component by name
 * 
 * If both are provided, templateId takes precedence.
 */
const TemplateMiddleware: React.FC<TemplateMiddlewareProps> = ({ 
  templateId, 
  componentName, 
  menuData 
}) => {
  const { templates } = useSelector((state: any) => state.template);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // If templateId is provided, find the template in the Redux store
    if (templateId && templates && templates.length > 0) {
      const foundTemplate = templates.find((t: Template) => t._id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        setLoading(false);
      } else {
        setError(`Template with ID ${templateId} not found`);
        setLoading(false);
      }
    } 
    // If componentName is provided directly, use it
    else if (componentName) {
      setLoading(false);
    } else {
      setError('No template ID or component name provided');
      setLoading(false);
    }
  }, [templateId, componentName, templates]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading template...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  // Get the component name either from the template or directly from props
  const finalComponentName = template?.componentName || componentName;

  if (!finalComponentName) {
    return <div className="flex justify-center items-center min-h-screen">No template component specified</div>;
  }

  // Get the component from the template service
  const TemplateComponent = templateService.getTemplateComponent(finalComponentName);

  // Parse template styles and features if a template is available
  const styles = template ? templateService.parseTemplateStyles(template.style) : [];
  const features = template ? templateService.parseTemplateFeatures(template.features) : [];

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading template...</div>}>
      <TemplateComponent 
        menuData={menuData}
        styles={styles}
        features={features}
      />
    </Suspense>
  );
};

export default TemplateMiddleware;
