(function() {
  const PORTFOLIO_PAGES = ['nature.html', 'portraits.html', 'animaux.html', 'evenements.html', 'sport.html', 'divers.html', 'urban.html', 'vehicules.html'];
  const CATEGORIES = ['nature', 'portraits', 'sport', 'evenements', 'animaux', 'divers', 'urban', 'vehicules'];
  
  function isPortfolioPage(path, page) {
    return path.includes('/portfolio/') || path.includes('\\portfolio\\') || PORTFOLIO_PAGES.includes(page);
  }
  
  function isPagesPage(path, page) {
    return path.includes('/pages/') || path.includes('\\pages\\') || page === 'about_me.html' || page === 'contact.html';
  }
  
  function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || path.split('\\').pop() || 'index.html';
  }
  
  function loadComponent(elementId, filePath) {
    fetch(filePath)
      .then(response => response.text())
      .then(html => {
        document.getElementById(elementId).innerHTML = html;
        
        if (elementId === 'footer-container') {
          if (typeof LanguageManager !== 'undefined') {
            setTimeout(() => {
              LanguageManager.applyLanguage();
            }, 150);
          }
        }
        
        if (elementId === 'navbar-container') {
          adjustNavbarPaths();
          
          setTimeout(() => {
            const loadLanguageToggle = (containerId) => {
              const container = document.querySelector(`#navbar-container #${containerId}`);
              if (container) {
              const currentPath = window.location.pathname;
              let languageTogglePath = 'components/language-toggle.html';
              if (currentPath.includes('/portfolio/')) {
                languageTogglePath = '../../components/language-toggle.html';
              } else if (currentPath.includes('/pages/')) {
                languageTogglePath = '../components/language-toggle.html';
              }
              fetch(languageTogglePath)
                .then(response => response.text())
                .then(html => {
                    container.innerHTML = html;
                  setTimeout(() => {
                    if (typeof LanguageManager !== 'undefined') {
                        const toggleTexts = container.querySelectorAll('.language-toggle-text');
                        toggleTexts.forEach(toggleText => {
                          if (toggleText && LanguageManager.currentLang) {
                            toggleText.textContent = LanguageManager.currentLang.toUpperCase();
                          }
                        });
                      window.dispatchEvent(new CustomEvent('languageChanged', { 
                        detail: { language: LanguageManager.currentLang } 
                      }));
                    }
                    }, 150);
                })
                .catch(() => {});
            }
            };
            
            loadLanguageToggle('language-toggle-container');
            loadLanguageToggle('language-toggle-container-mobile');
          }, 50);
          
          if (typeof LanguageManager !== 'undefined') {
            setTimeout(() => {
              const currentPage = getCurrentPage();
              const isInPortfolio = isPortfolioPage(window.location.pathname, currentPage);
              
              if (isInPortfolio) {
                const portfolioText = document.getElementById('nav-portfolio-text');
                if (portfolioText) {
                  portfolioText.removeAttribute('data-i18n');
                }
              }
              
              LanguageManager.applyLanguage();
              
              setTimeout(() => {
                if (isInPortfolio) {
                updateActivePage(currentPage, true);
              }
              }, 50);
            }, 100);
          }
          
          let resizeTimeout;
          window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
              const currentPage = getCurrentPage();
              if (isPortfolioPage(window.location.pathname, currentPage)) {
                updateActivePage(currentPage, true);
              }
            }, 150);
          });
          
          setTimeout(function() {
            const menu = document.getElementById('menu');
            const ulMenu = document.getElementById('ulMenu');
            const nav = document.getElementById('nav');
            
            if (menu && ulMenu) {
              if (window.innerWidth < 768) {
                // Forcer la fermeture visuelle du menu sur mobile
                menu.style.height = '0px';
                menu.style.overflow = 'hidden';
                ulMenu.style.opacity = '0';
                
                // Synchroniser l'état Alpine.js si disponible
                if (nav && window.Alpine) {
                  try {
                    setTimeout(() => {
                      const alpineData = nav._x_dataStack?.[0];
                      if (alpineData && typeof alpineData.open !== 'undefined') {
                        alpineData.open = false;
                      }
                    }, 100);
                  } catch (e) {
                    // Alpine.js peut ne pas être encore initialisé
                  }
                }
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
            const chevron = document.getElementById('portfolio-chevron');
            const button = document.getElementById('nav-portfolio-button');
            
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
      .catch(() => {});
  }

  function adjustNavbarPaths() {
    const currentPath = window.location.pathname;
    const currentPage = getCurrentPage();
    const isInPages = isPagesPage(currentPath, currentPage);
    const isInPortfolio = isPortfolioPage(currentPath, currentPage);
    
    const homeLink = document.getElementById('nav-home-link');
    const showcaseLink = document.getElementById('nav-showcase-link');
    const aboutLink = document.getElementById('nav-about-link');
    const contactLink = document.getElementById('nav-contact-link');
    
    const portfolioLinks = {};
    CATEGORIES.forEach(category => {
      portfolioLinks[category] = {
        desktop: document.getElementById(`nav-portfolio-${category}-link`),
        mobile: document.getElementById(`nav-portfolio-${category}-link-mobile`)
      };
    });
    
    function getCategorySlug(category) {
      return category;
    }
    
    if (isInPortfolio) {
      const portfolioText = document.getElementById('nav-portfolio-text');
      if (portfolioText) {
        portfolioText.removeAttribute('data-i18n');
      }
      
      if (homeLink) homeLink.href = '../../index.html';
      if (showcaseLink) showcaseLink.href = '../home.html';
      if (aboutLink) aboutLink.href = '../about_me.html';
      if (contactLink) contactLink.href = '../contact.html';
      
      CATEGORIES.forEach(category => {
        const link = portfolioLinks[category];
        const slug = getCategorySlug(category);
        if (link.desktop) link.desktop.href = `${slug}.html`;
        if (link.mobile) link.mobile.href = `${slug}.html`;
      });
      
      updateActivePage(currentPage, true);
    } else if (isInPages) {
      const portfolioText = document.getElementById('nav-portfolio-text');
      if (portfolioText && !portfolioText.hasAttribute('data-i18n')) {
        portfolioText.setAttribute('data-i18n', 'portfolio');
      }
      
      if (homeLink) homeLink.href = '../index.html';
      if (showcaseLink) showcaseLink.href = 'home.html';
      if (aboutLink) aboutLink.href = 'about_me.html';
      if (contactLink) contactLink.href = 'contact.html';
      
      CATEGORIES.forEach(category => {
        const link = portfolioLinks[category];
        const slug = getCategorySlug(category);
        if (link.desktop) link.desktop.href = `portfolio/${slug}.html`;
        if (link.mobile) link.mobile.href = `portfolio/${slug}.html`;
      });
      
      updateActivePage(currentPage, false);
    } else {
      const portfolioText = document.getElementById('nav-portfolio-text');
      if (portfolioText && !portfolioText.hasAttribute('data-i18n')) {
        portfolioText.setAttribute('data-i18n', 'portfolio');
      }
      
      if (homeLink) homeLink.href = 'index.html';
      if (showcaseLink) showcaseLink.href = 'pages/home.html';
      if (aboutLink) aboutLink.href = 'pages/about_me.html';
      if (contactLink) contactLink.href = 'pages/contact.html';
      
      CATEGORIES.forEach(category => {
        const link = portfolioLinks[category];
        const slug = getCategorySlug(category);
        if (link.desktop) link.desktop.href = `pages/portfolio/${slug}.html`;
        if (link.mobile) link.mobile.href = `pages/portfolio/${slug}.html`;
      });
      
      updateActivePage(currentPage === '' || currentPage === '/' || currentPage === 'index.html' ? 'index.html' : currentPage, false);
    }
    
    hideCurrentPageFromDropdown(currentPage);
  }

  function hideCurrentPageFromDropdown(currentPage) {
    CATEGORIES.forEach(category => {
      const desktopLink = document.getElementById(`nav-portfolio-${category}-link`);
      const mobileLink = document.getElementById(`nav-portfolio-${category}-link-mobile`);
      
      const pageMatch = currentPage === `${category}.html` || currentPage.includes(category);
      
      if (pageMatch) {
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
    const showcaseUnderline = document.getElementById('nav-showcase-underline');
    const aboutUnderline = document.getElementById('nav-about-underline');
    const contactUnderline = document.getElementById('nav-contact-underline');
    
    const resetClass = 'hidden md:block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black dark:bg-white';
    const activeClass = 'hidden md:block h-0.5 bg-black dark:bg-white';
    
    if (portfolioUnderline) portfolioUnderline.className = resetClass;
    if (showcaseUnderline) showcaseUnderline.className = resetClass;
    if (aboutUnderline) aboutUnderline.className = resetClass;
    if (contactUnderline) contactUnderline.className = resetClass;
    
    const isDesktop = window.innerWidth >= 768;
    
    if (isInPortfolio) {
      if (currentPage === 'home.html' || currentPage.includes('home')) {
        if (showcaseUnderline) showcaseUnderline.className = activeClass;
        if (portfolioText && isDesktop) {
          if (typeof LanguageManager !== 'undefined') {
            portfolioText.textContent = LanguageManager.get('portfolio');
          } else {
            portfolioText.textContent = 'PORTFOLIO';
          }
        }
      } else {
        let foundCategory = false;
        for (const key of CATEGORIES) {
          const pageMatch = currentPage === `${key}.html` || currentPage.includes(key);
          
          if (pageMatch) {
            foundCategory = true;
            if (portfolioText && isDesktop) {
              if (typeof LanguageManager !== 'undefined') {
                portfolioText.textContent = LanguageManager.get(key).toUpperCase();
              } else {
      const pageNames = {
        'nature': 'NATURE',
        'portraits': 'PORTRAITS',
                  'sport': 'SPORT',
                  'evenements': 'ÉVÉNEMENTS',
                  'animaux': 'ANIMAUX',
                  'divers': 'DIVERS',
                  'urban': 'URBAIN',
                  'vehicules': 'VÉHICULES'
                };
                portfolioText.textContent = pageNames[key] || 'PORTFOLIO';
              }
          }
          if (portfolioUnderline) {
              portfolioUnderline.className = activeClass + ' absolute bottom-0 left-0 right-0';
            }
            break;
          }
        }
        if (!foundCategory && portfolioText && isDesktop) {
          if (typeof LanguageManager !== 'undefined') {
            portfolioText.textContent = LanguageManager.get('portfolio');
          } else {
            portfolioText.textContent = 'PORTFOLIO';
          }
        }
      }
    } else {
      if (portfolioText && isDesktop) {
        if (typeof LanguageManager !== 'undefined') {
          portfolioText.textContent = LanguageManager.get('portfolio');
        } else {
          portfolioText.textContent = 'PORTFOLIO';
        }
      }
      
      if (currentPage === 'about_me.html' || currentPage.includes('about')) {
      if (aboutUnderline) aboutUnderline.className = activeClass;
    } else if (currentPage === 'contact.html' || currentPage.includes('contact')) {
      if (contactUnderline) contactUnderline.className = activeClass;
      }
    }
  }

  function loadComponents() {
    const components = [
      { id: 'navbar-container', defaultPath: 'components/navbar.html' },
      { id: 'footer-container', defaultPath: 'components/footer.html' },
      { id: 'scroll-to-top-container', defaultPath: 'components/scroll-to-top.html' },
      { id: 'language-toggle-container', defaultPath: 'components/language-toggle.html' }
    ];
    
    components.forEach(component => {
      const element = document.getElementById(component.id);
      if (element) {
        const path = element.getAttribute('data-path') || component.defaultPath;
        loadComponent(component.id, path);
    }
    });
  }

  window.addEventListener('languageChanged', function() {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      const currentPage = getCurrentPage();
      const isInPortfolio = isPortfolioPage(currentPath, currentPage);
      
      if (isInPortfolio) {
        const portfolioText = document.getElementById('nav-portfolio-text');
        if (portfolioText) {
          portfolioText.removeAttribute('data-i18n');
        }
        updateActivePage(currentPage, true);
      }
    }, 50);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();
