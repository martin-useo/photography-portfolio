// Menu toggle function for mobile navigation
function menuToggle() {
  const menu = document.getElementById('menu');
  const ulMenu = document.getElementById('ulMenu');
  
  if (menu && ulMenu) {
    const isOpen = menu.classList.contains('h-auto') || menu.style.height !== '0px';
    
    if (isOpen) {
      // Close menu
      menu.style.height = '0px';
      menu.style.overflow = 'hidden';
      ulMenu.style.opacity = '0';
    } else {
      // Open menu
      menu.style.height = 'auto';
      menu.style.overflow = 'visible';
      ulMenu.style.opacity = '1';
    }
  }
}

