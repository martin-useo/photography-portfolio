(function() {
  function loadComponent(elementId, filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(html => {
        document.getElementById(elementId).innerHTML = html;
        
        if (elementId === 'navbar-container') {
          adjustNavbarPaths();
          
          let resizeTimeout;
          window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
              const currentPage = window.location.pathname.split('/').pop() || window.location.pathname.split('\\').pop() || 'index.html';
              const isInPortfolio = window.location.pathname.includes('/portfolio/') || window.location.pathname.includes('\\portfolio\\') || currentPage === 'nature.html' || currentPage === 'portraits.html';
              if (isInPortfolio) {
                updateActivePage(currentPage, true);
              }
            }, 150);
          });
          
          setTimeout(function() {
            const menu = document.getElementById('menu');
            const ulMenu = document.getElementById('ulMenu');
            
            if (menu && ulMenu) {
              if (window.innerWidth < 768) {
                menu.style.height = '0px';
                menu.style.overflow = 'hidden';
                ulMenu.style.opacity = '0';
              } else {
                menu.style.height = '';
                menu.style.overflow = '';
                ulMenu.style.opacity = '1';
              }
            }
            
            if (typeof initMobileMenu === 'function') {
              initMobileMenu();
            }
          }, 50);
          
          setTimeout(function() {
            const button = document.getElementById('nav-portfolio-button');
            const chevron = document.getElementById('portfolio-chevron');
            
            if (chevron) {
              chevron.style.display = 'inline-block';
              chevron.style.visibility = 'visible';
            }
            
            if (button && window.togglePortfolioDropdown) {
              button.onclick = function(e) {
                window.togglePortfolioDropdown(e);
              };
            }
            
            if (window.initDropdown) {
              setTimeout(window.initDropdown, 100);
            }
          }, 200);
        }
      })
      .catch(error => {
        console.error('Error loading component:', error);
      });
  }

  function adjustNavbarPaths() {
    const currentPath = window.location.pathname;
    const currentPage = window.location.pathname.split('/').pop() || window.location.pathname.split('\\').pop() || 'index.html';
    const isInDist = currentPath.includes('/dist/') || currentPath.includes('\\dist\\') || currentPage === 'about_me.html' || currentPage === 'contact.html';
    const isInPortfolio = currentPath.includes('/portfolio/') || currentPath.includes('\\portfolio\\') || currentPage === 'nature.html' || currentPage === 'portraits.html';
    
    const homeLink = document.getElementById('nav-home-link');
    const aboutLink = document.getElementById('nav-about-link');
    const contactLink = document.getElementById('nav-contact-link');
    const portfolioNatureLink = document.getElementById('nav-portfolio-nature-link');
    const portfolioNatureLinkMobile = document.getElementById('nav-portfolio-nature-link-mobile');
    const portfolioPortraitsLink = document.getElementById('nav-portfolio-portraits-link');
    const portfolioPortraitsLinkMobile = document.getElementById('nav-portfolio-portraits-link-mobile');
    
    if (isInPortfolio) {
      if (homeLink) homeLink.href = '../../index.html';
      if (aboutLink) aboutLink.href = '../about_me.html';
      if (contactLink) contactLink.href = '../contact.html';
      if (portfolioNatureLink) portfolioNatureLink.href = 'nature.html';
      if (portfolioNatureLinkMobile) portfolioNatureLinkMobile.href = 'nature.html';
      if (portfolioPortraitsLink) portfolioPortraitsLink.href = 'portraits.html';
      if (portfolioPortraitsLinkMobile) portfolioPortraitsLinkMobile.href = 'portraits.html';
      updateActivePage(currentPage, true);
    } else if (isInDist) {
      if (homeLink) homeLink.href = '../index.html';
      if (aboutLink) aboutLink.href = 'about_me.html';
      if (contactLink) contactLink.href = 'contact.html';
      if (portfolioNatureLink) portfolioNatureLink.href = 'portfolio/nature.html';
      if (portfolioNatureLinkMobile) portfolioNatureLinkMobile.href = 'portfolio/nature.html';
      if (portfolioPortraitsLink) portfolioPortraitsLink.href = 'portfolio/portraits.html';
      if (portfolioPortraitsLinkMobile) portfolioPortraitsLinkMobile.href = 'portfolio/portraits.html';
      updateActivePage(currentPage, false);
    } else {
      if (homeLink) homeLink.href = 'index.html';
      if (aboutLink) aboutLink.href = 'dist/about_me.html';
      if (contactLink) contactLink.href = 'dist/contact.html';
      if (portfolioNatureLink) portfolioNatureLink.href = 'dist/portfolio/nature.html';
      if (portfolioNatureLinkMobile) portfolioNatureLinkMobile.href = 'dist/portfolio/nature.html';
      if (portfolioPortraitsLink) portfolioPortraitsLink.href = 'dist/portfolio/portraits.html';
      if (portfolioPortraitsLinkMobile) portfolioPortraitsLinkMobile.href = 'dist/portfolio/portraits.html';
      updateActivePage(currentPage === '' || currentPage === '/' || currentPage === 'index.html' ? 'index.html' : currentPage, false);
    }
  }

  function updateActivePage(currentPage, isInPortfolio) {
    const portfolioUnderline = document.getElementById('nav-portfolio-underline');
    const portfolioText = document.getElementById('nav-portfolio-text');
    const aboutUnderline = document.getElementById('nav-about-underline');
    const contactUnderline = document.getElementById('nav-contact-underline');
    
    if (portfolioText) {
      portfolioText.textContent = 'PORTFOLIO';
    }
    
    if (portfolioUnderline) {
      portfolioUnderline.className = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    }
    if (aboutUnderline) {
      aboutUnderline.className = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    }
    if (contactUnderline) {
      contactUnderline.className = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    }
    
    if (isInPortfolio) {
      const isDesktop = window.innerWidth >= 768;
      
      if (currentPage === 'nature.html' || currentPage.includes('nature')) {
        if (portfolioText && isDesktop) {
          portfolioText.textContent = 'NATURE';
        }
        if (portfolioUnderline) {
          portfolioUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white absolute bottom-0 left-0 right-0';
        }
      } else if (currentPage === 'portraits.html' || currentPage.includes('portraits')) {
        if (portfolioText && isDesktop) {
          portfolioText.textContent = 'PORTRAITS';
        }
        if (portfolioUnderline) {
          portfolioUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white absolute bottom-0 left-0 right-0';
        }
      } else {
        if (portfolioUnderline) {
          portfolioUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white absolute bottom-0 left-0 right-0';
        }
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

  function loadComponents() {
    const navbarContainer = document.getElementById('navbar-container');
    const footerContainer = document.getElementById('footer-container');
    const scrollToTopContainer = document.getElementById('scroll-to-top-container');
    
    if (navbarContainer) {
      const navbarPath = navbarContainer.getAttribute('data-path') || 'components/navbar.html';
      loadComponent('navbar-container', navbarPath);
    }
    
    if (footerContainer) {
      const footerPath = footerContainer.getAttribute('data-path') || 'components/footer.html';
      loadComponent('footer-container', footerPath);
    }
    
    if (scrollToTopContainer) {
      const scrollToTopPath = scrollToTopContainer.getAttribute('data-path') || 'components/scroll-to-top.html';
      loadComponent('scroll-to-top-container', scrollToTopPath);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();

