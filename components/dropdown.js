// Simple dropdown menu for Portfolio
(function() {
  // Function to close dropdown
  window.closePortfolioDropdown = function() {
    const dropdownMobile = document.getElementById('portfolio-dropdown-mobile');
    if (dropdownMobile) {
      dropdownMobile.classList.add('hidden');
      dropdownMobile.style.opacity = '';
      dropdownMobile.style.display = '';
      dropdownMobile.style.visibility = '';
    }
  };

  // Make function globally available
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
      // On mobile, check if the main menu is actually visible
      const menu = document.getElementById('menu');
      const ulMenu = document.getElementById('ulMenu');
      
      if (!menu || !ulMenu) {
        return;
      }
      
      // Check the actual visible state of the menu
      const menuHeight = window.getComputedStyle(menu).height;
      const menuDisplay = window.getComputedStyle(menu).display;
      const ulOpacity = window.getComputedStyle(ulMenu).opacity;
      const ulDisplay = window.getComputedStyle(ulMenu).display;
      
      // Menu is open if it has height, is displayed, and ulMenu is visible
      const isMenuOpen = menuHeight !== '0px' && 
                        menuHeight !== '0' && 
                        menuDisplay !== 'none' &&
                        ulOpacity !== '0' &&
                        ulDisplay !== 'none';
      
      // If menu is closed, don't show dropdown
      if (!isMenuOpen) {
        if (dropdownMobile) {
          dropdownMobile.classList.add('hidden');
          dropdownMobile.style.opacity = '';
          dropdownMobile.style.display = '';
        }
        return;
      }
      
      // Toggle mobile dropdown only if menu is open
      if (dropdownMobile) {
        const isHidden = dropdownMobile.classList.contains('hidden');
        if (isHidden) {
          dropdownMobile.classList.remove('hidden');
          // Force visibility with inline styles to override parent opacity
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
      // Toggle desktop dropdown
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

  // Initialize dropdown functionality
  window.initDropdown = function() {
    const container = document.getElementById('portfolio-dropdown-container');
    const dropdown = document.getElementById('portfolio-dropdown');
    const chevron = document.getElementById('portfolio-chevron');
    
    if (!container || !dropdown) {
      // Retry if elements not loaded yet
      setTimeout(initDropdown, 100);
      return;
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (container && dropdown) {
        if (!container.contains(event.target)) {
          dropdown.classList.add('opacity-0', 'invisible');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    });
    
    // Show dropdown on hover (desktop only)
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
        // Small delay to allow moving to dropdown
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
    
    // Also handle hover on dropdown itself
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
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdown);
  } else {
    initDropdown();
  }
  
  // Also initialize after a delay to catch dynamically loaded content
  setTimeout(initDropdown, 500);
})();

