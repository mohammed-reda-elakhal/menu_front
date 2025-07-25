import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTemplateById } from '../../redux/apiCalls/templateApiCalls';
import TemplateMiddleware from './TemplateMiddleware';

interface TemplateFactoryProps {
  menuData: any;
  templateId?: string;
}

/**
 * TemplateFactory component
 * 
 * This component is responsible for loading template data from the Redux store
 * and rendering the appropriate template component.
 * 
 * It can work in two modes:
 * 1. With a templateId prop - directly loads that template
 * 2. Without templateId - tries to get the template ID from the URL params
 */
const TemplateFactory: React.FC<TemplateFactoryProps> = ({ menuData, templateId: propTemplateId }) => {
  const dispatch = useDispatch();
  const { templateId: paramTemplateId } = useParams();
  const { templates, currentTemplate, error } = useSelector((state: any) => state.template);
  
  // Use the template ID from props or URL params
  const templateId = propTemplateId || paramTemplateId;

  useEffect(() => {
    if (templateId) {
      dispatch(getTemplateById(templateId) as any);
    }
  }, [dispatch, templateId]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-800">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Template</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If we have a current template loaded, use it
  if (currentTemplate) {
    return <TemplateMiddleware templateId={templateId} menuData={menuData} />;
  }

  // If we have templates but no current template, try to find it in the templates array
  if (templateId && templates && templates.length > 0) {
    const template = templates.find((t: any) => t._id === templateId);
    if (template) {
      return <TemplateMiddleware componentName={template.componentName} menuData={menuData} />;
    }
  }

  // If we don't have a template yet, show loading
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Loading Template</h2>
        <p>Please wait while we load your template...</p>
      </div>
    </div>
  );
};

export default TemplateFactory;
