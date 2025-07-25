import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuByCodeMenu } from '../redux/apiCalls/menuApiCalls';
import LoadingSpinner from '../components/LoadingSpinner';
import TemplateMiddleware from '../components/templates/TemplateMiddleware';
import { FiInfo } from 'react-icons/fi';

const Menu = () => {
  const { code } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get menu data from Redux
  const { currentMenu, loading, error } = useSelector(state => state.menu);

  // Fetch menu data when component mounts
  useEffect(() => {
    if (code) {
      dispatch(getMenuByCodeMenu(code));
    }
  }, [dispatch, code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Menu Not Found</h2>
          <p className="text-gray-600 mb-6">The menu you're looking for doesn't exist or is not available.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Menu Found</h2>
          <p className="text-gray-600 mb-4">Please check the menu code and try again.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Function to refresh menu data
  const refreshMenuData = () => {
    if (code) {
      dispatch(getMenuByCodeMenu(code));
    }
  };

  // Render the template for the menu
  const renderTemplate = () => {
    // Get the template component name from the menu data or use DefaultTemplate as fallback
    const componentName = currentMenu?.template?.componentName || 'DefaultTemplate';

    // Log the template information for debugging
    console.log('Menu template info:', {
      hasTemplate: !!currentMenu?.template,
      componentName,
      templateId: currentMenu?.template?._id
    });

    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        {/* Business Profile Link */}
        {currentMenu?.business?._id && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link
              to={`/business-profile/${currentMenu.business._id}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
              title="View Business Profile"
            >
              <FiInfo className="w-5 h-5" />
              <span className="hidden sm:inline">Business Info</span>
            </Link>
          </div>
        )}
        <TemplateMiddleware
          componentName={componentName}
          menuData={{
            ...currentMenu,
            refreshData: refreshMenuData
          }}
        />
      </React.Suspense>
    );
  };

  // Wrap the template in a div to ensure the floating theme toggle is visible
  return (
    <div className="relative min-h-screen">
      {renderTemplate()}
    </div>
  );
};

export default Menu;
