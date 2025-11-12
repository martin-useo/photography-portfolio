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
              const isInPortfolio = window.location.pathname.includes('/portfolio/') || window.location.pathname.includes('\\portfolio\\') ||
                currentPage === 'nature.html' || currentPage === 'portraits.html' ||
                currentPage === 'interieur.html' || currentPage === 'vehicules.html' ||
                currentPage === 'nourriture.html' || currentPage === 'travaux.html' ||
                currentPage === 'urbain.html' || currentPage === 'animaux.html';
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
    const isInPages = currentPath.includes('/pages/') || currentPath.includes('\\pages\\') || currentPage === 'about_me.html' || currentPage === 'contact.html';
    const isInPortfolio = currentPath.includes('/portfolio/') || currentPath.includes('\\portfolio\\') || 
      currentPage === 'nature.html' || currentPage === 'portraits.html' || 
      currentPage === 'interieur.html' || currentPage === 'vehicules.html' || 
      currentPage === 'nourriture.html' || currentPage === 'travaux.html' || 
      currentPage === 'urbain.html' || currentPage === 'animaux.html';
    
    const homeLink = document.getElementById('nav-home-link');
    const aboutLink = document.getElementById('nav-about-link');
    const contactLink = document.getElementById('nav-contact-link');
    
    const portfolioLinks = {
      nature: {
        desktop: document.getElementById('nav-portfolio-nature-link'),
        mobile: document.getElementById('nav-portfolio-nature-link-mobile')
      },
      portraits: {
        desktop: document.getElementById('nav-portfolio-portraits-link'),
        mobile: document.getElementById('nav-portfolio-portraits-link-mobile')
      },
      interieur: {
        desktop: document.getElementById('nav-portfolio-interieur-link'),
        mobile: document.getElementById('nav-portfolio-interieur-link-mobile')
      },
      vehicules: {
        desktop: document.getElementById('nav-portfolio-vehicules-link'),
        mobile: document.getElementById('nav-portfolio-vehicules-link-mobile')
      },
      nourriture: {
        desktop: document.getElementById('nav-portfolio-nourriture-link'),
        mobile: document.getElementById('nav-portfolio-nourriture-link-mobile')
      },
      travaux: {
        desktop: document.getElementById('nav-portfolio-travaux-link'),
        mobile: document.getElementById('nav-portfolio-travaux-link-mobile')
      },
      urbain: {
        desktop: document.getElementById('nav-portfolio-urbain-link'),
        mobile: document.getElementById('nav-portfolio-urbain-link-mobile')
      },
      animaux: {
        desktop: document.getElementById('nav-portfolio-animaux-link'),
        mobile: document.getElementById('nav-portfolio-animaux-link-mobile')
      }
    };
    
    if (isInPortfolio) {
      // Pages dans pages/portfolio/
      if (homeLink) homeLink.href = '../../index.html';
      if (aboutLink) aboutLink.href = '../about_me.html';
      if (contactLink) contactLink.href = '../contact.html';
      
      Object.keys(portfolioLinks).forEach(category => {
        const link = portfolioLinks[category];
        if (link.desktop) link.desktop.href = `${category}.html`;
        if (link.mobile) link.mobile.href = `${category}.html`;
      });
      
      updateActivePage(currentPage, true);
    } else if (isInPages) {
      // Pages dans pages/ (about_me, contact)
      if (homeLink) homeLink.href = '../index.html';
      if (aboutLink) aboutLink.href = 'about_me.html';
      if (contactLink) contactLink.href = 'contact.html';
      
      Object.keys(portfolioLinks).forEach(category => {
        const link = portfolioLinks[category];
        if (link.desktop) link.desktop.href = `portfolio/${category}.html`;
        if (link.mobile) link.mobile.href = `portfolio/${category}.html`;
      });
      
      updateActivePage(currentPage, false);
    } else {
      // Page racine (index.html)
      if (homeLink) homeLink.href = 'index.html';
      if (aboutLink) aboutLink.href = 'pages/about_me.html';
      if (contactLink) contactLink.href = 'pages/contact.html';
      
      Object.keys(portfolioLinks).forEach(category => {
        const link = portfolioLinks[category];
        if (link.desktop) link.desktop.href = `pages/portfolio/${category}.html`;
        if (link.mobile) link.mobile.href = `pages/portfolio/${category}.html`;
      });
      
      updateActivePage(currentPage === '' || currentPage === '/' || currentPage === 'index.html' ? 'index.html' : currentPage, false);
    }
    
    hideCurrentPageFromDropdown(currentPage);
  }

  function hideCurrentPageFromDropdown(currentPage) {
    const categories = ['nature', 'portraits', 'interieur', 'vehicules', 'nourriture', 'travaux', 'urbain', 'animaux'];
    
    categories.forEach(category => {
      const desktopLink = document.getElementById(`nav-portfolio-${category}-link`);
      const mobileLink = document.getElementById(`nav-portfolio-${category}-link-mobile`);
      
      if (currentPage === `${category}.html` || currentPage.includes(category)) {
        if (desktopLink) desktopLink.style.display = 'none';
        if (mobileLink) mobileLink.style.display = 'none';
      } else {
        if (desktopLink) desktopLink.style.display = 'block';
        if (mobileLink) mobileLink.style.display = 'block';
      }
    });
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
      
      const pageNames = {
        'nature': 'NATURE',
        'portraits': 'PORTRAITS',
        'interieur': 'INTÉRIEUR',
        'vehicules': 'VÉHICULES',
        'nourriture': 'NOURRITURE',
        'travaux': 'TRAVAUX',
        'urbain': 'URBAIN',
        'animaux': 'ANIMAUX'
      };
      
      for (const [key, value] of Object.entries(pageNames)) {
        if (currentPage === `${key}.html` || currentPage.includes(key)) {
          if (portfolioText && isDesktop) {
            portfolioText.textContent = value;
          }
          if (portfolioUnderline) {
            portfolioUnderline.className = 'hidden md:block h-0.5 bg-black dark:bg-white absolute bottom-0 left-0 right-0';
          }
          break;
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

