import { renderCategoriesGrid as renderMobileCategories } from './mobile/categories-grid.js';
import { renderCategoriesGrid as renderDesktopCategories } from './desktop/categories-grid.js';

function isMobile() {
  if (typeof window !== 'undefined' && typeof window.isMobile === 'function') {
    return window.isMobile();
  }
  return window.innerWidth < 768;
}

export function renderCategories(categories, getCategoryImage) {
  const grid = document.getElementById('categories-grid');
  const lastRowGrid = document.getElementById('categories-grid-last-row');
  
  if (isMobile() || /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    renderMobileCategories(categories, getCategoryImage, grid);
  } else {
    renderDesktopCategories(categories, getCategoryImage, grid, lastRowGrid);
  }
}
