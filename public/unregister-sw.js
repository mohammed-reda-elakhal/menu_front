// This script will unregister any service workers
(function() {
  'use strict';

  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    console.log('Unregistering service workers...');
    
    // Get all service worker registrations
    navigator.serviceWorker.getRegistrations()
      .then(function(registrations) {
        // Loop through all registrations and unregister them
        for (let registration of registrations) {
          registration.unregister();
          console.log('Service worker unregistered:', registration);
        }
        console.log('All service workers unregistered successfully');
        
        // Clear caches
        if ('caches' in window) {
          caches.keys()
            .then(function(cacheNames) {
              return Promise.all(
                cacheNames.map(function(cacheName) {
                  console.log('Deleting cache:', cacheName);
                  return caches.delete(cacheName);
                })
              );
            })
            .then(function() {
              console.log('All caches cleared successfully');
              // Reload the page to apply changes
              window.location.reload(true);
            })
            .catch(function(error) {
              console.error('Error clearing caches:', error);
            });
        } else {
          console.log('Cache API not supported in this browser');
          // Reload the page to apply changes
          window.location.reload(true);
        }
      })
      .catch(function(error) {
        console.error('Error unregistering service workers:', error);
      });
  } else {
    console.log('Service workers not supported in this browser');
  }
})();
