import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CategoryForm from '../../../components/dashboard/forms/CategoryForm';
import CategoriesList from '../../../components/dashboard/tables/CategoriesList';
import Modal from '../../../components/ui/Modal';
import { useTheme } from '../../../context/ThemeContext';
import { getMenusByBusiness } from '../../../redux/apiCalls/menuApiCalls';
import {
  getCategoriesByMenu,
  createCategorie,
  updateCategorie,
  deleteCategorie
} from '../../../redux/apiCalls/categorieApiCalls';

const Categories = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Get selected business from Redux
  const { selectedBusiness } = useSelector(state => state.business);
  const { menusByBusiness, loading: menuLoading } = useSelector(state => state.menu);
  const { categoriesByMenu, loading: categoriesLoading } = useSelector(state => state.categorie);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMenu, setHasMenu] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Fetch menus for the selected business
  useEffect(() => {
    if (selectedBusiness && selectedBusiness._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id));
    }
  }, [dispatch, selectedBusiness]);

  // State for selected menu details
  const [selectedMenu, setSelectedMenu] = useState(null);

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

  // Fetch categories for the selected menu
  useEffect(() => {
    if (selectedMenuId) {
      dispatch(getCategoriesByMenu(selectedMenuId));
    }
  }, [dispatch, selectedMenuId]);

  // Update local categories state when categoriesByMenu changes
  useEffect(() => {
    if (categoriesByMenu && categoriesByMenu.length > 0) {
      setCategories(categoriesByMenu);
    } else {
      setCategories([]);
    }
  }, [categoriesByMenu]);

  // Filter categories by search query
  const filteredCategories = categories.filter(cat =>
    cat.nom && cat.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Autocomplete suggestions (limit to 5)
  const suggestions = categories
    .filter(cat =>
      searchQuery &&
      cat.nom &&
      cat.nom.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const handleSubmit = async (formData) => {
    try {
      // Préparer les données pour l'API
      const categoryData = {
        nom: formData.name,
        description: formData.description,
        menu: selectedMenuId,
        image: formData.image
      };

      let result;
      if (selectedCategory) {
        // Mise à jour d'une catégorie existante
        result = await dispatch(updateCategorie(selectedCategory._id, categoryData));
        if (result.success) {
          toast.success(t('dashboard.products.categories.updateSuccess'));
        } else {
          toast.error(result.error || t('dashboard.products.categories.updateError'));
        }
      } else {
        // Création d'une nouvelle catégorie
        result = await dispatch(createCategorie(categoryData));
        if (result.success) {
          toast.success(t('dashboard.products.categories.createSuccess'));
        } else {
          toast.error(result.error || t('dashboard.products.categories.createError'));
        }
      }

      // Fermer le modal et réinitialiser la catégorie sélectionnée
      setIsModalOpen(false);
      setSelectedCategory(null);

      // Rafraîchir la liste des catégories
      if (selectedMenuId) {
        dispatch(getCategoriesByMenu(selectedMenuId));
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      const result = await dispatch(deleteCategorie(categoryId));
      if (result.success) {
        toast.success(t('dashboard.products.categories.deleteSuccess'));
        // Rafraîchir la liste des catégories
        if (selectedMenuId) {
          dispatch(getCategoriesByMenu(selectedMenuId));
        }
      } else {
        toast.error(result.error || t('dashboard.products.categories.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleCreateMenu = () => {
    navigate('/dashboard/menu-settings');
  };

  return (
    <div className={`p-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className={`text-2xl font-bold ${
          darkMode
            ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            : 'text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'
        }`}>
          {t('dashboard.products.categories.title')}
        </h1>
        {hasMenu ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg
              hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
              shadow-lg hover:shadow-blue-500/25 font-medium text-sm flex items-center justify-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('dashboard.products.categories.add')}
          </button>
        ) : null}
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
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedMenu.titre}</h2>
              <div className="flex flex-wrap items-center mt-1 gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>{t('dashboard.menu.settings.menuCode')}: {selectedMenu.code_menu}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{selectedMenu.publier ? t('dashboard.menu.settings.published') : t('dashboard.menu.settings.unpublished')}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{categories.length} {categories.length === 1 ? t('dashboard.products.categories.category') : t('dashboard.products.categories.categories')}</span>
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
                    className={`border text-sm rounded-lg focus:ring-primary focus:border-primary hover:border-primary transition-colors duration-200 block w-full p-2.5 appearance-none cursor-pointer ${darkMode ? 'bg-secondary1 border-primary/30 text-white' : 'bg-white border-blue-200 text-gray-800'}`}
                  >
                    {menusByBusiness.map(menu => (
                      <option key={menu._id} value={menu._id}>{menu.titre}</option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              )}
              <button
                onClick={() => navigate(`/dashboard/menu-settings`)}
                className={`text-xs px-2 py-1 rounded-md transition-colors duration-200 flex items-center whitespace-nowrap ${darkMode ? 'text-primary hover:text-white hover:bg-primary' : 'text-primary hover:text-white hover:bg-primary'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                {t('dashboard.menu.settings.edit')}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Search Input - now between card and table */}
      {hasMenu && (
        <div className="mb-4 flex justify-end">
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
              placeholder={t('dashboard.products.categories.searchPlaceholder') || "Search category..."}
              className={`border rounded-lg px-3 py-2 w-full focus:ring-primary focus:border-primary transition-colors duration-200 ${
                darkMode ? 'bg-secondary1 border-primary/30 text-white' : 'bg-white border-blue-200 text-gray-800'
              }`}
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
                {suggestions.map((cat, idx) => (
                  <li
                    key={cat._id}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary/10 ${highlightedIndex === idx ? 'bg-primary/20' : ''}`}
                    onMouseDown={() => {
                      setSearchQuery(cat.nom);
                      setShowSuggestions(false);
                    }}
                  >
                    {cat.nom}
                  </li>
                ))}
              </ul>
            )}
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
      ) : (
        <CategoriesList
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory
          ? t('dashboard.products.categories.edit')
          : t('dashboard.products.categories.add')}
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleSubmit}
          isUpdate={!!selectedCategory}
        />
      </Modal>
    </div>
  );
};

export default Categories;
