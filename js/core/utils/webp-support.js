// Détection du support WebP
const WebPSupport = (function() {
  let supported = null;
  
  function checkSupport() {
    if (supported !== null) return supported;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    return supported;
  }
  
  function getImageUrl(baseName, suffix, extension = 'jpg') {
    const webpSupported = checkSupport();
    const ext = webpSupported ? 'webp' : extension;
    return `${baseName}${suffix}.${ext}`;
  }
  
  return {
    isSupported: checkSupport,
    getImageUrl: getImageUrl
  };
})();

// Export global
if (typeof window !== 'undefined') {
  window.WebPSupport = WebPSupport;
}

