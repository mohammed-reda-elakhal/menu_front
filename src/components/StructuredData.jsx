import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * StructuredData component for adding JSON-LD structured data to pages
 * @param {Object} props
 * @param {string} props.type - The type of structured data (e.g., 'Organization', 'WebSite', 'Product')
 * @param {Object} props.data - The structured data object
 */
const StructuredData = ({ type, data }) => {
  // Base organization data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Meniwi',
    url: 'https://meniwi.com',
    logo: 'https://meniwi.com/src/assets/menu.png',
    sameAs: [
      'https://facebook.com/meniwi',
      'https://twitter.com/meniwi',
      'https://instagram.com/meniwi',
      'https://linkedin.com/company/meniwi'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-234-567-8900',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Arabic']
    }
  };

  // Website data
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Meniwi - Digital Menu Platform',
    url: 'https://meniwi.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://meniwi.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  // Software application data
  const softwareApplicationData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Meniwi',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1024'
    }
  };

  // Determine which structured data to use
  let structuredData;
  switch (type) {
    case 'Organization':
      structuredData = { ...organizationData, ...data };
      break;
    case 'WebSite':
      structuredData = { ...websiteData, ...data };
      break;
    case 'SoftwareApplication':
      structuredData = { ...softwareApplicationData, ...data };
      break;
    default:
      structuredData = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data
      };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
