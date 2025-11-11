// Initialize mobile menu to closed state on page load
function initMobileMenu() {
  const menu = document.getElementById('menu');
  const ulMenu = document.getElementById('ulMenu');
  
  if (menu && ulMenu && window.innerWidth < 768) {
    // Ensure mobile menu is closed on page load
    menu.style.height = '0px';
    menu.style.overflow = 'hidden';
    ulMenu.style.opacity = '0';
  }
}

// Menu toggle function for mobile navigation
function menuToggle() {
  const menu = document.getElementById('menu');
  const ulMenu = document.getElementById('ulMenu');
  const nav = document.getElementById('nav');
  
  if (menu && ulMenu) {
    // Try to get Alpine.js state first
    let isOpen = false;
    if (nav && window.Alpine && nav._x_dataStack) {
      const alpineData = nav._x_dataStack[0];
      if (alpineData && typeof alpineData.open !== 'undefined') {
        isOpen = alpineData.open;
      }
    }
    
    // Fallback: check DOM state
    if (!isOpen) {
      const currentHeight = menu.style.height || window.getComputedStyle(menu).height;
      const currentOpacity = ulMenu.style.opacity || window.getComputedStyle(ulMenu).opacity;
      isOpen = currentHeight !== '0px' && currentHeight !== '0' && currentOpacity !== '0';
    }
    
    if (isOpen) {
      // Close menu
      menu.style.height = '0px';
      menu.style.overflow = 'hidden';
      ulMenu.style.opacity = '0';
      
      // Also close portfolio dropdown if open
      const dropdownMobile = document.getElementById('portfolio-dropdown-mobile');
      if (dropdownMobile) {
        dropdownMobile.classList.add('hidden');
        dropdownMobile.style.opacity = '';
        dropdownMobile.style.display = '';
      }
    } else {
      // Open menu
      menu.style.height = 'auto';
      menu.style.overflow = 'visible';
      ulMenu.style.opacity = '1';
    }
  }
}

// Initialize menu on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMobileMenu, 100);
  });
} else {
  setTimeout(initMobileMenu, 100);
}

// Also initialize after a delay to catch dynamically loaded content
setTimeout(initMobileMenu, 500);

