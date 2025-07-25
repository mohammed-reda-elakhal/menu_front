import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const LoadingSkeleton = ({ 
  className = '',
  width = '100%',
  height = '20px',
  rounded = 'md',
  animate = true
}) => {
  const { darkMode } = useTheme();

  const skeletonClass = `
    ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
    rounded-${rounded}
    ${animate ? 'animate-pulse' : ''}
    ${className}
  `;

  return (
    <div
      className={skeletonClass}
      style={{ width, height }}
    />
  );
};

// Product card skeleton
export const ProductCardSkeleton = () => {
  const { darkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        p-4 rounded-lg border
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      {/* Image skeleton */}
      <LoadingSkeleton height="200px" rounded="lg" className="mb-4" />
      
      {/* Title skeleton */}
      <LoadingSkeleton height="24px" className="mb-2" />
      
      {/* Description skeleton */}
      <LoadingSkeleton height="16px" className="mb-1" />
      <LoadingSkeleton height="16px" width="80%" className="mb-3" />
      
      {/* Price skeleton */}
      <div className="flex justify-between items-center mb-3">
        <LoadingSkeleton height="20px" width="60px" />
        <LoadingSkeleton height="20px" width="40px" />
      </div>
      
      {/* Badges skeleton */}
      <div className="flex gap-2 mb-3">
        <LoadingSkeleton height="24px" width="60px" rounded="full" />
        <LoadingSkeleton height="24px" width="50px" rounded="full" />
      </div>
      
      {/* Actions skeleton */}
      <div className="flex gap-2">
        <LoadingSkeleton height="36px" width="36px" rounded="lg" />
        <LoadingSkeleton height="36px" width="36px" rounded="lg" />
        <LoadingSkeleton height="36px" width="36px" rounded="lg" />
      </div>
    </motion.div>
  );
};

// Table row skeleton
export const TableRowSkeleton = ({ columns = 6 }) => {
  const { darkMode } = useTheme();

  return (
    <tr className={darkMode ? 'bg-gray-800' : 'bg-white'}>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <LoadingSkeleton 
            height="20px" 
            width={index === 0 ? '80px' : index === 1 ? '120px' : '60px'} 
          />
        </td>
      ))}
    </tr>
  );
};

// Products list skeleton
export const ProductsListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Products table skeleton
export const ProductsTableSkeleton = ({ rows = 10, columns = 6 }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`
      rounded-lg border overflow-hidden
      ${darkMode ? 'border-gray-700' : 'border-gray-200'}
    `}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <LoadingSkeleton height="16px" width="80px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`
          divide-y
          ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}
        `}>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Search results skeleton
export const SearchResultsSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3">
          <LoadingSkeleton height="48px" width="48px" rounded="lg" />
          <div className="flex-1">
            <LoadingSkeleton height="16px" className="mb-2" />
            <LoadingSkeleton height="14px" width="70%" />
          </div>
          <LoadingSkeleton height="20px" width="50px" />
        </div>
      ))}
    </div>
  );
};

// Categories filter skeleton
export const CategoriesFilterSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-3 rounded-lg border">
          <LoadingSkeleton height="16px" className="mb-1" />
          <LoadingSkeleton height="12px" width="60%" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
