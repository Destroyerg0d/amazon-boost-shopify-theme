import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "./SEO";

const SITE_URL = "https://reviewpromax.com";
const BRAND = "ReviewProMax";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND,
  url: SITE_URL,
  logo: "https://reviewpromax.com/og-image.png",
  email: "Support@reviewpromax.com",
  telephone: "+1-678-831-5443",
  sameAs: [
    "https://facebook.com/",
    "https://twitter.com/",
    "https://www.youtube.com/",
    "https://www.linkedin.com/",
    "https://www.instagram.com/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-678-831-5443",
    contactType: "customer support",
    email: "Support@reviewpromax.com",
    areaServed: "US",
    availableLanguage: ["English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "2436 Main Street",
    addressLocality: "Springfield",
    addressRegion: "IL",
    postalCode: "62704",
    addressCountry: "US",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const servicesJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Buy Amazon KDP Reviews",
    provider: { "@type": "Organization", name: BRAND },
    areaServed: "Worldwide",
    serviceType: "Amazon KDP book reviews",
    url: `${SITE_URL}/`,
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Author Marketing & Book Promotion",
    provider: { "@type": "Organization", name: BRAND },
    areaServed: "Worldwide",
    serviceType: "Book marketing",
    url: `${SITE_URL}/pricing`,
  },
];

const routeMetaMap: { match: (p: string) => boolean; title: string; description: string; noindex?: boolean }[] = [
  {
    match: (p) => p === "/",
    title: "Buy Amazon KDP Reviews to Boost Book Sales",
    description:
      "Buy verified Amazon KDP book reviews with ReviewProMax. Increase rankings, trust, and sales safely and fast.",
  },
  {
    match: (p) => p.startsWith("/pricing"),
    title: "Pricing for Amazon KDP Review Services",
    description: "Transparent pricing for buying Amazon KDP reviews and author marketing services.",
  },
  {
    match: (p) => p.startsWith("/testimonials"),
    title: "Author Testimonials & Success Stories",
    description: "See how authors use ReviewProMax to grow Amazon KDP reviews and book sales.",
  },
  {
    match: (p) => p.startsWith("/contact"),
    title: "Contact ReviewProMax Support",
    description: "Get help with Amazon KDP reviews, orders, and account questions.",
  },
  {
    match: (p) => p.startsWith("/help"),
    title: "Help Center",
    description: "Guides and answers about buying Amazon KDP reviews and author services.",
  },
  {
    match: (p) => p.startsWith("/community"),
    title: "Author Community",
    description: "Join authors discussing KDP reviews, marketing, and growth.",
  },
  { match: (p) => p.startsWith("/privacy"), title: "Privacy Policy", description: "Our privacy practices.", },
  { match: (p) => p.startsWith("/refund"), title: "Refund Policy", description: "Refund and cancellation terms.", },
  { match: (p) => p.startsWith("/shipping"), title: "Shipping Policy", description: "Shipping and delivery details.", },
  { match: (p) => p.startsWith("/terms"), title: "Terms of Service", description: "Service terms and conditions.", },
  // Noindex sections
  { match: (p) => p.startsWith("/auth"), title: "Sign In", description: "Access your ReviewProMax account.", noindex: true },
  { match: (p) => p.startsWith("/dashboard"), title: "Dashboard", description: "Your account dashboard.", noindex: true },
  { match: (p) => p.startsWith("/admin"), title: "Admin", description: "Admin area.", noindex: true },
  { match: (p) => p.startsWith("/thank-you"), title: "Thank You", description: "Order confirmation.", noindex: true },
];

export const DefaultSEO: React.FC = () => {
  const { pathname } = useLocation();

  const meta = useMemo(() => {
    const found = routeMetaMap.find((r) => r.match(pathname));
    return (
      found || {
        title: "ReviewProMax",
        description: "Buy Amazon KDP reviews and grow your book sales.",
        noindex: false,
        match: () => true,
      }
    );
  }, [pathname]);

  const baseStructured: any[] = [orgJsonLd, websiteJsonLd];
  if (pathname === "/") {
    baseStructured.push(...servicesJsonLd);
  }

  return (
    <SEO
      title={meta.title}
      description={meta.description}
      canonicalPath={pathname}
      noindex={!!meta.noindex}
      ogImage={"https://reviewpromax.com/og-image.png"}
      keywords={["ReviewProMax", "Buy Amazon KDP reviews", "KDP review service", "book marketing"]}
      structuredData={baseStructured}
    />
  );
};

export default DefaultSEO;
