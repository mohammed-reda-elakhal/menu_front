import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductForm from '../../../components/dashboard/forms/ProductForm';
import ProductsList from '../../../components/dashboard/tables/ProductsList';
import Modal from '../../../components/ui/Modal';
import { useTheme } from '../../../context/ThemeContext';
import { getMenusByBusiness } from '../../../redux/apiCalls/menuApiCalls';
import { getCategoriesByMenu } from '../../../redux/apiCalls/categorieApiCalls';
import {
  getProduitsByCategorie,
  getProduitsByMenu,
  createProduit,
  updateProduit,
  deleteProduit,
  toggleProductIsBest,
  toggleProduitVisible,
  bulkDeleteProduits
} from '../../../redux/apiCalls/produitApiCalls';
import { FaFileExcel, FaSyncAlt, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const Products = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Get selected business from Redux
  const { selectedBusiness } = useSelector(state => state.business);
  const { menusByBusiness, loading: menuLoading } = useSelector(state => state.menu);
  const { categoriesByMenu, loading: categoriesLoading } = useSelector(state => state.categorie);
  const { produitsByCategorie, produitsByMenu, loading: productsLoading } = useSelector(state => state.produit);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMenu, setHasMenu] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Fetch menus for the selected business
  useEffect(() => {
    if (selectedBusiness && selectedBusiness._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id));
    }
  }, [dispatch, selectedBusiness]);

  // Set hasMenu state based on menusByBusiness
  useEffect(() => {
    if (menusByBusiness && menusByBusiness.length > 0) {
      setHasMenu(true);
      // Select the first menu by default
      const firstMenu = menusByBusiness[0];
      setSelectedMenuId(firstMenu._id);
      setSelectedMenu(firstMenu);
    } else {
      setHasMenu(false);
      setSelectedMenuId(null);
      setSelectedMenu(null);
    }
  }, [menusByBusiness]);

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Use a ref to track the previous menuId
  const prevMenuIdRef = useRef(null);

  useEffect(() => {
    // Set isMounted to true when component mounts
    isMounted.current = true;

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch data for the selected menu
  useEffect(() => {
    if (selectedMenuId && prevMenuIdRef.current !== selectedMenuId) {
      // Update the previous menuId ref
      prevMenuIdRef.current = selectedMenuId;

      // Use a small delay to avoid multiple simultaneous requests
      const fetchData = async () => {
        try {
          // Fetch categories first
          const categoriesResult = await dispatch(getCategoriesByMenu(selectedMenuId));

          // Only proceed if component is still mounted
          if (isMounted.current) {
            // Small delay before fetching products
            setTimeout(async () => {
              if (isMounted.current) {
                await dispatch(getProduitsByMenu(selectedMenuId));
              }
            }, 300);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [dispatch, selectedMenuId]);

  // Update local categories state when categoriesByMenu changes
  useEffect(() => {
    if (categoriesByMenu && categoriesByMenu.length > 0) {
      setCategories(categoriesByMenu);
      // Select the first category by default if none is selected
      if (!selectedCategoryId) {
        setSelectedCategoryId(categoriesByMenu[0]._id);
      }
    } else {
      setCategories([]);
      setSelectedCategoryId(null);
    }
  }, [categoriesByMenu, selectedCategoryId]);

  // Filter products by search query
  const filteredProducts = produitsByMenu && produitsByMenu.length > 0
    ? produitsByMenu.filter(prod =>
        prod.nom && prod.nom.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Autocomplete suggestions (limit to 5)
  const suggestions = produitsByMenu && produitsByMenu.length > 0
    ? produitsByMenu.filter(prod =>
        searchQuery &&
        prod.nom &&
        prod.nom.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSubmit = async (formData) => {
    try {
      // Prepare data for API
      const productData = {
        nom: formData.name,
        description: formData.description,
        prix: parseFloat(formData.price),
        promo_prix: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
        categorie: formData.categoryId, // Use the category from the form
        image: formData.image,
        composant: Array.isArray(formData.components) ? formData.components : [],
        visible: formData.visible,
        // New attributes
        isVegetarian: formData.isVegetarian,
        isSpicy: formData.isSpicy,
        isHalal: formData.isHalal,
        isBest: formData.isBest,
        calories: (formData.calories !== undefined && formData.calories !== null && formData.calories !== '' && !isNaN(formData.calories)) ? parseFloat(formData.calories) : null,
        tags: Array.isArray(formData.tags) ? formData.tags : []
      };

      console.log('Submitting product data:', productData);

      let result;
      if (selectedProduct) {
        // Update existing product
        result = await dispatch(updateProduit(selectedProduct._id, productData));
        if (result.success) {
          toast.success(t('dashboard.products.products.updateSuccess'));
        } else {
          toast.error(result.error || t('dashboard.products.products.updateError'));
        }
      } else {
        // Create new product
        result = await dispatch(createProduit(productData));
        if (result.success) {
          toast.success(t('dashboard.products.products.createSuccess'));
        } else {
          toast.error(result.error || t('dashboard.products.products.createError'));
        }
      }

      // Close modal and reset selected product
      setIsModalOpen(false);
      setSelectedProduct(null);

      // Refresh products list
      if (selectedMenuId) {
        dispatch(getProduitsByMenu(selectedMenuId));
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    try {
      const result = await dispatch(deleteProduit(productId));
      if (result.success) {
        toast.success(t('dashboard.products.products.deleteSuccess'));
        // Refresh products list
        if (selectedMenuId) {
          dispatch(getProduitsByMenu(selectedMenuId));
        }
      } else {
        toast.error(result.error || t('dashboard.products.products.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleToggleVisibility = async (productId) => {
    try {
      const result = await dispatch(toggleProduitVisible(productId));
      if (result.success) {
        toast.success(t('dashboard.products.products.visibilityToggleSuccess'));
        // Refresh products list
        if (selectedMenuId) {
          dispatch(getProduitsByMenu(selectedMenuId));
        }
      } else {
        toast.error(result.error || t('dashboard.products.products.visibilityToggleError'));
      }
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleToggleIsBest = async (productId) => {
    try {
      const result = await dispatch(toggleProductIsBest(productId));
      if (result.success) {
        toast.success(t('dashboard.products.products.bestToggleSuccess') || 'Best status updated successfully');
        // Refresh products list
        if (selectedMenuId) {
          dispatch(getProduitsByMenu(selectedMenuId));
        }
      } else {
        toast.error(result.error || t('dashboard.products.products.bestToggleError') || 'Failed to update best status');
      }
    } catch (error) {
      console.error('Error toggling product best status:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleCreateMenu = () => {
    navigate('/dashboard/menu-settings');
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleBulkDelete = async (ids) => {
    try {
      const result = await dispatch(bulkDeleteProduits(ids));
      if (result.success) {
        toast.success(t('dashboard.products.products.bulkDeleteSuccess') || 'Products deleted successfully');
        if (selectedMenuId) {
          dispatch(getProduitsByMenu(selectedMenuId));
        }
      } else {
        toast.error(result.error || t('dashboard.products.products.bulkDeleteError') || 'Failed to delete products');
      }
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleExportSelected = () => {
    if (!selectedProductIds.length) return;
    const selected = filteredProducts.filter(p => selectedProductIds.includes(p._id));
    const data = selected.map(p => ({
      Name: p.nom,
      Category: p.categorie?.nom || '',
      Price: p.prix,
      PromoPrice: p.promo_prix,
      Description: p.description,
      Visible: p.visible ? 'Yes' : 'No',
      Best: p.isBest ? 'Yes' : 'No',
      Calories: p.calories,
      Tags: (p.tags || []).join(', ')
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'selected-products.xlsx');
  };

  const handleRefresh = () => {
    if (selectedMenuId) {
      dispatch(getProduitsByMenu(selectedMenuId));
    }
  };

  return (
    <div className={`p-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className={`text-2xl font-bold ${
          darkMode
            ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            : 'text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'
        }`}>
          {t('dashboard.products.products.title')}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          data-add-product
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg
            hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
            shadow-lg hover:shadow-blue-500/25 font-medium text-sm flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('dashboard.products.products.add')}
        </button>
      </div>

      {/* Menu Info Card */}
      {selectedMenu && (
        <div className={`mb-6 rounded-lg p-4 border shadow-md backdrop-blur-sm ${
          darkMode
            ? 'bg-gradient-to-r from-secondary1 via-[#0a1a4d]/80 to-secondary1 border-primary/20'
            : 'bg-gradient-to-r from-blue-50 via-blue-100/80 to-blue-50 border-blue-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedMenu.titre}
              </h2>
              <div className="flex flex-wrap items-center mt-1 gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode
                    ? 'bg-primary/20 text-primary'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {t('dashboard.menu.settings.menuCode')}: {selectedMenu.code_menu}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Menu Selector */}
              {menusByBusiness && menusByBusiness.length > 1 && (
                <div className="relative">
                  <select
                    value={selectedMenuId}
                    onChange={(e) => {
                      const menuId = e.target.value;
                      setSelectedMenuId(menuId);
                      const menu = menusByBusiness.find(m => m._id === menuId);
                      if (menu) setSelectedMenu(menu);
                    }}
                    className={`border text-sm rounded-lg focus:ring-primary focus:border-primary hover:border-primary transition-colors duration-200 block w-full p-2.5 appearance-none cursor-pointer ${
                      darkMode
                        ? 'bg-secondary1 border-primary/30 text-white'
                        : 'bg-white border-blue-200 text-gray-800'
                    }`}
                  >
                    {menusByBusiness.map(menu => (
                      <option key={menu._id} value={menu._id}>
                        {menu.titre}
                      </option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/dashboard/menu-settings`)}
                className={`text-xs px-2 py-1 rounded-md transition-colors duration-200 flex items-center whitespace-nowrap ${
                  darkMode
                    ? 'text-primary hover:text-white hover:bg-primary'
                    : 'text-primary hover:text-white hover:bg-primary'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                {t('dashboard.menu.settings.edit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {menuLoading || categoriesLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : !hasMenu ? (
        <div className={`rounded-lg p-8 text-center ${
          darkMode ? 'bg-secondary1' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{t('dashboard.menu.settings.noMenuTitle')}</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{t('dashboard.menu.settings.noMenu')}</p>
          <button
            onClick={handleCreateMenu}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg
              transform hover:scale-105 transition-all duration-200 font-medium"
          >
            {t('dashboard.menu.settings.createMenu')}
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className={`rounded-lg p-8 text-center ${
          darkMode ? 'bg-secondary1' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{t('dashboard.products.products.noCategoriesTitle')}</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{t('dashboard.products.products.noCategories')}</p>
          <button
            onClick={() => navigate('/dashboard/products/categories')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg
              transform hover:scale-105 transition-all duration-200 font-medium"
          >
            {t('dashboard.products.products.createCategory')}
          </button>
        </div>
      ) : (
        <>
          <div className={`mb-4 p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 ${darkMode ? 'bg-secondary1' : 'bg-white border border-gray-200'}`}>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  placeholder={t('dashboard.products.products.searchPlaceholder') || "Search product..."}
                  className={`border rounded-lg px-3 py-2 w-full focus:ring-primary focus:border-primary transition-colors duration-200 ${darkMode ? 'bg-secondary1 border-primary/30 text-white' : 'bg-white border-blue-200 text-gray-800'}`}
                  autoComplete="off"
                  onKeyDown={e => {
                    if (!showSuggestions || suggestions.length === 0) return;
                    if (e.key === "ArrowDown") {
                      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      setHighlightedIndex(i => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && highlightedIndex >= 0) {
                      setSearchQuery(suggestions[highlightedIndex].nom);
                      setShowSuggestions(false);
                    }
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className={`absolute z-10 top-full left-0 right-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-auto ${darkMode ? 'bg-secondary1 text-white border-primary/30' : ''}`}>
                    {suggestions.map((prod, idx) => (
                      <li
                        key={prod._id}
                        className={`px-3 py-2 cursor-pointer hover:bg-primary/10 ${highlightedIndex === idx ? 'bg-primary/20' : ''}`}
                        onMouseDown={() => {
                          setSearchQuery(prod.nom);
                          setShowSuggestions(false);
                        }}
                      >
                        {prod.nom}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                onClick={() => handleBulkDelete(selectedProductIds)}
                disabled={!selectedProductIds.length}
              >
                <FaTrash />
                {t('dashboard.products.products.bulkDeleteButton')}
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                onClick={handleExportSelected}
                disabled={!selectedProductIds.length}
              >
                <FaFileExcel />
                {t('common.export') || 'Export'}
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                onClick={handleRefresh}
              >
                <FaSyncAlt />
                {t('common.refresh') || 'Refresh'}
              </button>
            </div>
          </div>
          <ProductsList
            menuId={selectedMenuId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
            onToggleIsBest={handleToggleIsBest}
            products={filteredProducts}
            onBulkDelete={handleBulkDelete}
            selectedProductIds={selectedProductIds}
            setSelectedProductIds={setSelectedProductIds}
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct
          ? t('dashboard.products.products.edit')
          : t('dashboard.products.products.add')}
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
          isUpdate={!!selectedProduct}
          categoryId={selectedCategoryId}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

export default Products;
