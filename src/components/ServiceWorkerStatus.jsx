import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ServiceWorkerStatus = () => {
  const [swStatus, setSwStatus] = useState('checking');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      setSwStatus('unsupported');
      return;
    }

    // Check if service worker is registered
    navigator.serviceWorker.getRegistration()
      .then(registration => {
        if (registration) {
          setSwStatus('registered');
        } else {
          setSwStatus('unregistered');
        }
      })
      .catch(error => {
        console.error('Error checking service worker:', error);
        setSwStatus('error');
      });

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-4 z-50 bg-secondary1 border border-primary/20 rounded-lg p-4 shadow-lg max-w-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">PWA Status</h3>
        <button 
          onClick={() => setShowStatus(false)}
          className="text-gray_bg hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray_bg">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            swStatus === 'registered' ? 'bg-green-500' : 
            swStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-gray_bg">
            Service Worker: {
              swStatus === 'registered' ? 'Active' :
              swStatus === 'unregistered' ? 'Not Registered' :
              swStatus === 'unsupported' ? 'Not Supported' :
              swStatus === 'checking' ? 'Checking...' : 'Error'
            }
          </span>
        </div>
        
        <div className="text-xs text-gray_bg/70 mt-2">
          {swStatus === 'registered' ? 
            'Your app can work offline!' : 
            'Your app requires an internet connection.'
          }
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceWorkerStatus;
