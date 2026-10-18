import { siteConfig } from "./siteConfig";

/**
 * Structured data (JSON-LD) untuk seluruh situs:
 * WebSite + Organization + WebApplication.
 * Validasi hasilnya di https://search.google.com/test/rich-results
 */
export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.publisher,
        url: siteConfig.publisherUrl,
        founder: {
          "@type": "Person",
          name: siteConfig.author.name,
          alternateName: siteConfig.author.alias,
          url: siteConfig.author.url,
        },
        sameAs: [siteConfig.author.url, siteConfig.publisherUrl],
      },
      {
        "@type": "WebApplication",
        "@id": `${siteConfig.url}/#webapp`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: siteConfig.language,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify aman karena datanya statis dari siteConfig
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
