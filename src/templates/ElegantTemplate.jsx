import React, { useState } from 'react';
// If you have assets in ./assets/elegant, import them as needed, e.g.:
import elegantBg from './assets/elegant/elegant_bg.jpg';

/**
 * ElegantTemplate.jsx
 * Description: A luxurious, high-contrast template with a black background, gold accents, and serif fonts.
 * Perfect for fine dining or premium restaurants.
 */

const ElegantTemplate = ({ menuData }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };
  const closeCategoryModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };
  const closeProductModal = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  if (!menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gold font-serif">
        <div className="text-center">
          <h2 className="text-2xl text-gold">No Menu Available</h2>
          <p className="text-gold/70 mt-1">Please check your configuration.</p>
        </div>
      </div>
    );
  }

  // Gold color (can be replaced with Tailwind custom color if added)
  const gold = '#FFD700';
  const goldSoft = '#E6C200';
  const black = '#111111';

  return (
    <div
      className="min-h-screen w-full font-merriweather relative flex flex-col items-center justify-center"
      style={{
        color: gold,
        fontFamily: 'Merriweather, serif',
        backgroundImage: `url(${elegantBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#111',
      }}
    >
      {/* Overlay for readability */}
      <div className="fixed inset-0 z-10" style={{ background: 'rgba(17, 17, 17, 0.85)' }} />
      {/* Main content */}
      <div className="relative z-20 w-full max-w-3xl px-4 flex flex-col items-center justify-center min-h-screen pt-12 pb-12">
        {/* Header */}
        <div className="flex flex-col items-center w-full">
          {/* Gold Crown Icon */}
          <span className="mb-2 block">
            <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto" style={{ filter: 'drop-shadow(0 2px 8px #FFD70088)' }}>
              <path d="M6 24L2 8L16 20L24 4L32 20L46 8L42 24H6Z" fill="#FFD700" stroke="#E6C200" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </span>
          {menuData.business?.logo?.url && (
            <div className="mx-auto mb-6 w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg"
                 style={{ borderColor: gold, boxShadow: `0 0 40px ${goldSoft}55` }}>
              <img
                src={menuData.business.logo.url}
                alt={menuData.business.nom}
                className="w-full h-full object-cover"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest text-center mb-2" style={{ color: gold, fontFamily: 'Playfair Display, Merriweather, serif', letterSpacing: '0.1em' }}>
            {menuData.business?.nom}
          </h1>
          {menuData.business?.description && (
            <p className="mb-8 text-base text-center" style={{ color: 'white', fontStyle: 'italic' }}>
              {menuData.business.bio}
            </p>
          )}
        </div>

        {/* Main Content */}
        <main className="w-full mt-4 mb-12">
          <div className="space-y-16">
            {menuData.categories?.map((category) => (
              <section key={category._id}>
                {/* Category title with lines */}
                <div className="flex items-center justify-center mb-8">
                  {/* Gold Star Icon Left */}
                  <span className="inline-block w-12 h-0.5 rounded-full mr-2" style={{ background: gold }} />
                  <span className="mr-2">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
                      <path d="M10 2L12.4721 7.23607L18.0902 7.90983L13.5451 11.7639L14.9443 17.0902L10 14L5.05573 17.0902L6.45492 11.7639L1.90983 7.90983L7.52786 7.23607L10 2Z" fill="#FFD700" stroke="#E6C200" strokeWidth="1"/>
                    </svg>
                  </span>
                  <h2
                    className="px-2 text-2xl md:text-3xl font-bold uppercase tracking-[0.25em] text-center cursor-pointer hover:opacity-80 transition"
                    style={{
                      color: gold,
                      fontFamily: 'Playfair Display, Merriweather, serif',
                      letterSpacing: '0.25em',
                    }}
                    onClick={() => openCategoryModal(category)}
                  >
                    {category.nom}
                  </h2>
                  <span className="ml-2">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
                      <path d="M10 2L12.4721 7.23607L18.0902 7.90983L13.5451 11.7639L14.9443 17.0902L10 14L5.05573 17.0902L6.45492 11.7639L1.90983 7.90983L7.52786 7.23607L10 2Z" fill="#FFD700" stroke="#E6C200" strokeWidth="1"/>
                    </svg>
                  </span>
                  <span className="inline-block w-12 h-0.5 rounded-full ml-2" style={{ background: gold }} />
                </div>
                {/* Products */}
                <div className="space-y-8">
                  {category.produits?.map((product) => (
                    <div key={product._id} className="w-full mb-8 cursor-pointer group" onClick={() => openProductModal(product)}>
                      <div className="flex items-center justify-between w-full">
                        <h3
                          className="text-lg md:text-xl font-bold"
                          style={{
                            color: '#fff',
                            fontFamily: 'Playfair Display, Merriweather, serif',
                          }}
                        >
                          {product.nom}
                        </h3>
                        <span
                          className="text-lg md:text-xl font-bold"
                          style={{
                            color: gold,
                            fontFamily: 'Playfair Display, Merriweather, serif',
                            fontSize: '1.25rem',
                          }}
                        >
                          {product.promo_prix ? product.promo_prix : product.prix} DH
                        </span>
                      </div>
                      {product.description && (
                        <p
                          className="text-sm md:text-base mt-1 ml-1 italic"
                          style={{ color: '#fff', fontFamily: 'Merriweather, serif', fontWeight: 300 }}
                        >
                          {product.description}
                        </p>
                      )}
                      {product.composant?.length > 0 && (
                        <p className="text-xs mt-1 ml-1" style={{ color: '#fff', fontFamily: 'Merriweather, serif', fontWeight: 300 }}>
                          {product.composant.join(' • ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center border-t w-full mt-12" style={{ borderColor: goldSoft, color: goldSoft, background: 'transparent' }}>
          <div className="mb-2">
            <span className="font-bold text-lg" style={{ color: gold }}>{menuData.business?.nom}</span>
          </div>
          <div className="mb-2">
            <span>{menuData.business?.adress}</span>
          </div>
          <div className="mb-2">
            <span>{menuData.business?.tele}</span>
          </div>
          <div className="mt-4 text-xs" style={{ color: goldSoft }}>
            &copy; {new Date().getFullYear()} {menuData.business?.nom || 'Business'}. All rights reserved.
          </div>
        </footer>
      </div>

      {/* Modal for category details */}
      {modalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181818] rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-yellow-600">
            <button
              className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-yellow-200 focus:outline-none"
              onClick={closeCategoryModal}
              aria-label="Close"
            >
              &times;
            </button>
            {selectedCategory.image?.url && (
              <img
                src={selectedCategory.image.url}
                alt={selectedCategory.nom}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-yellow-600"
              />
            )}
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: gold, fontFamily: 'Playfair Display, Merriweather, serif' }}>{selectedCategory.nom}</h2>
            {selectedCategory.description && (
              <p className="text-center mb-4 text-white/80 italic">{selectedCategory.description}</p>
            )}
            <div className="space-y-4 max-h-72 overflow-y-auto mt-4">
              {selectedCategory.produits?.map((product) => (
                <div key={product._id} className="flex items-center gap-4 bg-[#222] rounded-lg p-3 cursor-pointer" onClick={() => openProductModal(product)}>
                  {product.image?.url && (
                    <img src={product.image.url} alt={product.nom} className="w-14 h-14 object-cover rounded-md border border-yellow-700" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white" style={{ fontFamily: 'Playfair Display, Merriweather, serif' }}>{product.nom}</span>
                      <span className="font-bold text-yellow-400">{product.promo_prix ? product.promo_prix : product.prix} DH</span>
                    </div>
                    {product.description && <p className="text-xs text-white/70 italic mt-1">{product.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {productModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-[#181818] rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-yellow-600">
            <button
              className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-yellow-200 focus:outline-none"
              onClick={closeProductModal}
              aria-label="Close"
            >
              &times;
            </button>
            {selectedProduct.image?.url && (
              <img
                src={selectedProduct.image.url}
                alt={selectedProduct.nom}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-yellow-600"
              />
            )}
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: gold, fontFamily: 'Playfair Display, Merriweather, serif' }}>{selectedProduct.nom}</h2>
            <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
              {selectedProduct.isBest && <span className="px-2 py-1 bg-yellow-700 text-white rounded-full text-xs">Best Seller</span>}
              {selectedProduct.isHalal && <span className="px-2 py-1 bg-green-700 text-white rounded-full text-xs">Halal</span>}
              {selectedProduct.isSpicy && <span className="px-2 py-1 bg-red-700 text-white rounded-full text-xs">Spicy</span>}
              {selectedProduct.isVegetarian && <span className="px-2 py-1 bg-green-900 text-white rounded-full text-xs">Vegetarian</span>}
              {!selectedProduct.visible && <span className="px-2 py-1 bg-gray-700 text-white rounded-full text-xs">Hidden</span>}
            </div>
            <div className="flex justify-center items-center gap-4 mb-2">
              <span className="font-bold text-yellow-400 text-lg">{selectedProduct.promo_prix ? selectedProduct.promo_prix : selectedProduct.prix} DH</span>
              {selectedProduct.promo_prix && (
                <span className="line-through text-white/60 text-base">{selectedProduct.prix} DH</span>
              )}
            </div>
            {selectedProduct.description && (
              <p className="text-center mb-2 text-white/80 italic">{selectedProduct.description}</p>
            )}
            {/* Composant */}
            {selectedProduct.composant && selectedProduct.composant.length > 0 && (
              <div className="mb-2">
                <span className="block text-xs text-yellow-300 text-center mb-1">Composants:</span>
                <ul className="flex flex-wrap justify-center gap-2">
                  {selectedProduct.composant.map((c, idx) => (
                    <li key={idx} className="px-2 py-1 bg-yellow-900 text-yellow-200 rounded-full text-xs">{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Ratings */}
            {selectedProduct.ratings && (
              <div className="flex justify-center gap-4 mt-2">
                <span className="text-green-400">👍 {selectedProduct.ratings.positive || 0}</span>
                {selectedProduct.ratings.negative > 0 && <span className="text-red-400">👎 {selectedProduct.ratings.negative}</span>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElegantTemplate; 