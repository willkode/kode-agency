import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SITE_NAME = "Kode Agency";
const SITE_URL = "https://kodeagency.us";
const DEFAULT_IMAGE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e276e2117009b68e21c5c/3e54475dc_KA-Logo.png";

export default function SEO({ 
  title, 
  description, 
  keywords = [],
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  jsonLd = null 
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

// Pre-built JSON-LD schemas
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kode Agency",
  "url": SITE_URL,
  "logo": DEFAULT_IMAGE,
  "description": "AI-accelerated web development and digital marketing agency with 30+ years of experience.",
  "foundingDate": "1995",
  "sameAs": [
    "https://linkedin.com/company/kodeagency",
    "https://twitter.com/kodeagency"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "hello@kodeagency.com"
  }
});

export const createServiceSchema = (serviceName, description, url) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": serviceName,
  "provider": {
    "@type": "Organization",
    "name": "Kode Agency",
    "url": SITE_URL
  },
  "description": description,
  "url": `${SITE_URL}${url}`
});

export const createWebPageSchema = (name, description, url) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": name,
  "description": description,
  "url": `${SITE_URL}${url}`,
  "isPartOf": {
    "@type": "WebSite",
    "name": "Kode Agency",
    "url": SITE_URL
  }
});

export const createFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
});

export const createBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${SITE_URL}${item.url}`
  }))
});

export const createArticleSchema = (title, description, datePublished, image) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "datePublished": datePublished,
  "author": {
    "@type": "Organization",
    "name": "Kode Agency"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Kode Agency",
    "logo": {
      "@type": "ImageObject",
      "url": DEFAULT_IMAGE
    }
  },
  "image": image
});

export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Kode Agency",
  "url": SITE_URL,
  "logo": DEFAULT_IMAGE,
  "description": "AI-accelerated web development and digital marketing agency.",
  "priceRange": "$$$",
  "openingHours": "Mo-Fr 09:00-18:00",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates"
  }
});