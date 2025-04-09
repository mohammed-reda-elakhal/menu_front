import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * SEO component for dynamic meta tags
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Keywords for the page
 * @param {string} props.image - Image URL for social sharing
 * @param {string} props.url - Canonical URL for the page
 * @param {string} props.type - Content type (default: website)
 */
const SEO = ({
  title = 'Meniwi - Digital Menu Platform',
  description = 'Transform your restaurant\'s menu into an interactive digital experience with Meniwi. Create, manage, and share your menu instantly with QR codes.',
  keywords = 'digital menu, restaurant menu, QR code menu, interactive menu, food menu, cafe menu, online menu',
  image = '/src/assets/menu.png',
  url = 'https://meniwi.com',
  type = 'website'
}) => {
  // Construct full title with brand name
  const fullTitle = title.includes('Meniwi')
    ? title
    : `${title} | Meniwi`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
