import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTemplate } from '../../redux/apiCalls/templateApiCalls';

const DeleteTemplateModal = ({ isOpen, onClose, template }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.template);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setLocalLoading(false);
  }, [isOpen]);

  // Handle delete
  const handleDelete = async () => {
    if (!template?._id) return;
    setLocalLoading(true);
    try {
      const result = await dispatch(deleteTemplate(template._id));
      if (result.success) {
        setLocalLoading(false);
        onClose();
      } else {
        setLocalLoading(false);
      }
    } catch (error) {
      setLocalLoading(false);
      console.error('Error deleting template:', error);
    }
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && template && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
                  <FiAlertTriangle className="w-6 h-6" />
                  {t('dashboard.templates.delete.title') || 'Delete Template'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-center mb-6">
                  {template.imagePreview?.url && (
                    <img
                      src={template.imagePreview.url}
                      alt={template.name}
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4 border-2 border-red-200"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('dashboard.templates.delete.confirmation', { name: template.name }) ||
                      `Are you sure you want to delete "${template.name}"? This action cannot be undone.`}
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-400">
                        {t('dashboard.templates.delete.warning') || 'Warning'}
                      </h4>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {t('dashboard.templates.delete.warningText') ||
                          'Deleting this template will remove it permanently. Any menus using this template will be affected.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <>
                    <FiTrash2 className="w-5 h-5" />
                    {t('dashboard.templates.delete.deleteButton') || 'Delete Template'}
                  </>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteTemplateModal;
