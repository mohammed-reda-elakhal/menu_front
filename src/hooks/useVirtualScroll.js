import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for virtual scrolling
 * @param {Array} items - Array of items to virtualize
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} containerHeight - Height of the container in pixels
 * @param {number} overscan - Number of items to render outside visible area
 * @returns {Object} - Virtual scroll state and methods
 */
export const useVirtualScroll = ({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef(null);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Get visible items
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    ...item,
    index: startIndex + index,
    offsetY: (startIndex + index) * itemHeight
  }));

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Handle scroll event
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Scroll to specific item
  const scrollToItem = useCallback((index) => {
    if (scrollElementRef.current) {
      const scrollTop = index * itemHeight;
      scrollElementRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  }, [itemHeight]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToItem(0);
  }, [scrollToItem]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    scrollToItem(items.length - 1);
  }, [scrollToItem, items.length]);

  return {
    // Refs
    scrollElementRef,
    
    // Visible items data
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    
    // Scroll state
    scrollTop,
    
    // Event handlers
    handleScroll,
    
    // Navigation methods
    scrollToItem,
    scrollToTop,
    scrollToBottom,
    
    // Utilities
    isScrolledToTop: scrollTop === 0,
    isScrolledToBottom: scrollTop + containerHeight >= totalHeight,
    visibleItemsCount: visibleItems.length,
    totalItemsCount: items.length
  };
};

export default useVirtualScroll;
