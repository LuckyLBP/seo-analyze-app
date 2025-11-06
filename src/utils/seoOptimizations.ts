// Preload critical resources
const preloadCriticalResources = () => {
  // Preload the logo
  const logoLink = document.createElement('link');
  logoLink.rel = 'preload';
  logoLink.href = '/emLogo.png';
  logoLink.as = 'image';
  logoLink.type = 'image/png';
  document.head.appendChild(logoLink);

  // Preload critical API endpoints
  const dnsLinks = [
    'https://pagespeedonline.googleapis.com',
    'https://www.googleapis.com',
    'https://api.deepseek.com'
  ];

  dnsLinks.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Add structured data dynamically
const addStructuredData = () => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SEO Analys Verktyg",
    "description": "Professionell gratis SEO-analys för din webbplats",
    "url": "https://analys.effektivmedia.nu/",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "SEK"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1000"
    }
  });
  document.head.appendChild(script);
};

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  // Run immediately
  preloadCriticalResources();
  addStructuredData();
  
  // Set viewport height custom property for mobile
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
}

export {};