import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import useVirtualScroll from '../../hooks/useVirtualScroll';
import { useTheme } from '../../context/ThemeContext';

const VirtualScroll = ({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  overscan = 5,
  className = '',
  emptyMessage = 'No items to display',
  loadingMessage = 'Loading...',
  isLoading = false,
  onScroll,
  showScrollbar = true
}) => {
  const { darkMode } = useTheme();

  const {
    scrollElementRef,
    visibleItems,
    totalHeight,
    handleScroll,
    scrollToTop,
    scrollToBottom,
    isScrolledToTop,
    isScrolledToBottom
  } = useVirtualScroll({
    items,
    itemHeight,
    containerHeight,
    overscan
  });

  // Enhanced scroll handler
  const enhancedHandleScroll = (e) => {
    handleScroll(e);
    onScroll?.(e);
  };

  // Memoize the virtual items to prevent unnecessary re-renders
  const virtualItems = useMemo(() => {
    return visibleItems.map((item) => (
      <div
        key={item.index}
        style={{
          position: 'absolute',
          top: item.offsetY,
          left: 0,
          right: 0,
          height: itemHeight,
        }}
        className="virtual-item"
      >
        {renderItem(item, item.index)}
      </div>
    ));
  }, [visibleItems, renderItem, itemHeight]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center">
          <div className={`text-4xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            📦
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Scroll to top/bottom buttons */}
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1">
        {!isScrolledToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={`
              p-2 rounded-full shadow-lg transition-all duration-200
              ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }
            `}
            title="Scroll to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}

        {!isScrolledToBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToBottom}
            className={`
              p-2 rounded-full shadow-lg transition-all duration-200
              ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }
            `}
            title="Scroll to bottom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Virtual scroll container */}
      <div
        ref={scrollElementRef}
        onScroll={enhancedHandleScroll}
        className={`
          relative overflow-auto
          ${showScrollbar ? '' : 'scrollbar-hide'}
          ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}
          rounded-lg
        `}
        style={{ height: containerHeight }}
      >
        {/* Total height container */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Rendered virtual items */}
          {virtualItems}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`
        mt-2 text-xs text-center
        ${darkMode ? 'text-gray-400' : 'text-gray-500'}
      `}>
        Showing {visibleItems.length} of {items.length} items
      </div>
    </div>
  );
};

// Higher-order component for virtual scrolling with automatic item height detection
export const AutoVirtualScroll = ({
  items,
  estimatedItemHeight = 100,
  ...props
}) => {
  // This could be enhanced to automatically detect item heights
  // For now, we'll use the estimated height
  return (
    <VirtualScroll
      items={items}
      itemHeight={estimatedItemHeight}
      {...props}
    />
  );
};

export default VirtualScroll;
