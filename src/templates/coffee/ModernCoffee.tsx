import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import TemplatePreviewHeader from '../../components/TemplatePreviewHeader';

const ModernCoffee: React.FC<{ menuData: any }> = ({ menuData }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Add smooth scrolling effect
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplatePreviewHeader templateName="Modern Coffee Menu" />
      {/* Modern Header */}
      <header className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Montserrat' }}>
            {menuData.business.nom}
          </h1>
          <p className="text-gray-400 text-xl">{menuData.business.description}</p>
        </div>
      </header>

      {/* Modern Menu */}
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid gap-12">
          {menuData.categories.map((category: any) => (
            <section key={category._id}>
              <h2 className="text-4xl font-bold mb-8 text-gray-800">
                {category.nom}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.produits.map((product: any) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={`https://picsum.photos/seed/${product._id}/400/300`}
                      alt={product.nom}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{product.nom}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-black">${product.prix}</span>
                        <button className="bg-black text-white px-4 py-2 rounded-lg">
                          Order Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ModernCoffee;
