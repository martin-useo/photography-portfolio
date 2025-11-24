export function createCategoryCard(category, categoryImage, categoryName) {
  const card = document.createElement('a');
  card.href = category.path;
  card.className = 'group relative block overflow-hidden rounded-lg aspect-[3/2] sm:aspect-[4/3] transition-transform duration-300 hover:scale-105 w-full';
  card.setAttribute('data-category', category.slug);
  
  if (categoryImage) {
    card.innerHTML = `
      <div class="absolute inset-0">
        <img data-src="${categoryImage.src}" 
             data-filename="${categoryImage.filename || categoryImage.src.split('/').pop()}"
             alt="${categoryImage.alt || categoryName}" 
             class="w-full h-full object-cover lazy-load opacity-0 transition-opacity duration-500" />
        <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center px-2" style="display: flex; align-items: center; justify-content: center; padding-left: 0.5rem; padding-right: 0.5rem;">
        <h3 class="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-signika font-bold text-white drop-shadow-lg" style="text-align: center; width: 100%;" data-i18n="${category.nameKey}">
          ${categoryName}
        </h3>
      </div>
    `;
    
    const img = card.querySelector('img');
    if (img && typeof ImageOptimizer !== 'undefined') {
      ImageOptimizer.loadImage(img);
    } else if (img) {
      img.src = img.dataset.src;
      img.style.opacity = '1';
    }
  } else {
    card.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800 transition-colors duration-300"></div>
      <div class="absolute inset-0 flex items-center justify-center px-2" style="display: flex; align-items: center; justify-content: center; padding-left: 0.5rem; padding-right: 0.5rem;">
        <h3 class="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-signika font-bold text-white" style="text-align: center; width: 100%;" data-i18n="${category.nameKey}">
          ${categoryName}
        </h3>
      </div>
    `;
  }
  
  return card;
}
