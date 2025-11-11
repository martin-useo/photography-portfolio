// Scroll to Top Button functionality
(function() {
  const SCROLL_THRESHOLD = 300; // Afficher le bouton après 300px de scroll
  
  function initScrollToTop() {
    const button = document.getElementById('scroll-to-top-btn');
    if (!button) {
      // Si le bouton n'est pas encore chargé, réessayer après un court délai
      setTimeout(initScrollToTop, 100);
      return;
    }
    
    // Fonction pour gérer la visibilité du bouton
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > SCROLL_THRESHOLD) {
        // Afficher le bouton avec transition fluide
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.pointerEvents = 'auto';
        button.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        button.classList.add('opacity-100', 'visible');
      } else {
        // Masquer le bouton avec transition fluide
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.pointerEvents = 'none';
        button.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        button.classList.remove('opacity-100', 'visible');
      }
    }
    
    // Écouter les événements de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Vérifier la position initiale
    handleScroll();
  }
  
  // Fonction globale pour le scroll vers le haut
  window.scrollToTop = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Attendre un peu pour que le composant soit chargé
      setTimeout(initScrollToTop, 200);
    });
  } else {
    // Attendre un peu pour que le composant soit chargé
    setTimeout(initScrollToTop, 200);
  }
})();

