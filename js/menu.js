function initMobileMenu() {
  const menu = document.getElementById('menu');
  const ulMenu = document.getElementById('ulMenu');
  
  if (menu && ulMenu && window.innerWidth < 768) {
    menu.style.height = '0px';
    menu.style.overflow = 'hidden';
    ulMenu.style.opacity = '0';
  }
}

function menuToggle() {
  const menu = document.getElementById('menu');
  const ulMenu = document.getElementById('ulMenu');
  const nav = document.getElementById('nav');
  
  if (menu && ulMenu) {
    let isOpen = false;
    if (nav && window.Alpine && nav._x_dataStack) {
      const alpineData = nav._x_dataStack[0];
      if (alpineData && typeof alpineData.open !== 'undefined') {
        isOpen = alpineData.open;
      }
    }
    
    if (!isOpen) {
      const currentHeight = menu.style.height || window.getComputedStyle(menu).height;
      const currentOpacity = ulMenu.style.opacity || window.getComputedStyle(ulMenu).opacity;
      isOpen = currentHeight !== '0px' && currentHeight !== '0' && currentOpacity !== '0';
    }
    
    if (isOpen) {
      menu.style.height = '0px';
      menu.style.overflow = 'hidden';
      ulMenu.style.opacity = '0';
      
      const dropdownMobile = document.getElementById('portfolio-dropdown-mobile');
      if (dropdownMobile) {
        dropdownMobile.classList.add('hidden');
        dropdownMobile.style.opacity = '';
        dropdownMobile.style.display = '';
      }
    } else {
      menu.style.height = 'auto';
      menu.style.overflow = 'visible';
      ulMenu.style.opacity = '1';
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMobileMenu, 100);
  });
} else {
  setTimeout(initMobileMenu, 100);
}

setTimeout(initMobileMenu, 500);
