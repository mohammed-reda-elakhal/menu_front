import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiPhone, FiTag, FiCoffee, FiFilter, FiX } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';

// Helper for wood grain background
const woodBg = {
  backgroundImage: `linear-gradient(rgba(255,255,255,0.07), rgba(231,211,179,0.93)), url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
  backgroundColor: '#E7D3B3',
  backgroundRepeat: 'repeat',
  backgroundSize: 'auto',
};
const woodPanelBg = {
  backgroundImage: `linear-gradient(rgba(194,122,0,0.07), rgba(139,106,69,0.13)), url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
  backgroundColor: '#E7D3B3',
  backgroundRepeat: 'repeat',
  backgroundSize: 'auto',
  border: '2px solid #C27A00',
  boxShadow: '0 4px 24px 0 rgba(139,106,69,0.10)',
};

const RusticWood = ({ menuData }) => {
  const { business, categories } = menuData;
  const { darkMode } = useTheme();
  const [selectedCat, setSelectedCat] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Color palette
  const colors = {
    bg: darkMode ? 'wood-dark' : 'wood-bg',
    card: darkMode ? 'wood-surface' : 'wood-surface',
    border: darkMode ? 'wood-accent' : 'wood-dark',
    text: darkMode ? 'text-ivory' : 'wood-text',
    accent: 'wood-accent',
    shadow: 'shadow-[0_2px_8px_rgba(139,106,69,0.08)]',
    tag: 'bg-wood-dark text-ivory',
    button: 'bg-wood-dark text-ivory hover:bg-wood-accent',
    buttonText: 'text-ivory',
    surface: 'wood-surface',
    selected: 'bg-wood-accent/80 text-ivory',
    unselected: 'bg-wood-bg text-wood-dark',
  };

  // Typography
  const headingClass = 'font-merriweather text-2xl md:text-3xl font-bold tracking-tight';
  const subheadingClass = 'font-merriweather text-lg md:text-xl font-semibold';
  const bodyClass = 'font-sans text-base';

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
    transition: { duration: 0.7, ease: 'easeOut' },
  };

  // Card style
  const cardClass = `rounded-lg border border-wood-dark/30 bg-wood-surface backdrop-blur-xs ${colors.shadow}`;

  // Tag style
  const tagClass = `inline-block px-3 py-1 rounded-md text-xs font-semibold ${colors.tag} border border-wood-accent/40 mr-2 mb-2`;

  // Button style
  const buttonClass = `px-5 py-2 rounded-full font-bold transition ${colors.button} ${colors.buttonText} shadow-sm`;

  // Divider
  const Divider = () => (
    <div className="w-full flex items-center my-8">
      <div className="flex-1 h-px bg-wood-accent/60" />
      <BsStars className="mx-3 text-wood-accent text-lg" />
      <div className="flex-1 h-px bg-wood-accent/60" />
    </div>
  );

  // Filtered categories/products
  const filteredCategories = useMemo(() => {
    if (!selectedCat || selectedCat === 'all') return categories;
    return categories.filter(cat => cat._id === selectedCat);
  }, [categories, selectedCat]);

  // Product Card
  const ProductCard = ({ product }) => (
    <motion.div {...fadeInUp} className={`mb-4 sm:mb-6 ${cardClass} p-2 sm:p-4 flex flex-col items-center rounded-md sm:rounded-lg`}
      style={{ boxShadow: '0 2px 8px rgba(139,106,69,0.08)' }}>
      {product.image?.url && (
        <div className="mb-2 sm:mb-3 w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-wood-dark/40 bg-wood-bg flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 16px #8B6A4520' }}>
          <img src={product.image.url} alt={product.nom} className="w-full h-full object-cover" style={{ aspectRatio: '1/1' }} loading="lazy" />
        </div>
      )}
      <h3 className={`mb-1 ${subheadingClass} text-wood-dark text-center text-base sm:text-lg`}>{product.nom}</h3>
      <p className={`mb-2 text-wood-text text-xs sm:text-sm text-center ${bodyClass}`}>{product.description}</p>
      <div className="flex flex-wrap justify-center mb-2">
        {product.composant?.slice(0, 3).map((comp, idx) => (
          <span key={idx} className={tagClass}>{comp}</span>
        ))}
        {product.composant?.length > 3 && (
          <span className={tagClass}>+{product.composant.length - 3} more</span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1 sm:mt-2">
        <span className="font-bold text-base sm:text-lg text-wood-accent">{product.promo_prix || product.prix} DH</span>
        {product.promo_prix && <span className="text-xs sm:text-sm line-through text-wood-dark/60">{product.prix} DH</span>}
      </div>
    </motion.div>
  );

  // Supplementary Card
  const SupplementaryCard = ({ supplementary }) => (
    <motion.div {...fadeInUp} className={`mb-3 sm:mb-4 ${cardClass} p-2 sm:p-3 flex items-center gap-2 sm:gap-3 rounded-md sm:rounded-lg`}>
      {supplementary.image?.url && (
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-wood-dark/30 bg-wood-bg flex items-center justify-center shadow" style={{ boxShadow: '0 2px 8px #8B6A4520' }}>
          <img src={supplementary.image.url} alt={supplementary.nom} className="w-full h-full object-cover" style={{ aspectRatio: '1/1' }} loading="lazy" />
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-semibold text-wood-dark text-xs sm:text-sm mb-0.5 sm:mb-1">{supplementary.nom}</h4>
        <p className="text-xs text-wood-text mb-0.5 sm:mb-1 line-clamp-2">{supplementary.description}</p>
        <span className="font-bold text-wood-accent text-xs sm:text-sm">{supplementary.prix} DH</span>
      </div>
    </motion.div>
  );

  // Category Header
  const CategoryHeader = ({ category }) => (
    <motion.div {...fadeInUp} className="mb-6 flex items-center gap-4">
      {category.image?.url ? (
        <img src={category.image.url} alt={category.nom} className="w-14 h-14 rounded-full border-2 border-wood-accent/60 object-cover" style={{ aspectRatio: '1/1' }} loading="lazy" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-wood-accent/20 flex items-center justify-center border-2 border-wood-accent/60">
          <FiCoffee className="text-2xl text-wood-accent" />
        </div>
      )}
      <div>
        <h2 className={`${headingClass} text-wood-dark`}>{category.nom}</h2>
        {category.description && <p className="text-wood-text text-xs mt-1">{category.description}</p>}
      </div>
    </motion.div>
  );

  // Sidebar filter (desktop)
  const SidebarFilter = () => (
    <aside className="hidden md:block w-full max-w-xs flex-shrink-0 md:rounded-none" style={woodPanelBg}>
      <div className="rounded-xl md:rounded-none p-4 md:p-6 shadow-lg border-wood-accent/40 border flex flex-col gap-2 relative" style={{ minHeight: 200 }}>
        <h3 className={`${subheadingClass} text-wood-accent mb-4 flex items-center gap-2 text-base md:text-lg`}>
          <FiTag className="text-wood-accent" />
          Filter by Category
        </h3>
        <ul className="flex flex-col gap-2">
          <li key="all">
            <button
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 rounded-lg md:rounded-none border transition font-semibold text-left shadow-sm text-sm md:text-base
                ${selectedCat === null || selectedCat === 'all' ? colors.selected + ' border-wood-accent ring-2 ring-wood-accent/40' : colors.unselected + ' border-wood-dark/20 hover:bg-wood-accent/10'}`}
              style={{
                background: selectedCat === null || selectedCat === 'all'
                  ? 'linear-gradient(90deg, #C27A00 0%, #E7D3B3 100%)'
                  : 'rgba(231,211,179,0.85)',
                boxShadow: selectedCat === null || selectedCat === 'all' ? '0 2px 12px #C27A0030' : '0 1px 4px #8B6A4510',
                fontFamily: 'Merriweather, serif',
                letterSpacing: '0.01em',
              }}
              onClick={() => setSelectedCat(null)}
              aria-current={selectedCat === null || selectedCat === 'all'}
            >
              <BsStars className="text-lg text-wood-accent" />
              <span>All</span>
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat._id}>
              <button
                className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 rounded-lg md:rounded-none border transition font-semibold text-left shadow-sm text-sm md:text-base
                  ${selectedCat === cat._id ? colors.selected + ' border-wood-accent ring-2 ring-wood-accent/40' : colors.unselected + ' border-wood-dark/20 hover:bg-wood-accent/10'}`}
                style={{
                  background: selectedCat === cat._id
                    ? 'linear-gradient(90deg, #C27A00 0%, #E7D3B3 100%)'
                    : 'rgba(231,211,179,0.85)',
                  boxShadow: selectedCat === cat._id ? '0 2px 12px #C27A0030' : '0 1px 4px #8B6A4510',
                  fontFamily: 'Merriweather, serif',
                  letterSpacing: '0.01em',
                }}
                onClick={() => setSelectedCat(cat._id)}
                aria-current={selectedCat === cat._id}
              >
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.nom} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-wood-accent/40 object-cover" />
                ) : (
                  <FiCoffee className="text-lg text-wood-accent" />
                )}
                <span>{cat.nom}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  // Mobile floating filter button
  const MobileFilterButton = () => (
    <button
      className="md:hidden fixed bottom-5 left-5 z-40 bg-wood-accent text-ivory rounded-full shadow-lg p-4 flex items-center justify-center border-2 border-wood-dark/40 hover:bg-wood-dark hover:text-wood-accent transition-all duration-200"
      style={{ boxShadow: '0 4px 24px #8B6A4530' }}
      onClick={() => setFilterModalOpen(true)}
      aria-label="Filter by category"
    >
      <FiFilter className="w-6 h-6" />
    </button>
  );

  // Mobile filter modal
  const MobileFilterModal = () => (
    <AnimatePresence>
      {filterModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
        >
          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[92vw] max-w-xs mx-auto rounded-2xl p-5 pt-4 bg-wood-bg border-2 border-wood-accent shadow-2xl relative flex flex-col"
            style={{ ...woodPanelBg, boxShadow: '0 8px 32px #8B6A4530, 0 2px 0 #C27A00' }}
          >
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-wood-accent/10 hover:bg-wood-accent/30 text-wood-accent"
              onClick={() => setFilterModalOpen(false)}
              aria-label="Close filter"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-merriweather text-wood-accent mb-4 flex items-center gap-2"><FiTag /> Filter by Category</h3>
            <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              <li key="all">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border transition font-semibold text-left shadow-sm text-sm
                    ${selectedCat === null || selectedCat === 'all' ? colors.selected + ' border-wood-accent ring-2 ring-wood-accent/40' : colors.unselected + ' border-wood-dark/20 hover:bg-wood-accent/10'}`}
                  style={{
                    background: selectedCat === null || selectedCat === 'all'
                      ? 'linear-gradient(90deg, #C27A00 0%, #E7D3B3 100%)'
                      : 'rgba(231,211,179,0.85)',
                    boxShadow: selectedCat === null || selectedCat === 'all' ? '0 2px 12px #C27A0030' : '0 1px 4px #8B6A4510',
                    fontFamily: 'Merriweather, serif',
                    letterSpacing: '0.01em',
                  }}
                  onClick={() => {
                    setSelectedCat(null);
                    setFilterModalOpen(false);
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 200);
                  }}
                  aria-current={selectedCat === null || selectedCat === 'all'}
                >
                  <BsStars className="text-lg text-wood-accent" />
                  <span>All</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat._id}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border transition font-semibold text-left shadow-sm text-sm
                      ${selectedCat === cat._id ? colors.selected + ' border-wood-accent ring-2 ring-wood-accent/40' : colors.unselected + ' border-wood-dark/20 hover:bg-wood-accent/10'}`}
                    style={{
                      background: selectedCat === cat._id
                        ? 'linear-gradient(90deg, #C27A00 0%, #E7D3B3 100%)'
                        : 'rgba(231,211,179,0.85)',
                      boxShadow: selectedCat === cat._id ? '0 2px 12px #C27A0030' : '0 1px 4px #8B6A4510',
                      fontFamily: 'Merriweather, serif',
                      letterSpacing: '0.01em',
                    }}
                    onClick={() => {
                      setSelectedCat(cat._id);
                      setFilterModalOpen(false);
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 200);
                    }}
                    aria-current={selectedCat === cat._id}
                  >
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.nom} className="w-8 h-8 rounded-full border border-wood-accent/40 object-cover" />
                    ) : (
                      <FiCoffee className="text-lg text-wood-accent" />
                    )}
                    <span>{cat.nom}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Layout
  return (
    <div className={`min-h-screen w-full ${colors.bg} ${bodyClass}`} style={woodBg}>
      {/* Header */}
      <header className="py-8 sm:py-10 px-2 sm:px-4 text-center">
        <motion.div {...fadeInUp} className="flex flex-col items-center gap-3 sm:gap-4">
          {business?.logo?.url && (
            <img src={business.logo.url} alt={business.nom} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-wood-accent/70 object-cover shadow" style={{ aspectRatio: '1/1' }} loading="lazy" />
          )}
          <h1 className={`${headingClass} text-wood-dark text-xl sm:text-2xl md:text-3xl`}>{business?.nom}</h1>
          <p className="text-wood-text text-base sm:text-lg max-w-xl mx-auto italic">{business?.bio}</p>
        </motion.div>
      </header>
      <Divider />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-1 sm:px-2 md:px-8 flex flex-col md:flex-row gap-4 md:gap-10 pt-4 md:pt-0">
        {/* Sidebar nav (categories) */}
        <SidebarFilter />
        <section className="flex-1">
          {/* Spacer for floating button */}
          <div className="block md:hidden h-4" />
          <MobileFilterButton />
          <MobileFilterModal />
          <AnimatePresence mode="wait">
            {filteredCategories.map(category => (
              <motion.div
                key={category._id}
                {...fadeInUp}
                exit={{ opacity: 0, y: 24 }}
                className="mb-8 sm:mb-12"
              >
                <CategoryHeader category={category} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {category.produits?.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {category.supplementaires?.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className={`${subheadingClass} text-wood-accent mb-2 flex items-center gap-2 text-base sm:text-lg`}><FiTag className="text-wood-accent" /> Add-ons</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {category.supplementaires.map(supp => (
                        <SupplementaryCard key={supp._id} supplementary={supp} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      </main>
      <Divider />
      {/* Footer */}
      <footer className="py-8 sm:py-10 px-2 sm:px-4 text-center">
        <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-4">
            {business?.logo?.url && (
              <img src={business.logo.url} alt={business.nom} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-wood-accent/60 object-cover" style={{ aspectRatio: '1/1' }} loading="lazy" />
            )}
            <h3 className={`${subheadingClass} text-wood-dark text-base sm:text-lg`}>{business?.nom}</h3>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-4">
            {(business.adress || business.ville) && (
              <div className="flex items-center gap-2 justify-center">
                <FiMapPin className="text-wood-accent" />
                <span className="text-wood-text text-xs sm:text-base">{business.adress}{business.ville ? ', ' + business.ville : ''}</span>
              </div>
            )}
            {business.tele && (
              <div className="flex items-center gap-2 justify-center">
                <FiPhone className="text-wood-accent" />
                <a href={`tel:${business.tele}`} className="text-wood-text hover:underline text-xs sm:text-base">{business.tele}</a>
              </div>
            )}
          </div>
          <p className="text-wood-text/70 text-xs sm:text-sm mt-4">© {new Date().getFullYear()} {business?.nom || 'Business'}. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
};

export default RusticWood; 