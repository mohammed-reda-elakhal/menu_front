import React, { useState } from 'react';

const CacheClearer = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState('');

  const clearCache = async () => {
    setIsClearing(true);
    setMessage('Clearing cache and unregistering service workers...');

    try {
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        if (registrations.length > 0) {
          for (const registration of registrations) {
            await registration.unregister();
          }
          setMessage(prev => prev + '\nService workers unregistered successfully.');
        } else {
          setMessage(prev => prev + '\nNo service workers found.');
        }
      }

      // Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        
        if (cacheNames.length > 0) {
          await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
          setMessage(prev => prev + '\nCaches cleared successfully.');
        } else {
          setMessage(prev => prev + '\nNo caches found.');
        }
      }

      // Clear localStorage
      localStorage.clear();
      setMessage(prev => prev + '\nLocal storage cleared.');

      // Clear sessionStorage
      sessionStorage.clear();
      setMessage(prev => prev + '\nSession storage cleared.');

      setMessage(prev => prev + '\n\nAll done! Reloading page in 3 seconds...');
      
      // Reload the page after a delay
      setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    } catch (error) {
      setMessage(prev => prev + `\nError: ${error.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={clearCache}
        disabled={isClearing}
        className="bg-primary hover:bg-secondary2 text-white py-2 px-4 rounded-lg 
          text-sm font-medium transition-colors duration-300 shadow-lg"
      >
        {isClearing ? 'Clearing...' : 'Clear Cache'}
      </button>
      
      {message && (
        <div className="absolute bottom-full right-0 mb-2 p-3 bg-secondary1 border border-primary/20 
          rounded-lg shadow-lg text-white text-xs max-w-xs whitespace-pre-line">
          {message}
        </div>
      )}
    </div>
  );
};

export default CacheClearer;
