import React from 'react';
import './GlassFlowTemplate.css';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa';

// Utility – map platform string to icon
const getSocialIcon = (platform, className = '') => {
  const base = `${className} inline-block align-middle mr-1 w-[18px] h-[18px]`;
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <FaFacebook className={base} />;
    case 'instagram':
      return <FaInstagram className={base} />;
    case 'twitter':
      return <FaTwitter className={base} />;
    case 'whatsapp':
      return <FaWhatsapp className={base} />;
    case 'telegram':
      return <FaTelegram className={base} />;
    case 'linkedin':
      return <FaLinkedin className={base} />;
    case 'youtube':
      return <FaYoutube className={base} />;
    case 'tiktok':
      return <FaTiktok className={base} />;
    default:
      return <FaFacebook className={base} />;
  }
};

// Glassmorphism card avec CSS local
const GlassCard = ({ children, className = '' }) => (
  <div className={`glass-card ${className}`}>
    <div className="glass-card-inner">{children}</div>
  </div>
);

// Champ stylisé
const Field = ({ label, children }) => (
  <p className="glass-field">
    <span className="glass-field-label">{label}: </span>
    {children}
  </p>
);

const GlassFlowTemplate = ({ menuData }) => {
  if (!menuData) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <GlassCard className="p-8">
        <p className="text-center text-slate-600 dark:text-slate-400">No menu data provided.</p>
      </GlassCard>
    </div>
  );

  const { business, categories } = menuData;

  return (
    <main
      className="min-h-screen px-4 md:px-10 py-8 space-y-12 relative"
      data-template="glass-flow"
    >
      {/* Fond glassmorphism animé */}
      <div className="glass-bg-anim">
        <div className="blur-blob blob1" />
        <div className="blur-blob blob2" />
        {/* Icônes décoratives SVG */}
        <svg className="decor-icon icon1" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" /></svg>
        <svg className="decor-icon icon2" viewBox="0 0 56 56" fill="none"><rect x="8" y="8" width="40" height="40" rx="12" stroke="currentColor" strokeWidth="5" /></svg>
        <svg className="decor-icon icon3" viewBox="0 0 48 48" fill="none"><polygon points="24,6 44,42 4,42" stroke="currentColor" strokeWidth="5" fill="none" /></svg>
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Header section */}
        {business && (
          <header className="mx-auto max-w-4xl text-center space-y-6">
            {business.logo?.url && (
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <img
                  src={business.logo.url}
                  alt={business.nom}
                  className="relative mx-auto w-24 h-24 object-contain rounded-full border-2 border-white/30 dark:border-white/10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl"
                />
              </div>
            )}
            <div className="space-y-3">
              <h1 className="glass-title text-4xl md:text-5xl">
                {business.nom}
              </h1>
              {business.bio && (
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {business.bio}
                </p>
              )}
            </div>
            {/* Social icons glassmorphism */}
            {business.socialMedia && (
              <div className="flex justify-center gap-4 flex-wrap">
                {Object.entries(business.socialMedia).map(([platform, link]) => (
                  <a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-social"
                  >
                    {getSocialIcon(platform, 'w-6 h-6')}
                  </a>
                ))}
              </div>
            )}
          </header>
        )}

        {/* Business details */}
        {business && (
          <GlassCard className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-12">
            <Field label="Description">{business.description}</Field>
            <Field label="Address">{business.adress}</Field>
            <Field label="City">{business.ville}</Field>
            <Field label="Phone">{business.tele}</Field>
          </GlassCard>
        )}

        {/* Categories with products */}
        <section className="space-y-16 max-w-7xl mx-auto mt-16">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category._id} className="space-y-8">
                {/* Enhanced category header */}
                <div className="flex items-center gap-6">
                  {category.image?.url && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl blur-xl opacity-50" />
                      <img
                        src={category.image.url}
                        alt={category.nom}
                        className="relative w-20 h-20 object-cover rounded-xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="glass-title text-2xl md:text-3xl">
                      {category.nom}
                    </h2>
                    {category.description && (
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced products grid */}
                {category.produits && category.produits.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.produits.map((product) => (
                      <GlassCard key={product._id} className="space-y-4">
                        {product.image?.url && (
                          <div className="relative rounded-xl overflow-hidden">
                            <img
                              src={product.image.url}
                              alt={product.nom}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="space-y-3">
                          <h3 className="glass-title text-xl font-semibold">
                            {product.nom}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="glass-price">
                              {product.promo_prix ?? product.prix} DH
                            </span>
                            {product.promo_prix && (
                              <span className="glass-strike">
                                {product.prix} DH
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.isVegetarian && (
                              <span className="glass-badge" style={{color:'#22c55e',borderColor:'#22c55e'}}>Veg</span>
                            )}
                            {product.isSpicy && (
                              <span className="glass-badge" style={{color:'#ef4444',borderColor:'#ef4444'}}>Spicy</span>
                            )}
                            {product.isHalal && (
                              <span className="glass-badge" style={{color:'#f59e42',borderColor:'#f59e42'}}>Halal</span>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <GlassCard>
                    <p className="text-center text-slate-500 dark:text-slate-400">
                      No products in this category.
                    </p>
                  </GlassCard>
                )}

                {/* Enhanced supplementaires section */}
                {category.supplementaires && category.supplementaires.length > 0 && (
                  <div className="space-y-6 mt-12">
                    <h3 className="glass-title text-2xl font-bold">
                      Supplémentaires
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {category.supplementaires.map((supp) => (
                        <GlassCard key={supp._id} className="space-y-3">
                          {supp.image?.url && (
                            <div className="relative rounded-xl overflow-hidden">
                              <img
                                src={supp.image.url}
                                alt={supp.nom}
                                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <h4 className="glass-title text-lg font-semibold">
                            {supp.nom}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {supp.description}
                          </p>
                          <p className="glass-price">
                            {supp.prix} DH
                          </p>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <GlassCard>
              <p className="text-center text-slate-600 dark:text-slate-400">
                No categories found.
              </p>
            </GlassCard>
          )}
        </section>
      </div>
    </main>
  );
};

export default GlassFlowTemplate;