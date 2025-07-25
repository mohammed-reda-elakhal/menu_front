import React from 'react';

/* props tip:  (type any هنا فقط للتبسيط)
   interface MenuProps { menuData: any }
*/
const MinimalistTemplate = ({ menuData }) => {
    if (!menuData) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-white font-ui-sans">
            <div className="text-center">
              <h2 className="text-lg text-gray-900">No Menu Available</h2>
              <p className="text-sm text-gray-500 mt-1">Please check your configuration.</p>
            </div>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-minimalist-bg text-gray-900 font-ui-sans">
          {/* Ultra-minimal header */}
          <header className="pt-16 pb-12 bg-minimalist-bg">
            <div className="max-w-xl mx-auto px-6 text-center">
              <h1 className="text-2xl font-light tracking-wide text-gray-900">
                {menuData.business?.nom}
              </h1>
              {menuData.business?.description && (
                <p className="text-gray-500 mt-3 text-sm font-light">
                  {menuData?.business?.bio}
                </p>
              )}
            </div>
          </header>
    
          {/* Ultra-minimal content */}
          <main className="max-w-xl mx-auto px-6 pb-16">
            <div className="space-y-12">
              {menuData.categories?.map((category) => (
                <section key={category._id}>
                  {/* Category title */}
                  <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 text-center font-light">
                    {category.nom}
                  </h2>
    
                  {/* Products */}
                  <div className="space-y-6">
                    {category.produits?.map((product) => (
                      <div key={product._id}>
                        <div className="flex items-baseline justify-between">
                          <div className="flex-1">
                            <h3 className="font-light text-base text-gray-900">
                              {product.nom}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-gray-500 mt-1 font-light">
                                {product.description}
                              </p>
                            )}
                            {/* Minimal ingredients display */}
                            {product.composant?.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1 font-light">
                                {product.composant.join(' • ')}
                              </p>
                            )}
                          </div>
                          
                          <div className="ml-6 text-right">
                            {product.promo_prix ? (
                              <div>
                                <p className="text-sm text-gray-400 line-through font-light">
                                  {product.prix}
                                </p>
                                <p className="font-light text-gray-900">
                                  {product.promo_prix} DH
                                </p>
                              </div>
                            ) : (
                              <p className="font-light text-gray-900">
                                {product.prix} DH
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      );
    };
    
export default MinimalistTemplate;
