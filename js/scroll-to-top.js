(function() {
  const SCROLL_THRESHOLD = 300;
  
  function initScrollToTop() {
    const button = document.getElementById('scroll-to-top-btn');
    if (!button) {
      setTimeout(initScrollToTop, 100);
      return;
    }
    
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > SCROLL_THRESHOLD) {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.pointerEvents = 'auto';
        button.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        button.classList.add('opacity-100', 'visible');
      } else {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.pointerEvents = 'none';
        button.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        button.classList.remove('opacity-100', 'visible');
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
  
  window.scrollToTop = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initScrollToTop, 200);
    });
  } else {
    setTimeout(initScrollToTop, 200);
  }
})();
