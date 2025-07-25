import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-200 ease-in-out
      ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className={`absolute inset-0 bg-gray-900 transition-opacity duration-200 ease-in-out
            ${isOpen ? 'opacity-75' : 'opacity-0'}`}></div>
        </div>

        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden
          shadow-xl transform transition-all duration-200 ease-in-out sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
          ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
          ${darkMode ? 'bg-secondary1' : 'bg-white'}`}>
          <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${darkMode ? 'bg-secondary1' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
