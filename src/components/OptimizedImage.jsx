import React, { useState } from 'react';

/**
 * OptimizedImage component for SEO-friendly images with lazy loading and blur-up effect
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image (required for SEO)
 * @param {string} props.className - CSS classes for the image
 * @param {string} props.width - Width of the image
 * @param {string} props.height - Height of the image
 * @param {boolean} props.eager - Whether to load the image eagerly (default: false)
 * @param {string} props.placeholder - Placeholder image URL
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  eager = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error event
  const handleError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Placeholder/blur-up effect */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ 
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={error ? placeholder : src}
        alt={alt || 'Image'} // Ensure alt text is always provided
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
