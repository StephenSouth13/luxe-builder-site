import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const SEOHead = ({ 
  title = "Trịnh Bá Lâm - Sales & Business Development Expert",
  description = "Portfolio of Trịnh Bá Lâm - Sales & Business Development Expert with 8+ years of experience in market expansion, strategic partnerships, and revenue growth across diverse industries.",
  keywords = "Trịnh Bá Lâm, Sales Expert, Business Development, Market Expansion, Strategic Partnerships, Revenue Growth, Vietnam Sales Leader, B2B Sales, Commercial Strategy",
  image = "/profile.jpg",
  type = "website"
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", "Trịnh Bá Lâm");

    // Open Graph tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:image", `${window.location.origin}${image}`, true);
    updateMetaTag("og:site_name", "Trịnh Bá Lâm Portfolio", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", `${window.location.origin}${image}`);

    // Additional SEO tags
    updateMetaTag("robots", "index, follow");
    updateMetaTag("language", "Vietnamese");
    updateMetaTag("revisit-after", "7 days");

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    // JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Trịnh Bá Lâm",
      "jobTitle": "Sales & Business Development Expert",
      "description": description,
      "url": window.location.origin,
      "image": `${window.location.origin}${image}`,
      "sameAs": [
        // Social media links will be dynamically added from database
      ],
      "knowsAbout": [
        "Sales Management",
        "Business Development",
        "Market Expansion",
        "Strategic Partnerships",
        "Revenue Growth",
        "Team Leadership",
        "B2B Sales",
        "Commercial Strategy"
      ],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "University Education"
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, type, location.pathname]);

  return null;
};

export default SEOHead;