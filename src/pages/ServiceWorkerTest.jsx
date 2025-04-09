import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiWifiOff, FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const ServiceWorkerTest = () => {
  const [swStatus, setSwStatus] = useState('checking');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheContents, setCacheContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check service worker status
  const checkServiceWorker = async () => {
    setIsLoading(true);
    
    try {
      if (!('serviceWorker' in navigator)) {
        setSwStatus('unsupported');
        setIsLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        setSwStatus('registered');
        // Check cache contents
        try {
          const cache = await caches.open('meniwi-cache-v1');
          const keys = await cache.keys();
          setCacheContents(keys.map(request => request.url));
        } catch (error) {
          console.error('Error checking cache:', error);
        }
      } else {
        setSwStatus('unregistered');
      }
    } catch (error) {
      console.error('Error checking service worker:', error);
      setSwStatus('error');
    }
    
    setIsLoading(false);
  };

  // Register service worker manually
  const registerServiceWorker = async () => {
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      setSwStatus('registered');
      
      // Wait a moment for the service worker to activate
      setTimeout(checkServiceWorker, 1000);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setSwStatus('error');
      setIsLoading(false);
    }
  };

  // Unregister service worker
  const unregisterServiceWorker = async () => {
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        await registration.unregister();
        setSwStatus('unregistered');
        setCacheContents([]);
      }
    } catch (error) {
      console.error('Error unregistering service worker:', error);
    }
    
    setIsLoading(false);
  };

  // Clear cache
  const clearCache = async () => {
    setIsLoading(true);
    
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      setCacheContents([]);
      alert('Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache');
    }
    
    setIsLoading(false);
  };

  // Test offline mode
  const testOfflineMode = () => {
    alert('To test offline mode:\n\n1. Open Chrome DevTools (F12)\n2. Go to the Network tab\n3. Check "Offline" checkbox\n4. Refresh the page\n\nYou should see the offline page.');
  };

  useEffect(() => {
    checkServiceWorker();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary1">
      <SEO 
        title="Service Worker Test | Meniwi"
        description="Test the service worker functionality of the Meniwi application."
      />
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary1/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Service Worker Testing</h1>
          
          {/* Status Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Current Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Online Status */}
              <div className="bg-secondary1/70 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  {isOnline ? (
                    <FiWifi className="text-green-500 text-xl" />
                  ) : (
                    <FiWifiOff className="text-red-500 text-xl" />
                  )}
                  <h3 className="text-white font-medium">Network Status</h3>
                </div>
                <p className="text-gray_bg">
                  {isOnline ? 'You are online' : 'You are offline'}
                </p>
              </div>
              
              {/* Service Worker Status */}
              <div className="bg-secondary1/70 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  {swStatus === 'registered' ? (
                    <FiCheckCircle className="text-green-500 text-xl" />
                  ) : swStatus === 'checking' ? (
                    <FiRefreshCw className="text-yellow-500 text-xl animate-spin" />
                  ) : (
                    <FiXCircle className="text-red-500 text-xl" />
                  )}
                  <h3 className="text-white font-medium">Service Worker</h3>
                </div>
                <p className="text-gray_bg">
                  {swStatus === 'registered' ? 'Active and registered' :
                   swStatus === 'unregistered' ? 'Not registered' :
                   swStatus === 'unsupported' ? 'Not supported in this browser' :
                   swStatus === 'checking' ? 'Checking status...' : 'Error checking status'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
            
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={checkServiceWorker}
                disabled={isLoading}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-white rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                  <span>Refresh Status</span>
                </div>
              </motion.button>
              
              {swStatus !== 'registered' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={registerServiceWorker}
                  disabled={isLoading || swStatus === 'unsupported'}
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <FiCheckCircle />
                    <span>Register Service Worker</span>
                  </div>
                </motion.button>
              )}
              
              {swStatus === 'registered' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={unregisterServiceWorker}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-white rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FiXCircle />
                      <span>Unregister Service Worker</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearCache}
                    disabled={isLoading}
                    className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-white rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FiAlertCircle />
                      <span>Clear Cache</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={testOfflineMode}
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-white rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FiWifiOff />
                      <span>Test Offline Mode</span>
                    </div>
                  </motion.button>
                </>
              )}
            </div>
          </div>
          
          {/* Cache Contents */}
          {cacheContents.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Cached Resources</h2>
              
              <div className="bg-secondary1/70 rounded-lg p-4 border border-primary/10 max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {cacheContents.map((url, index) => (
                    <li key={index} className="text-gray_bg text-sm break-all">
                      {url}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h2 className="text-lg font-semibold text-white mb-2">How to Test Service Worker</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray_bg">
              <li>Register the service worker using the button above</li>
              <li>Check that the service worker status shows as "Active and registered"</li>
              <li>To test offline functionality:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Open Chrome DevTools (F12)</li>
                  <li>Go to the Network tab</li>
                  <li>Check the "Offline" checkbox</li>
                  <li>Refresh the page</li>
                  <li>You should see the offline page</li>
                </ul>
              </li>
              <li>To test caching:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Load several pages of the application</li>
                  <li>Check the "Cached Resources" section to see what's been cached</li>
                  <li>Go offline and try to access those pages</li>
                </ul>
              </li>
            </ol>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceWorkerTest;
