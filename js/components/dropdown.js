(function() {
  window.closePortfolioDropdown = function() {
    const dropdownMobile = document.getElementById('portfolio-dropdown-mobile');
    if (dropdownMobile) {
      dropdownMobile.classList.add('hidden');
      dropdownMobile.style.opacity = '';
      dropdownMobile.style.display = '';
      dropdownMobile.style.visibility = '';
    }
  };

  window.togglePortfolioDropdown = function(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const dropdown = document.getElementById('portfolio-dropdown');
    const dropdownMobile = document.getElementById('portfolio-dropdown-mobile');
    const chevron = document.getElementById('portfolio-chevron');
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      const menu = document.getElementById('menu');
      const ulMenu = document.getElementById('ulMenu');
      
      if (!menu || !ulMenu) return;
      
      const menuHeight = window.getComputedStyle(menu).height;
      const menuDisplay = window.getComputedStyle(menu).display;
      const ulOpacity = window.getComputedStyle(ulMenu).opacity;
      const ulDisplay = window.getComputedStyle(ulMenu).display;
      
      const isMenuOpen = menuHeight !== '0px' && 
                        menuHeight !== '0' && 
                        menuDisplay !== 'none' &&
                        ulOpacity !== '0' &&
                        ulDisplay !== 'none';
      
      if (!isMenuOpen) {
        if (dropdownMobile) {
          dropdownMobile.classList.add('hidden');
          dropdownMobile.style.opacity = '';
          dropdownMobile.style.display = '';
        }
        return;
      }
      
      if (dropdownMobile) {
        const isHidden = dropdownMobile.classList.contains('hidden');
        if (isHidden) {
          dropdownMobile.classList.remove('hidden');
          dropdownMobile.style.opacity = '1';
          dropdownMobile.style.display = 'block';
          dropdownMobile.style.visibility = 'visible';
        } else {
          dropdownMobile.classList.add('hidden');
          dropdownMobile.style.opacity = '';
          dropdownMobile.style.display = '';
          dropdownMobile.style.visibility = '';
        }
      }
    } else {
      if (dropdown) {
        const isVisible = !dropdown.classList.contains('opacity-0');
        if (isVisible) {
          dropdown.classList.add('opacity-0', 'invisible');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        } else {
          dropdown.classList.remove('opacity-0', 'invisible');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
      }
    }
  };

  window.initDropdown = function() {
    const container = document.getElementById('portfolio-dropdown-container');
    const dropdown = document.getElementById('portfolio-dropdown');
    const chevron = document.getElementById('portfolio-chevron');
    
    if (!container || !dropdown) {
      setTimeout(initDropdown, 100);
      return;
    }
    
    document.addEventListener('click', function(event) {
      if (container && dropdown) {
        if (!container.contains(event.target)) {
          dropdown.classList.add('opacity-0', 'invisible');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    });
    
    container.addEventListener('mouseenter', function() {
      if (window.innerWidth >= 768 && dropdown && chevron) {
        dropdown.classList.remove('opacity-0', 'invisible');
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.display = 'block';
        chevron.style.transform = 'rotate(180deg)';
        chevron.style.display = 'inline-block';
      }
    });
    
    container.addEventListener('mouseleave', function() {
      if (window.innerWidth >= 768 && dropdown && chevron) {
        setTimeout(function() {
          if (!container.matches(':hover') && !dropdown.matches(':hover')) {
            dropdown.classList.add('opacity-0', 'invisible');
            dropdown.style.opacity = '';
            dropdown.style.visibility = '';
            chevron.style.transform = 'rotate(0deg)';
          }
        }, 100);
      }
    });
    
    if (dropdown) {
      dropdown.addEventListener('mouseenter', function() {
        if (window.innerWidth >= 768) {
          dropdown.classList.remove('opacity-0', 'invisible');
          dropdown.style.opacity = '1';
          dropdown.style.visibility = 'visible';
          dropdown.style.display = 'block';
        }
      });
      
      dropdown.addEventListener('mouseleave', function() {
        if (window.innerWidth >= 768) {
          dropdown.classList.add('opacity-0', 'invisible');
          dropdown.style.opacity = '';
          dropdown.style.visibility = '';
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdown);
  } else {
    initDropdown();
  }
  
  setTimeout(initDropdown, 500);
})();
