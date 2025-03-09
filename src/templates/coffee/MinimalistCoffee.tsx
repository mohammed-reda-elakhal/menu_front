import React from 'react';
import { motion } from 'framer-motion';

const MinimalistCoffee: React.FC<{ menuData: any }> = ({ menuData }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl font-light mb-4" style={{ fontFamily: 'Helvetica Neue' }}>
            {menuData.business.nom}
          </h1>
          <p className="text-gray-500">{menuData.business.description}</p>
        </div>
      </header>

      {/* Minimal Menu */}
      <main className="max-w-4xl mx-auto py-16 px-4">
        {menuData.categories.map((category: any) => (
          <section key={category._id} className="mb-20">
            <h2 className="text-2xl font-light mb-12 text-center">
              {category.nom}
            </h2>
            <div className="space-y-8">
              {category.produits.map((product: any) => (
                <motion.div
                  key={product._id}
                  whileHover={{ x: 10 }}
                  className="flex justify-between items-center border-b border-gray-100 pb-6"
                >
                  <div>
                    <h3 className="text-lg mb-1">{product.nom}</h3>
                    <p className="text-gray-500 text-sm">{product.description}</p>
                  </div>
                  <span className="text-lg">${product.prix}</span>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default MinimalistCoffee;
