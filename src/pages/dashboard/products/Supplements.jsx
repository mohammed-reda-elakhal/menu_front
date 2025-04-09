import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SupplementForm from '../../../components/dashboard/forms/SupplementForm';
import SupplementsList from '../../../components/dashboard/tables/SupplementsList';
import Modal from '../../../components/ui/Modal';

const Supplements = () => {
  const { t } = useTranslation();
  const [supplements, setSupplements] = useState([]);
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (formData) => {
    if (selectedSupplement) {
      setSupplements(supplements.map(supp =>
        supp.id === selectedSupplement.id ? { ...supp, ...formData } : supp
      ));
    } else {
      setSupplements([...supplements, { id: Date.now(), ...formData }]);
    }
    setIsModalOpen(false);
    setSelectedSupplement(null);
  };

  const handleEdit = (supplement) => {
    setSelectedSupplement(supplement);
    setIsModalOpen(true);
  };

  const handleDelete = (supplementId) => {
    setSupplements(supplements.filter(supp => supp.id !== supplementId));
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('dashboard.products.supplements.title')}
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
          {t('dashboard.products.supplements.add')}
        </button>
      </div>

      <SupplementsList
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
        />
      </Modal>
    </div>
  );
};

export default Supplements;
