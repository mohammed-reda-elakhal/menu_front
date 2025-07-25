import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../../../context/ThemeContext';
import SupplementForm from '../../../components/dashboard/forms/SupplementForm';
import SupplementsList from '../../../components/dashboard/tables/SupplementsList';
import Modal from '../../../components/ui/Modal';
import { getMenusByBusiness } from '../../../redux/apiCalls/menuApiCalls';
import { getCategoriesByMenu } from '../../../redux/apiCalls/categorieApiCalls';
import {
  createSupplementaire,
  updateSupplementaire,
  deleteSupplementaire,
  toggleSupplementaireVisible,
  getSupplementairesByMenu
} from '../../../redux/apiCalls/supplementaireApiCalls';

const Supplements = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Redux state
  const { selectedBusiness } = useSelector(state => state.business);
  const { menusByBusiness, loading: menuLoading } = useSelector(state => state.menu);
  const { categoriesByMenu } = useSelector(state => state.categorie);
  const { supplementairesByMenu, loading: supplementsLoading } = useSelector(state => state.supplementaire);

  // Local state
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hasMenu, setHasMenu] = useState(true);

  // Fetch menus when component mounts
  useEffect(() => {
    if (selectedBusiness?._id) {
      dispatch(getMenusByBusiness(selectedBusiness._id));
    }
  }, [dispatch, selectedBusiness]);

  // Set initial menu
  useEffect(() => {
    if (menusByBusiness?.length > 0) {
      setHasMenu(true);
      const firstMenu = menusByBusiness[0];
      setSelectedMenuId(firstMenu._id);
      setSelectedMenu(firstMenu);
    } else {
      setHasMenu(false);
      setSelectedMenuId(null);
      setSelectedMenu(null);
    }
  }, [menusByBusiness]);

  // Fetch categories and supplements when menu changes
  useEffect(() => {
    if (selectedMenuId) {
      dispatch(getCategoriesByMenu(selectedMenuId));
      dispatch(getSupplementairesByMenu(selectedMenuId));
    }
  }, [dispatch, selectedMenuId]);

  const handleSubmit = async (formData) => {
    try {
      // Add menu ID to the form data
      formData.append('menu', selectedMenuId);

      let result;
      if (selectedSupplement) {
        result = await dispatch(updateSupplementaire(selectedSupplement._id, formData));
      } else {
        result = await dispatch(createSupplementaire(formData));
      }

      if (result.success) {
        toast.success(selectedSupplement
          ? t('dashboard.products.supplements.updateSuccess')
          : t('dashboard.products.supplements.createSuccess')
        );
        setIsModalOpen(false);
        setSelectedSupplement(null);
        dispatch(getSupplementairesByMenu(selectedMenuId));
      } else {
        toast.error(result.error || t('dashboard.common.error'));
      }
    } catch (error) {
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleEdit = (supplement) => {
    setSelectedSupplement(supplement);
    setIsModalOpen(true);
  };

  const handleDelete = async (supplementId) => {
    try {
      const result = await dispatch(deleteSupplementaire(supplementId));
      if (result.success) {
        toast.success(t('dashboard.products.supplements.deleteSuccess'));
        dispatch(getSupplementairesByMenu(selectedMenuId));
      } else {
        toast.error(result.error || t('dashboard.products.supplements.deleteError'));
      }
    } catch (error) {
      toast.error(t('dashboard.common.error'));
    }
  };

  const handleToggleVisibility = async (supplementId) => {
    try {
      const result = await dispatch(toggleSupplementaireVisible(supplementId));
      if (result.success) {
        toast.success(t('dashboard.products.supplements.visibilityToggleSuccess'));
        dispatch(getSupplementairesByMenu(selectedMenuId));
      } else {
        toast.error(result.error || t('dashboard.products.supplements.visibilityToggleError'));
      }
    } catch (error) {
      toast.error(t('dashboard.common.error'));
    }
  };

  const menuHeader = (
    <div className={`mb-6 rounded-lg p-4 shadow-md backdrop-blur-sm ${
      darkMode
        ? 'bg-gradient-to-r from-[#111827] via-[#0a1a4d]/80 to-[#111827] border border-primary/20'
        : 'bg-gradient-to-r from-blue-50 via-blue-100/80 to-blue-50 border border-blue-200'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedMenu?.titre}
          </h2>
          <div className="flex flex-wrap items-center mt-1 gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              darkMode
                ? 'bg-primary/20 text-primary'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {t('dashboard.menu.settings.menuCode')}: {selectedMenu?.code_menu}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
                className={`border text-sm rounded-lg focus:ring-primary focus:border-primary hover:border-primary transition-colors duration-200 block w-full p-2.5 ${
                  darkMode
                    ? 'bg-gray-800 border-primary/30 text-white'
                    : 'bg-white border-blue-300 text-gray-800'
                }`}
              >
                {menusByBusiness.map(menu => (
                  <option key={menu._id} value={menu._id} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                    {menu.titre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`p-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className={`text-2xl font-bold ${
          darkMode
            ? 'text-white'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
        }`}>
          {t('dashboard.products.supplements.title')}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full sm:w-auto text-white px-6 py-2.5 rounded-lg
            transform hover:scale-105 transition-all duration-200
            shadow-lg font-medium text-sm flex items-center justify-center gap-2 ${
              darkMode
                ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/25'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('dashboard.products.supplements.add')}
        </button>
      </div>

      {menuLoading || supplementsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary ${
            darkMode ? 'opacity-80' : 'opacity-100'
          }`}></div>
        </div>
      ) : !hasMenu ? (
        <div className={`rounded-lg p-8 text-center ${
          darkMode
            ? 'bg-gray-800/90 border border-gray-700'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{t('dashboard.menu.settings.noMenuTitle')}</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{t('dashboard.menu.settings.noMenu')}</p>
          <button
            onClick={() => navigate('/dashboard/menu-settings')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
          >
            {t('dashboard.menu.settings.createMenu')}
          </button>
        </div>
      ) : categoriesByMenu.length === 0 ? (
        <div className={`rounded-lg p-8 text-center ${
          darkMode
            ? 'bg-gray-800/90 border border-gray-700'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>{t('dashboard.products.supplements.noCategoriesTitle')}</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{t('dashboard.products.supplements.noCategories')}</p>
          <button
            onClick={() => navigate('/dashboard/products/categories')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
          >
            {t('dashboard.products.supplements.createCategory')}
          </button>
        </div>
      ) : (
        <>
          {menuHeader}
          <SupplementsList
            supplements={supplementairesByMenu || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplement(null);
        }}
        title={selectedSupplement
          ? t('dashboard.products.supplements.edit')
          : t('dashboard.products.supplements.add')}
      >
        <SupplementForm
          supplement={selectedSupplement}
          onSubmit={handleSubmit}
          isUpdate={!!selectedSupplement}
          categories={categoriesByMenu}
        />
      </Modal>
    </div>
  );
};

export default Supplements;
