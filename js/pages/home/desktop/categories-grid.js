import { createCategoryCard } from '../categories-shared.js';

export function renderCategoriesGrid(categories, getCategoryImage, grid, lastRowGrid) {
  if (!grid) return;
  
  grid.innerHTML = '';
  if (lastRowGrid) lastRowGrid.innerHTML = '';
  
  grid.style.display = '-webkit-grid';
  grid.style.display = 'grid';
  
  categories.forEach((category, index) => {
    const categoryImage = getCategoryImage(category.slug);
    const categoryName = typeof LanguageManager !== 'undefined' ? LanguageManager.get(category.nameKey) : category.nameKey;
    const card = createCategoryCard(category, categoryImage, categoryName);
    
    if (index < 6) {
      if (grid) grid.appendChild(card);
    } else {
      if (lastRowGrid) lastRowGrid.appendChild(card);
    }
  });
}
