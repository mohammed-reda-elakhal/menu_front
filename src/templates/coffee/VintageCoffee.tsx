import React from 'react';
import { motion } from 'framer-motion';

const VintageCoffee: React.FC<{ menuData: any }> = ({ menuData }) => {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Vintage Header */}
      <header className="bg-[#2C1810] text-amber-100 py-12 text-center">
        <h1 className="font-serif text-4xl mb-2" style={{ fontFamily: 'Playfair Display' }}>
          {menuData.business.nom}
        </h1>
        <p className="italic" style={{ fontFamily: 'Lora' }}>{menuData.business.description}</p>
        <div className="mx-auto w-32 h-1 bg-amber-200 mt-4"></div>
      </header>

      {/* Vintage Menu */}
      <main className="max-w-6xl mx-auto p-8">
        {menuData.categories.map((category: any) => (
          <section key={category._id} className="mb-16">
            <h2 className="font-serif text-3xl text-[#2C1810] text-center mb-8 relative">
              <span className="bg-amber-50 px-4 relative z-10">{category.nom}</span>
              <div className="absolute w-full h-px bg-[#2C1810] top-1/2 left-0 -z-0"></div>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {category.produits.map((product: any) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-amber-100 p-6 rounded-lg shadow-md border border-amber-200"
                >
                  <div className="flex gap-4">
                    <img
                      src={`https://picsum.photos/seed/${product._id}/150/150`}
                      alt={product.nom}
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#2C1810]"
                    />
                    <div>
                      <h3 className="font-serif text-xl text-[#2C1810] mb-1">{product.nom}</h3>
                      <p className="text-amber-900 text-sm italic mb-2">{product.description}</p>
                      <p className="text-xl font-bold text-[#2C1810]">${product.prix}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default VintageCoffee;
