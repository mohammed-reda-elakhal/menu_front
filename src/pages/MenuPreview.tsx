import React from 'react';
import { useSelector } from 'react-redux';
import TemplateLoader from '../components/templates/TemplateLoader';
import { DEFAULT_TEMPLATE } from '../config/templates';

const MenuPreview: React.FC = () => {
  const { selectedTemplate, menuData } = useSelector((state: any) => state.menu);

  return (
    <div>
      <TemplateLoader 
        template={selectedTemplate || DEFAULT_TEMPLATE}
        menuData={menuData}
      />
    </div>
  );
};

export default MenuPreview;
