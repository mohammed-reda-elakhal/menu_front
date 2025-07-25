import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { getAllTemplates, resetTemplateState, toggleTemplatePublished } from '../../redux/apiCalls/templateApiCalls';
import CreateTemplateModal from '../modals/CreateTemplateModal';
import UpdateTemplateModal from '../modals/UpdateTemplateModal';
import DeleteTemplateModal from '../modals/DeleteTemplateModal';


const TemplateSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { templates, error, success, pagination } = useSelector((state) => state.template);
  const [publishingTemplateId, setPublishingTemplateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simple search functionality
  const filteredTemplates = templates.filter((template) => {
    const query = debouncedSearchQuery.toLowerCase().trim();
    if (!query) return true;

    const searchableFields = [
      template.name,
      template.description,
      template.componentName,
      template.isFree ? 'free' : template.price?.toString(),
      template.isPublished ? 'published' : 'draft',
      template.category
    ];

    return searchableFields.some(field => 
      field && field.toLowerCase().includes(query)
    );
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Fetch templates on component mount and page change
  useEffect(() => {
    dispatch(getAllTemplates(currentPage));
  }, [dispatch, currentPage]);

  // Refresh templates when operations succeed
  useEffect(() => {
    if (success) {
      dispatch(getAllTemplates(currentPage));
      // Clear the success state after refreshing templates
      setTimeout(() => {
        dispatch(resetTemplateState());
      }, 1000);
    }
  }, [success, dispatch, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle edit template
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsUpdateModalOpen(true);
  };

  // Handle delete template
  const handleDeleteTemplate = (template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  // Enhanced toggle publish handler
  const handleTogglePublish = async (template) => {
    try {
      setPublishingTemplateId(template._id);
      const result = await dispatch(toggleTemplatePublished(template._id, !template.isPublished));
      
      if (result.success) {
        // Show success message or notification here if needed
        console.log(`Template ${result.isPublished ? 'published' : 'unpublished'} successfully`);
      } else {
        // Show error message or notification here
        console.error('Failed to update template status:', result.error);
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    } finally {
      setPublishingTemplateId(null);
    }
  };

  // Remove loading condition and keep only error check
  if (error) {
    return (
      <div className="container mx-auto">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Templates</h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(getAllTemplates(currentPage))}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-lg text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Reload Page
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary2 bg-clip-text text-transparent">
            {t('dashboard.templates.title') || 'Templates'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('dashboard.templates.subtitle') || 'Manage your menu templates'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(getAllTemplates(currentPage))}
            className="relative group p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            title="Refresh templates"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-light transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Refresh templates
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          </motion.button>

          {/* Add New Template Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 transition-colors duration-300 text-white px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            <span className="text-sm font-medium">{t('dashboard.templates.addNew') || 'Add New Template'}</span>
          </motion.button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search templates by name, description, component, price, status..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} matching "{debouncedSearchQuery}"
          </div>
        )}
        {!searchQuery && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
        )}
      </div>

      {/* Templates Table */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-secondary1/50 backdrop-blur-sm rounded-xl p-12 text-center border border-primary/20">
          <div className="bg-primary/10 inline-flex p-4 rounded-full mb-4">
            <FiEye className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {searchQuery 
              ? t('dashboard.templates.noSearchResultsTitle') || 'No Search Results'
              : t('dashboard.templates.noTemplatesTitle') || 'No Templates Found'
            }
          </h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? t('dashboard.templates.noSearchResultsDescription') || `No templates match your search for "${debouncedSearchQuery}". Try adjusting your search terms.`
              : t('dashboard.templates.noTemplatesDescription') || 'You haven\'t created any templates yet. Create your first template to get started.'
            }
          </p>
          {searchQuery ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearSearch}
              className="bg-primary hover:bg-primary/90 transition-colors duration-300 text-white px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              <span className="text-sm font-medium">Clear Search</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90 transition-colors duration-300 text-white px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              <span className="text-sm font-medium">{t('dashboard.templates.createFirst') || 'Create First Template'}</span>
            </motion.button>
          )}
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Template</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Component</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Price</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Description</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Demo</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Dates</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTemplates.map((template) => (
                  <tr key={template._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* Template Name & Image */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center gap-2">
                        {template.imagePreview && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img 
                              src={template.imagePreview.url} 
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-white text-sm max-w-[120px] truncate">
                            {template.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Component Name */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-primary dark:text-primary-light">
                        {template.componentName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        template.isFree ? 'text-green-600 dark:text-green-400' : 'text-secondary2 dark:text-secondary2-light'
                      }`}>
                        {template.isFree ? 'Free Template' : `${template.price} DH`}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-4 sm:px-6 py-4 group relative">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-[200px]">
                        {template.description}
                      </p>
                      {/* Tooltip */}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50">
                        <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg p-4 shadow-lg w-[400px]">
                          <div className="font-medium mb-1 text-gray-300">Full Description:</div>
                          <p className="text-gray-100 whitespace-normal leading-relaxed">
                            {template.description}
                          </p>
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                        </div>
                      </div>
                    </td>

                    {/* Demo Path */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {template.demoPath && (
                        <Link 
                          to={template.demoPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary dark:text-primary-light hover:underline text-sm flex items-center gap-1"
                        >
                          <PreviewIcon className="w-4 h-4" />
                          <span>View Demo</span>
                        </Link>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(template)}
                        disabled={publishingTemplateId === template._id}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          template.isPublished
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                        } ${publishingTemplateId === template._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {publishingTemplateId === template._id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              template.isPublished 
                                ? 'bg-green-500 dark:bg-green-400' 
                                : 'bg-yellow-500 dark:bg-yellow-400'
                            }`}></div>
                            <span>{template.isPublished ? 'Published' : 'Draft'}</span>
                          </div>
                        )}
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light font-medium">
                        {template.category}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Updated: {new Date(template.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {template.demoPath && (
                          <Link 
                            to={template.demoPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="View Demo"
                          >
                            <PreviewIcon className="w-5 h-5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          title="Edit Template"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                          title="Delete Template"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTemplates.map((template) => (
              <div key={template._id} className="bg-white dark:bg-gray-900 p-4 space-y-4">
                {/* Template Header */}
                <div className="flex flex-col items-center gap-3 mb-4">
                  {template.imagePreview && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img 
                        src={template.imagePreview.url} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                      {template.name}
                    </h3>
                    <div className="text-sm text-primary dark:text-primary-light mt-1">
                      {template.componentName}
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</div>
                  <div className={`text-base font-medium px-3 py-2 rounded-lg ${
                    template.isFree 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                      : 'bg-secondary2/10 dark:bg-secondary2-light/10 text-secondary2 dark:text-secondary2-light'
                  }`}>
                    {template.isFree ? 'Free Template' : `${template.price} DH`}
                  </div>
                </div>

                {/* Description Section */}
                <div className="group relative">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Description</div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {template.description}
                    </p>
                    {/* Tooltip for mobile */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block z-50 w-[400px]">
                      <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg p-4 shadow-lg">
                        <div className="font-medium mb-1 text-gray-300">Full Description:</div>
                        <p className="text-gray-100 whitespace-normal leading-relaxed">
                          {template.description}
                        </p>
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demo Path Section */}
                {template.demoPath && (
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Demo Link</div>
                    <div className="bg-primary/5 dark:bg-primary-light/5 rounded-lg p-3">
                      <Link 
                        to={template.demoPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-primary-light hover:underline flex items-center gap-2"
                      >
                        <PreviewIcon className="w-4 h-4" />
                        <span className="text-sm truncate">{template.demoPath}</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Status and Category Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Status */}
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                    <button
                      onClick={() => handleTogglePublish(template)}
                      disabled={publishingTemplateId === template._id}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        template.isPublished
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                      } ${publishingTemplateId === template._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {publishingTemplateId === template._id ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            template.isPublished 
                              ? 'bg-green-500 dark:bg-green-400' 
                              : 'bg-yellow-500 dark:bg-yellow-400'
                          }`}></div>
                          <span>{template.isPublished ? 'Published' : 'Draft'}</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Category */}
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</div>
                    <div className="px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary-light/10">
                      <span className="text-sm font-medium text-primary dark:text-primary-light">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dates</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Updated</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(template.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  {template.demoPath && (
                    <Link 
                      to={template.demoPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="View Demo"
                    >
                      <PreviewIcon className="w-5 h-5" />
                    </Link>
                  )}
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Edit Template"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                    title="Delete Template"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    pagination.hasPrevPage
                      ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    pagination.hasNextPage
                      ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * pagination.itemsPerPage + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.totalItems}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                        pagination.hasPrevPage
                          ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                        pagination.hasNextPage
                          ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UpdateTemplateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        template={selectedTemplate}
      />

      <DeleteTemplateModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
};

export default TemplateSettings;
