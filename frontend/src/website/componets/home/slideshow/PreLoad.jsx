export const preloadResources = () => {
    // Detect if device is small
    const isSmallDevice = window.innerWidth < 640;
  
    // Import static image URLs dynamically based on where they're located
    const m1ImageUrl = new URL('../../../images/m3.webp', import.meta.url).href;
  
    // Immediately preload the appropriate LCP image based on device size
    const lcpImageSrc = isSmallDevice
      ? // Use the imported static image path
        m1ImageUrl
      : // Or API path for larger devices - adjust the URL as needed for your environment
        new URL('/api/image/download/first-banner-image-id', window.location.origin).href;
  
    // Create and append preload link to head - this happens before React rendering
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = lcpImageSrc;
    preloadLink.fetchPriority = 'high';
    preloadLink.importance = 'high';
    document.head.appendChild(preloadLink);
  
    // Also preconnect to API domain
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = new URL('/api', window.location.href).origin;
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);
  };