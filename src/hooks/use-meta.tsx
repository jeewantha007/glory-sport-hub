import { useEffect } from 'react';

interface MetaTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useMeta = (meta: MetaTags) => {
  useEffect(() => {
    // Update document title
    if (meta.title) {
      document.title = meta.title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property) {
          metaTag.setAttribute('property', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
    };

    // Standard meta tags
    if (meta.description) {
      updateMetaTag('description', meta.description);
    }

    // Open Graph tags
    if (meta.title) {
      updateMetaTag('og:title', meta.title, true);
    }
    if (meta.description) {
      updateMetaTag('og:description', meta.description, true);
    }
    if (meta.image) {
      updateMetaTag('og:image', meta.image, true);
    }
    if (meta.url) {
      updateMetaTag('og:url', meta.url, true);
    }
    if (meta.type) {
      updateMetaTag('og:type', meta.type, true);
    }

    // Twitter Card tags
    if (meta.title) {
      updateMetaTag('twitter:title', meta.title);
    }
    if (meta.description) {
      updateMetaTag('twitter:description', meta.description);
    }
    if (meta.image) {
      updateMetaTag('twitter:image', meta.image);
    }

    // Canonical URL
    if (meta.url) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', meta.url);
    }

    // Add structured data for articles
    if (meta.type === 'article' && meta.title && meta.description) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta.title,
        "description": meta.description,
        "url": meta.url,
        "image": meta.image,
        "publisher": {
          "@type": "Organization",
          "name": "Glory of Sport",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.gloryofsport.com/logo.jpg"
          }
        }
      };

      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Reset to default title if needed
      if (meta.title) {
        document.title = 'Glory of Sport - Sports Gear & Highlights';
      }
    };
  }, [meta]);
};
