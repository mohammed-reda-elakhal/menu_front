import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  const { darkMode } = useTheme();

  if (totalPages <= 1) return null;

  // Calculate visible page range
  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const buttonBaseClass = `
    px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
  `;

  const activeButtonClass = `
    ${buttonBaseClass}
    bg-primary text-white shadow-sm
    hover:bg-primary/90 transform hover:scale-105
  `;

  const inactiveButtonClass = `
    ${buttonBaseClass}
    ${darkMode 
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
    }
    hover:transform hover:scale-105
  `;

  const disabledButtonClass = `
    ${buttonBaseClass}
    ${darkMode 
      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
    }
  `;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Info section */}
      {showInfo && (
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* First page button */}
        {showFirstLast && (
          <motion.button
            whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
            whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
            onClick={() => currentPage > 1 && onPageChange(1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? disabledButtonClass : inactiveButtonClass}
            title="First page"
          >
            <FiChevronsLeft className="w-4 h-4" />
          </motion.button>
        )}

        {/* Previous page button */}
        <motion.button
          whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? disabledButtonClass : inactiveButtonClass}
          title="Previous page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {/* Show ellipsis if there are pages before visible range */}
          {visiblePages[0] > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(1)}
                className={inactiveButtonClass}
              >
                1
              </motion.button>
              {visiblePages[0] > 2 && (
                <span className={`px-2 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ...
                </span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={page === currentPage ? activeButtonClass : inactiveButtonClass}
            >
              {page}
            </motion.button>
          ))}

          {/* Show ellipsis if there are pages after visible range */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className={`px-2 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ...
                </span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(totalPages)}
                className={inactiveButtonClass}
              >
                {totalPages}
              </motion.button>
            </>
          )}
        </div>

        {/* Next page button */}
        <motion.button
          whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}
          title="Next page"
        >
          <FiChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last page button */}
        {showFirstLast && (
          <motion.button
            whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
            whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
            onClick={() => currentPage < totalPages && onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}
            title="Last page"
          >
            <FiChevronsRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
