import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RatingComponent, RatingStats } from '../../services/RatingService';
import { getProduitById } from '../../redux/apiCalls/produitApiCalls';

/**
 * Example component showing how to use the RatingService
 * This can be used as a reference for implementing ratings in other components
 */
const ProductRatingExample = ({ productId }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Theme colors for the rating component
  const themeColors = {
    text: isDarkMode ? 'text-gray-200' : 'text-gray-800',
    muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getProduitById(productId));
        if (result.success) {
          setProduct(result.produit);
        } else {
          setError('Failed to load product');
        }
      } catch (err) {
        setError('An error occurred while loading the product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [dispatch, productId]);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Handle rating submission callback
  const handleRatingSubmit = (result) => {
    console.log('Rating submitted:', result);
    // You could update the product state here if needed
    if (result.success && product) {
      setProduct({
        ...product,
        ratings: result.ratings
      });
    }
  };

  // Handle rating check callback
  const handleRatingCheck = (result) => {
    console.log('Rating status checked:', result);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="p-4 text-center text-red-500">{error || 'Product not found'}</div>;
  }

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{product.nom}</h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="mb-4">
        <img
          src={product.image.url}
          alt={product.nom}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <div className="mb-4">
        <p className={`${themeColors.muted}`}>{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className={`text-lg font-bold ${themeColors.accent}`}>
            {product.prix.toFixed(2)} DH
          </span>
          {product.promo_prix && (
            <span className={`text-sm line-through ${themeColors.muted}`}>
              {product.promo_prix.toFixed(2)} DH
            </span>
          )}
        </div>
      </div>

      {/* Rating Statistics Display */}
      {product.ratings && product.ratings.total > 0 && (
        <div className="mb-4 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
          <h3 className={`text-sm font-medium mb-2 ${themeColors.text}`}>Current Ratings</h3>
          <RatingStats
            ratings={product.ratings}
            isDarkMode={isDarkMode}
            themeColors={themeColors}
          />
        </div>
      )}

      {/* Rating Component */}
      <div className="mt-4">
        <RatingComponent
          itemId={product._id}
          itemType="product"
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          hideAfterRating={false} // Keep showing the component after rating
          onRatingSubmit={handleRatingSubmit}
          onRatingCheck={handleRatingCheck}
          customStyles={{
            container: 'border border-gray-200 dark:border-gray-700 rounded-lg',
            text: 'font-medium',
            buttons: 'mb-2'
          }}
        />
      </div>
    </div>
  );
};

export default ProductRatingExample;
