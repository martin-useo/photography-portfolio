export const MOBILE_LAYOUTS = [
  {
    name: 'mobile-single-portrait',
    description: 'Un unique portrait',
    structure: [
      { width: 'w-full', height: 'h-full', isPortrait: true }
    ],
    isMobile: true
  },
  {
    name: 'mobile-double-landscape',
    description: 'Deux paysages superposés',
    structure: [
      { width: 'w-full', height: 'h-1/2', isLandscape: true },
      { width: 'w-full', height: 'h-1/2', isLandscape: true }
    ],
    isMobile: true
  }
];

export function organizeImagesForLayout(layout, cachedPortraitImages, cachedLandscapeImages) {
  const organized = [];
  
  if (layout.name === 'mobile-single-portrait') {
    if (!cachedPortraitImages || cachedPortraitImages.length < 1) {
      return [];
    }
    
    const shuffledPortraits = [...cachedPortraitImages].sort(() => Math.random() - 0.5);
    const selectedImage = shuffledPortraits[0];
    organized.push({
      ...selectedImage,
      layoutCell: layout.structure[0]
    });
  } else if (layout.name === 'mobile-double-landscape') {
    if (!cachedLandscapeImages || cachedLandscapeImages.length < 2) {
      return [];
    }
    
    const shuffledLandscapes = [...cachedLandscapeImages].sort(() => Math.random() - 0.5);
    layout.structure.forEach((cell, index) => {
      if (index < shuffledLandscapes.length) {
        const selectedImage = shuffledLandscapes[index];
        organized.push({
          ...selectedImage,
          layoutCell: cell
        });
      }
    });
  }
  
  return organized;
}

export function createLayoutStructure(layout, organizedImages, loadThumbnailForCanvas) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  grid.className = 'flex flex-col w-full h-full';
  
  organizedImages.forEach((img, index) => {
    if (!img || !img.layoutCell) return;
    
    const cellContainer = document.createElement('div');
    cellContainer.className = `${img.layoutCell.width} ${img.layoutCell.height} relative overflow-hidden`;
    cellContainer.dataset.cellIndex = index;
    
    const imageStack = document.createElement('div');
    imageStack.className = 'absolute inset-0';
    
    const imgElement = document.createElement('img');
    imgElement.dataset.src = img.src;
    imgElement.dataset.filename = img.filename || img.src.split('/').pop();
    imgElement.alt = img.alt || 'Portfolio image';
    imgElement.className = 'block h-full w-full object-cover object-center opacity-0 transition-opacity duration-700 ease-in-out';
    imgElement.dataset.imageIndex = index;
    imageStack.appendChild(imgElement);
    
    if (loadThumbnailForCanvas) {
      loadThumbnailForCanvas(imgElement);
    }
    
    cellContainer.appendChild(imageStack);
    grid.appendChild(cellContainer);
  });
}
