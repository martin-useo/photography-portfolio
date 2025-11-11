// Component loader for navbar and footer
(function() {
  // Function to load HTML component
  function loadComponent(elementId, filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(html => {
        document.getElementById(elementId).innerHTML = html;
        
        // After loading navbar, adjust paths based on current page location
        if (elementId === 'navbar-container') {
          adjustNavbarPaths();
        }
      })
      .catch(error => {
        console.error('Error loading component:', error);
      });
  }

  // Function to adjust navbar paths based on current page location
  function adjustNavbarPaths() {
    const currentPath = window.location.pathname;
    const currentPage = window.location.pathname.split('/').pop() || window.location.pathname.split('\\').pop() || 'index.html';
    const isInDist = currentPath.includes('/dist/') || currentPath.includes('\\dist\\') || currentPage === 'about_me.html' || currentPage === 'contact.html';
    
    const homeLink = document.getElementById('nav-home-link');
    const portfolioLink = document.getElementById('nav-portfolio-link');
    const aboutLink = document.getElementById('nav-about-link');
    const contactLink = document.getElementById('nav-contact-link');
    
    if (isInDist) {
      // If we're in the dist folder, adjust paths
      if (homeLink) homeLink.href = '../index.html';
      if (portfolioLink) portfolioLink.href = '../index.html';
      if (aboutLink) aboutLink.href = 'about_me.html';
      if (contactLink) contactLink.href = 'contact.html';
      
      // Update active page indicator
      updateActivePage(currentPage);
    } else {
      // If we're in the root, use original paths
      if (homeLink) homeLink.href = 'index.html';
      if (portfolioLink) portfolioLink.href = 'index.html';
      if (aboutLink) aboutLink.href = 'dist/about_me.html';
      if (contactLink) contactLink.href = 'dist/contact.html';
      
      // Update active page indicator
      updateActivePage(currentPage === '' || currentPage === '/' || currentPage === 'index.html' ? 'index.html' : currentPage);
    }
  }

  // Function to update active page indicator
  function updateActivePage(currentPage) {
    // Reset all underlines
    const portfolioUnderline = document.getElementById('nav-portfolio-underline');
    const aboutUnderline = document.getElementById('nav-about-underline');
    const contactUnderline = document.getElementById('nav-contact-underline');
    
    if (portfolioUnderline) {
      portfolioUnderline.className = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    }
    if (aboutUnderline) {
      aboutUnderline.className = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    }
    if (contactUnderline) {
      contactUnderline.className = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    }
    
    // Set active page underline
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
      if (portfolioUnderline) {
        portfolioUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white';
      }
    } else if (currentPage === 'about_me.html' || currentPage.includes('about')) {
      if (aboutUnderline) {
        aboutUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white';
      }
    } else if (currentPage === 'contact.html' || currentPage.includes('contact')) {
      if (contactUnderline) {
        contactUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white';
      }
    }
  }

  // Load components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const navbarContainer = document.getElementById('navbar-container');
      const footerContainer = document.getElementById('footer-container');
      
      if (navbarContainer) {
        const navbarPath = navbarContainer.getAttribute('data-path') || 'components/navbar.html';
        loadComponent('navbar-container', navbarPath);
      }
      
      if (footerContainer) {
        const footerPath = footerContainer.getAttribute('data-path') || 'components/footer.html';
        loadComponent('footer-container', footerPath);
      }
    });
  } else {
    // DOM is already loaded
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (navbarContainer) {
      const navbarPath = navbarContainer.getAttribute('data-path') || 'components/navbar.html';
      loadComponent('navbar-container', navbarPath);
    }
    
    if (footerContainer) {
      const footerPath = footerContainer.getAttribute('data-path') || 'components/footer.html';
      loadComponent('footer-container', footerPath);
    }
  }
})();

