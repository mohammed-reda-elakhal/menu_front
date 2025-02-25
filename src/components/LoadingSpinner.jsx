import React from 'react'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary1">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingSpinner
