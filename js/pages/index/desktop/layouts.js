export const DESKTOP_LAYOUTS = [
  {
    name: 'two-left-one-right',
    description: 'Deux images à gauche, une grande à droite',
    structure: [
      { width: 'md:w-1/2', height: 'h-1/2', isLeftColumn: true },
      { width: 'md:w-1/2', height: 'h-1/2', isLeftColumn: true },
      { width: 'md:w-1/2', height: 'h-full', isRightColumn: true }
    ],
    useColumns: true
  },
  {
    name: 'three-column-grid',
    description: 'Trois images en colonnes égales',
    structure: [
      { width: 'md:w-1/3', height: 'h-full' },
      { width: 'md:w-1/3', height: 'h-full' },
      { width: 'md:w-1/3', height: 'h-full' }
    ]
  }
];

export function organizeImagesForLayout(layout, cachedPortraitImages, cachedLandscapeImages) {
  const organized = [];
  const usedImages = new Set();
  
  if (layout.name === 'three-column-grid') {
    if (!cachedPortraitImages || cachedPortraitImages.length < 3) {
      return [];
    }
    
    const shuffledPortraits = [...cachedPortraitImages].sort(() => Math.random() - 0.5);
    let portraitIndex = 0;
    
    layout.structure.forEach((cell) => {
      while (portraitIndex < shuffledPortraits.length && usedImages.has(shuffledPortraits[portraitIndex].src)) {
        portraitIndex++;
      }
      
      if (portraitIndex < shuffledPortraits.length) {
        const selectedImage = shuffledPortraits[portraitIndex];
        usedImages.add(selectedImage.src);
        organized.push({
          ...selectedImage,
          layoutCell: cell
        });
        portraitIndex++;
      }
    });
  } else if (layout.name === 'two-left-one-right') {
    if (!cachedLandscapeImages || cachedLandscapeImages.length < 2) {
      return [];
    }
    if (!cachedPortraitImages || cachedPortraitImages.length < 1) {
      return [];
    }
    
    const shuffledLandscapes = [...cachedLandscapeImages].sort(() => Math.random() - 0.5);
    const shuffledPortraits = [...cachedPortraitImages].sort(() => Math.random() - 0.5);
    
    let landscapeIndex = 0;
    let portraitIndex = 0;
    
    layout.structure.forEach((cell, index) => {
      let selectedImage;
      
      if (index < 2) {
        while (landscapeIndex < shuffledLandscapes.length && usedImages.has(shuffledLandscapes[landscapeIndex].src)) {
          landscapeIndex++;
        }
        if (landscapeIndex < shuffledLandscapes.length) {
          selectedImage = shuffledLandscapes[landscapeIndex];
          landscapeIndex++;
        }
      } else {
        while (portraitIndex < shuffledPortraits.length && usedImages.has(shuffledPortraits[portraitIndex].src)) {
          portraitIndex++;
        }
        if (portraitIndex < shuffledPortraits.length) {
          selectedImage = shuffledPortraits[portraitIndex];
          portraitIndex++;
        }
      }
      
      if (selectedImage && !usedImages.has(selectedImage.src)) {
        usedImages.add(selectedImage.src);
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
  if (!grid) {
    return;
  }
  
  if (!organizedImages || organizedImages.length === 0) {
    return;
  }
  
  grid.innerHTML = '';
  
  if (layout.useColumns) {
    grid.className = 'flex w-full h-full';
    
    let leftWidth, rightWidth;
    if (layout.name === 'two-left-one-right') {
      leftWidth = 'md:w-1/2';
      rightWidth = 'md:w-1/2';
    } else {
      leftWidth = 'md:w-1/3';
      rightWidth = 'md:w-2/3';
    }
    
    const leftColumn = document.createElement('div');
    leftColumn.className = `flex flex-col ${leftWidth} w-full h-full`;
    
    const rightColumn = document.createElement('div');
    rightColumn.className = `flex flex-col ${rightWidth} w-full h-full`;
    
    organizedImages.forEach((img, index) => {
      if (!img || !img.layoutCell) return;
      
      const cellContainer = document.createElement('div');
      cellContainer.className = `w-full ${img.layoutCell.height} relative overflow-hidden`;
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
      
      if (img.layoutCell.isLeftColumn) {
        leftColumn.appendChild(cellContainer);
      } else if (img.layoutCell.isRightColumn) {
        rightColumn.appendChild(cellContainer);
      }
    });
    
    grid.appendChild(leftColumn);
    grid.appendChild(rightColumn);
  } else {
    grid.className = 'flex flex-wrap w-full h-full items-stretch';
    
    const hasPartialHeights = organizedImages.some(img => 
      img.layoutCell.height && (img.layoutCell.height.includes('1/3') || img.layoutCell.height.includes('2/3'))
    );
    
    if (hasPartialHeights) {
      grid.style.display = 'flex';
      grid.style.flexWrap = 'wrap';
      grid.style.height = '100%';
    }
    
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
}
