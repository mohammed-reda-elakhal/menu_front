import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white rounded-lg p-6 max-w-lg w-full"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={`https://picsum.photos/seed/${product._id}/800/600`}
            alt={product.nom}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-bold mb-2">{product.nom}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">${product.prix}</span>
            {product.promo_prix && (
              <span className="text-red-500 line-through">${product.promo_prix}</span>
            )}
          </div>
          {product.composant && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <div className="flex flex-wrap gap-2">
                {product.composant.map((item: string, index: number) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CoffeeTemplate1: React.FC<{ menuData: any }> = ({ menuData }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <img
              src={menuData.business.logo.url || 'https://picsum.photos/seed/logo/150/150'}
              alt={menuData.business.nom}
              className="h-16 w-auto"
            />
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">{menuData.business.nom}</h1>
              <p className="text-gray-600">{menuData.business.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Categories */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {menuData.categories.map((category: any) => (
          <section key={category._id} className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
              {category.nom}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.produits.map((product: any) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image.url || `https://picsum.photos/seed/${product._id}/400/300`}
                    alt={product.nom}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{product.nom}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">${product.prix}</span>
                      {product.promo_prix && (
                        <span className="text-red-500 line-through">
                          ${product.promo_prix}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default CoffeeTemplate1;
