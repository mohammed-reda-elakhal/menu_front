import React from 'react';

const GlassFrostTemplate = ({ menuData }) => {
  if (!menuData) {
    return (
      <div className="min-h-screen grid place-content-center text-gf-text">
        <p>Aucun menu disponible.</p>
      </div>
    );
  }

  return (
    <div
      data-template="glass-frost"
      className="min-h-screen text-gf-text font-sans px-4 py-10 lg:py-20"
    >
      {/* ---------- Carte principale ---------- */}
      <div className="mx-auto max-w-[920px] space-y-12">
        {/* --- En-tête --- */}
        <header className="relative mx-auto w-full backdrop-blur-xs bg-gf-surface border border-gf-border rounded-2xl p-8 text-center shadow-lg">
          {menuData.business?.logo?.url && (
            <img
              src={menuData.business.logo.url}
              alt={menuData.business.nom}
              className="h-20 w-20 object-contain mx-auto mb-4 drop-shadow"
            />
          )}
          <h1 className="text-3xl font-semibold tracking-wide">{menuData.business?.nom}</h1>
          <p className="mt-2 text-gf-muted">{menuData.business?.description}</p>
        </header>

        {/* --- Sections --- */}
        {menuData.categories?.map((cat) => (
          <section
            key={cat._id}
            className="backdrop-blur-xs bg-gf-surface border border-gf-border rounded-2xl p-6 lg:p-10 shadow-lg"
          >
            {/* Titre de section */}
            <h2 className="text-xl font-medium mb-6 tracking-wider text-gf-accent uppercase">
              {cat.nom}
            </h2>

            {/* Liste produits */}
            <ul className="space-y-6">
              {cat.produits?.map((p) => (
                <li key={p._id} className="flex justify-between gap-4">
                  {/* Nom + description */}
                  <div className="max-w-[70%]">
                    <h3 className="font-semibold">{p.nom}</h3>
                    {p.description && (
                      <p className="text-sm text-gf-muted">{p.description}</p>
                    )}
                    {/* add-ons */}
                    {p.composant?.length > 0 && (
                      <ul className="mt-1 list-disc list-inside text-xs text-gf-muted">
                        {p.composant.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Prix */}
                  <div className="whitespace-nowrap text-right min-w-[80px]">
                    {p.promo_prix ? (
                      <>
                        <span className="line-through text-sm text-gf-muted block">
                          {p.prix} DH
                        </span>
                        <span className="text-lg font-semibold">
                          {p.promo_prix} DH
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold">{p.prix} DH</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default GlassFrostTemplate;
