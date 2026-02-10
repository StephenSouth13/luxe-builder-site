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
  title = "Portfolio CMS",
  description = "Personal portfolio website with full CMS admin panel.",
  keywords = "portfolio, CMS, personal website",
  image = "/placeholder.svg",
  type = "website"
}: SEOHeadProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const currentUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    document.title = title;

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

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:image", `${baseUrl}${image}`, true);

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", `${baseUrl}${image}`);

    updateMetaTag("robots", "index, follow");

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": title.split(" - ")[0] || "Portfolio",
      "description": description,
      "url": baseUrl,
      "image": `${baseUrl}${image}`,
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
