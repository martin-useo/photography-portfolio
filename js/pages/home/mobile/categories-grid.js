import { createCategoryCard } from '../categories-shared.js';

export function renderCategoriesGrid(categories, getCategoryImage, grid) {
  if (!grid) return;
  
  grid.innerHTML = '';
  grid.style.display = '-webkit-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  grid.style.webkitGridTemplateColumns = 'repeat(2, 1fr)';
  grid.style.gap = '1rem';
  grid.style.columnGap = '1rem';
  grid.style.rowGap = '1rem';
  grid.style.width = '100%';
  
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  categories.forEach((category) => {
    const categoryImage = getCategoryImage(category.slug);
    const categoryName = typeof LanguageManager !== 'undefined' ? LanguageManager.get(category.nameKey) : category.nameKey;
    const card = createCategoryCard(category, categoryImage, categoryName);
    
    if (grid) {
      grid.appendChild(card);
      card.style.visibility = 'visible';
      card.style.opacity = '1';
    }
  });
  
  setTimeout(() => {
    if (grid && grid.children.length === 0) {
      categories.forEach((category) => {
        const categoryImage = getCategoryImage(category.slug);
        const categoryName = typeof LanguageManager !== 'undefined' ? LanguageManager.get(category.nameKey) : category.nameKey;
        const card = createCategoryCard(category, categoryImage, categoryName);
        if (grid) {
          grid.appendChild(card);
          card.style.visibility = 'visible';
          card.style.opacity = '1';
        }
      });
    }
  }, 200);
}
