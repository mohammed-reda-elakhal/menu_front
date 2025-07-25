import React from 'react';
import { FiPhone, FiGlobe, FiLayers, FiFileText, FiEdit, FiPrinter } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter, FaTelegram, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
// Assuming your assets are in ./assets/coffe/ relative to this file
import coverImageFromFile from './assets/coffe/coffe_cover6.jpg'; // Using your import name
import coffeeIconFromFile from './assets/coffe/coffe_icon.png';  // Using your import name

const CoffeTemplateSimple = ({ menuData }) => {
    if (!menuData || !menuData.business || !menuData.categories) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 font-serif">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">☕</span>
              </div>
              <p className="text-amber-800 text-lg">Menu data is not available or incomplete.</p>
            </div>
          </div>
        );
      }
    
      const { business, categories } = menuData;
    
      const allProducts = categories.reduce((acc, category) => {
        if (category.produits && category.produits.length > 0) {
          category.produits.forEach(product => acc.push(product));
        }
        return acc;
      }, []);
    
      const headerImageUrl = business.coverImage?.url || coverImageFromFile;
    
      // Enhanced decorative coffee elements with better positioning
      const coffeeDecorations = [
        // Main decorative elements
        { type: 'bean', top: '25%', right: '5%', size: 'w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16', rotate: 'rotate-[25deg]', opacity: 'opacity-20', zIndex: 'z-10' },
        { type: 'bean', top: '30%', right: '12%', size: 'w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8', rotate: 'rotate-[45deg]', opacity: 'opacity-15', zIndex: 'z-10' },
        { type: 'bean', top: '35%', left: '5%', size: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10', rotate: 'rotate-[-15deg]', opacity: 'opacity-25', zIndex: 'z-10' },
        { type: 'bean', top: '40%', left: '12%', size: 'w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6', rotate: 'rotate-[60deg]', opacity: 'opacity-20', zIndex: 'z-10' },
        
        // Additional scattered beans
        { type: 'bean', top: '60%', right: '8%', size: 'w-5 h-5 sm:w-7 sm:h-7 lg:w-9 lg:h-9', rotate: 'rotate-[30deg]', opacity: 'opacity-15', zIndex: 'z-10' },
        { type: 'bean', top: '70%', left: '8%', size: 'w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8', rotate: 'rotate-[-20deg]', opacity: 'opacity-20', zIndex: 'z-10' },
        { type: 'bean', bottom: '15%', right: '15%', size: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10', rotate: 'rotate-[40deg]', opacity: 'opacity-18', zIndex: 'z-10' },
      ];
    
      // Coffee steam effect (CSS-only animation)
      const steamElements = [
        { left: '20%', delay: '0s' },
        { left: '25%', delay: '0.5s' },
        { left: '30%', delay: '1s' },
      ];
    
      // Helper to get the right icon
      const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
          case 'facebook': return <FaFacebook className="text-2xl" />;
          case 'instagram': return <FaInstagram className="text-2xl" />;
          case 'twitter': return <FaTwitter className="text-2xl" />;
          case 'whatsapp': return <FaWhatsapp className="text-2xl" />;
          case 'telegram': return <FaTelegram className="text-2xl" />;
          case 'linkedin': return <FaLinkedin className="text-2xl" />;
          case 'youtube': return <FaYoutube className="text-2xl" />;
          case 'tiktok': return <FaTiktok className="text-2xl" />;
          default: return null;
        }
      };
    
      return (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen p-2 sm:p-4 lg:p-8 flex justify-center items-start font-serif">
          <div className="w-full max-w-[900px] bg-gradient-to-b from-amber-50 to-orange-50 shadow-2xl relative overflow-hidden border border-amber-200 rounded-lg">
            
            {/* Enhanced Background Pattern */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D2691E' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
    
            {/* Coffee Bean Decorations */}
            {coffeeDecorations.map((decoration, index) => (
              <div
                key={`coffee-decor-${index}`}
                className={`absolute ${decoration.size} ${decoration.rotate} ${decoration.opacity} ${decoration.zIndex} pointer-events-none`}
                style={{ 
                  top: decoration.top, 
                  bottom: decoration.bottom, 
                  left: decoration.left, 
                  right: decoration.right 
                }}
              >
                <img
                  src={coffeeIconFromFile}
                  alt=""
                  className="w-full h-full object-contain filter sepia-[0.3] saturate-[0.8]"
                  onError={(e) => {
                    // Fallback to CSS coffee bean if image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-amber-800 rounded-full relative"><div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/6 bg-amber-50 rounded-full"></div></div>';
                  }}
                />
              </div>
            ))}
    
            {/* Steam Animation Elements */}
            <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
              {steamElements.map((steam, index) => (
                <div
                  key={`steam-${index}`}
                  className="absolute w-1 h-8 sm:h-12 bg-gradient-to-t from-transparent via-white to-transparent opacity-40 rounded-full animate-pulse"
                  style={{
                    left: steam.left,
                    animationDelay: steam.delay,
                    animationDuration: '2s',
                    animationIterationCount: 'infinite',
                  }}
                />
              ))}
            </div>
    
            <div className="relative z-30">
              {/* Enhanced Header Image Section with Perfect Curve */}
              <div 
                className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] bg-gradient-to-br from-amber-900 to-orange-900 relative overflow-hidden"
                style={{ 
                  clipPath: "polygon(0 0, 100% 0, 100% 75%, 85% 85%, 70% 90%, 50% 92%, 30% 90%, 15% 85%, 0 75%)",
                }}
              >
                <img 
                  src={headerImageUrl} 
                  alt={business.nom || "Coffee Shop Cover"} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; 
                  }}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
    
              {/* Enhanced Titles and Taglines Section */}
              <div className="text-center px-4 sm:px-6 lg:px-8 pt-6 pb-8 relative">
                {/* Decorative line above tagline */}
                <div className="flex items-center justify-center mb-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-16 sm:w-24"></div>
                  <span className="mx-3 text-amber-600">☕</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent w-16 sm:w-24"></div>
                </div>
                
                <p className="text-coffee-medium text-xs font-dancing-script mb-1"> {business.bio}</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-coffee-dark my-1 font-merriweather">
                {business.nom || "Ice Coffe"}
                </h1>
    
                {/* Decorative line below description */}
                <div className="flex items-center justify-center mt-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-32 sm:w-48"></div>
                </div>
              </div>
    
              {/* Enhanced Menu Items Section */}
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    {allProducts.map((product, index) => (
                      <div key={product._id || index} className="group">
                        <div className="flex items-center py-2">
                          <span className="font-merriweather text-base sm:text-lg text-amber-900 whitespace-nowrap">{product.nom}</span>
                          <div className="flex-1 border-b border-dotted border-amber-400 mx-2"></div>
                          <span className="font-merriweather text-base sm:text-lg text-amber-900 whitespace-nowrap">{parseFloat(product.prix).toFixed(2)} <span className="text-xs">DH</span></span>
                        </div>
                        {product.description && (
                          <div className="ml-1 mb-2">
                            <span className="text-xs sm:text-sm text-amber-700 font-dancing-script">{product.description}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {allProducts.length === 0 && (
                      <div className="lg:col-span-2 text-center py-12">
                        <div className="text-6xl mb-4">☕</div>
                        <p className="text-amber-700 text-lg">No menu items to display.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
    
              {/* Enhanced Contact and Order Section */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t border-amber-200">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4">
                  <a href={`tel:${business.tele || ''}`} className="flex items-center text-amber-800 bg-white/60 px-6 py-3 rounded-full shadow-sm text-lg font-semibold hover:bg-white/80 transition">
                    <FiPhone className="w-5 h-5 mr-3" />
                    {business.tele || '+0 123 456 789'}
                  </a>
                </div>
              </div>

              {/* Social Media Footer */}
              {business.socialMedia && (
                <div className="bg-gradient-to-r from-amber-900 to-orange-900 text-amber-100 px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
                  <h4 className="text-lg font-semibold mb-4 relative">
                    <span className="relative">
                      Follow Us
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full bg-amber-400" style={{width: '60px'}}></span>
                    </span>
                  </h4>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {Object.entries(business.socialMedia)
                      .filter(([_, link]) => !!link && link.trim() !== '')
                      .map(([platform, link], idx) => (
                        <a
                          key={platform}
                          href={platform === 'whatsapp' ? `https://wa.me/${link}` : link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-amber-800/30 hover:bg-amber-700/70 transition-all duration-300 shadow-lg hover:scale-110"
                          title={`Follow us on ${platform}`}
                        >
                          {getSocialIcon(platform)}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

export default CoffeTemplateSimple;