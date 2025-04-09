import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEye } from 'react-icons/fi';

interface TemplatePreviewHeaderProps {
  templateName: string;
}

const TemplatePreviewHeader: React.FC<TemplatePreviewHeaderProps> = ({ templateName }) => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-secondary1/80 backdrop-blur-lg border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Side - Back Button */}
        <div className="flex items-center">
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/marketplace"
              className="flex items-center gap-1.5 sm:gap-2 text-gray_bg hover:text-primary transition-colors"
            >
              <FiArrowLeft className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-base hidden xs:inline">Back to Marketplace</span>
              <span className="text-sm xs:hidden">Back</span>
            </Link>
          </motion.div>
        </div>
        
        {/* Right Side - Preview Mode */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-gray_bg text-xs sm:text-sm hidden xs:inline">Preview Mode:</span>
          <span className="text-gray_bg text-xs sm:text-sm xs:hidden">
            <FiEye className="inline-block mr-1" />
          </span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]"
          >
            {templateName}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplatePreviewHeader; 