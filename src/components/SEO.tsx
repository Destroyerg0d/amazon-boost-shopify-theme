import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://reviewpromax.com";
const DEFAULT_OG_IMAGE = "https://reviewpromax.com/og-image.png";
const BRAND = "ReviewProMax";
const DEFAULT_DESCRIPTION = "Buy verified Amazon KDP book reviews to boost visibility and sales. ReviewProMax helps authors get more reviews, improve rankings, and grow readership.";
const DEFAULT_KEYWORDS = [
  "ReviewProMax",
  "Buy Amazon KDP reviews",
  "Amazon book reviews",
  "KDP review service",
  "book marketing",
  "author reviews",
  "boost book sales",
];

export type SEOProps = {
  title?: string;
  description?: string;
  canonicalPath?: string; // e.g. "/pricing"
  ogImage?: string;
  noindex?: boolean;
  keywords?: string[];
  structuredData?: Record<string, any> | Record<string, any>[];
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath = "/",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  keywords,
  structuredData,
}) => {
  const fullTitle = title ? `${title} | ${BRAND}` : `${BRAND} | Buy Amazon KDP Reviews`;
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const allKeywords = (keywords && keywords.length ? keywords : DEFAULT_KEYWORDS).join(", ");
  const desc = description ?? DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      {title && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={canonical} />
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={title ? fullTitle : `${BRAND} | Buy Amazon KDP Reviews`} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? fullTitle : `${BRAND} | Buy Amazon KDP Reviews`} />
      <meta name="twitter:description" content={desc} /> 
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {Array.isArray(structuredData)
            ? JSON.stringify(structuredData)
            : JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
