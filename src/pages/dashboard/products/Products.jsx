import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductForm from '../../../components/dashboard/forms/ProductForm';
import ProductsList from '../../../components/dashboard/tables/ProductsList';
import Modal from '../../../components/ui/Modal';

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (formData) => {
    if (selectedProduct) {
      setProducts(products.map(prod =>
        prod.id === selectedProduct.id ? { ...prod, ...formData } : prod
      ));
    } else {
      setProducts([...products, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(prod => prod.id !== productId));
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('dashboard.products.products.title')}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
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

      <ProductsList
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
        />
      </Modal>
    </div>
  );
};

export default Products;
