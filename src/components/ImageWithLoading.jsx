import React, { useState } from 'react'

function ImageWithLoading({ src, alt, className }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  )
}

export default ImageWithLoading
