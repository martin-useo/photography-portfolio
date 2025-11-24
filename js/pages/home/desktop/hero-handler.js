let currentExpandedIndex = -1;

function startPortraitAnimation(container, images) {
  const portraitDivs = container.querySelectorAll('.portrait-item');
  if (portraitDivs.length !== 3) return;

  portraitDivs.forEach((div) => {
    const newDiv = div.cloneNode(true);
    // Réappliquer les styles de transition après le clonage
    newDiv.style.transition = 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    newDiv.style.willChange = 'width';
    newDiv.style.cursor = 'pointer';
    newDiv.style.flexShrink = '0';
    div.parentNode.replaceChild(newDiv, div);
  });

  const updatedPortraitDivs = container.querySelectorAll('.portrait-item');

  function getContainerDimensions() {
    return {
      height: container.offsetHeight,
      width: container.offsetWidth
    };
  }

  function expandPortrait(index) {
    const { height: containerHeight, width: containerWidth } = getContainerDimensions();
    const aspectRatio = parseFloat(updatedPortraitDivs[index].dataset.aspectRatio) || 0.666667;
    
    const naturalWidth = containerHeight * aspectRatio;
    const maxExpandedWidth = containerWidth * 0.55;
    const expandedWidth = Math.min(naturalWidth, maxExpandedWidth);
    const remainingWidth = containerWidth - expandedWidth;
    const otherPortraitWidth = remainingWidth / 2;

    updatedPortraitDivs[index].style.width = `${(expandedWidth / containerWidth) * 100}%`;
    
    updatedPortraitDivs.forEach((div, i) => {
      if (i !== index) {
        div.style.width = `${(otherPortraitWidth / containerWidth) * 100}%`;
      }
    });

    currentExpandedIndex = index;
  }

  function resetToBase() {
    updatedPortraitDivs.forEach((div) => {
      div.style.width = '33.333%';
    });
    currentExpandedIndex = -1;
  }

  updatedPortraitDivs.forEach((div, index) => {
    div.addEventListener('mouseenter', () => {
      expandPortrait(index);
    });
  });

  container.addEventListener('mouseleave', () => {
    resetToBase();
  });
}

export function stopPortraitAnimation() {
  currentExpandedIndex = -1;
  
  const heroThreePortraits = document.getElementById('hero-three-portraits');
  if (heroThreePortraits) {
    const portraitDivs = heroThreePortraits.querySelectorAll('.portrait-item');
    portraitDivs.forEach((div) => {
      div.style.width = '33.333%';
    });
  }
}

export function getHeroImages(allImages) {
  const landscapeImages = allImages.filter(img => img.aspectRatio && img.aspectRatio > 1);
  const portraitImages = allImages.filter(img => img.aspectRatio && img.aspectRatio <= 1);
  const useThreePortraits = Math.random() < 0.5 && portraitImages.length >= 3;
  
  if (useThreePortraits) {
    const fiveStarPortraits = portraitImages.filter(img => img.rating === 5);
    const sourcePortraits = fiveStarPortraits.length >= 3 ? fiveStarPortraits : portraitImages;
    const shuffled = [...sourcePortraits].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    
    if (selected.length === 3) {
      return { type: 'three-portraits', images: selected };
    }
  }
  
  if (landscapeImages.length > 0) {
    const fiveStarLandscapes = landscapeImages.filter(img => img.rating === 5);
    const sourceLandscapes = fiveStarLandscapes.length > 0 ? fiveStarLandscapes : landscapeImages;
    return { 
      type: 'single-landscape', 
      images: [sourceLandscapes[Math.floor(Math.random() * sourceLandscapes.length)]]
    };
  }
  
  return null;
}

export function adjustHeroImageAspectRatio(heroImages, heroContainer, heroImgElement) {
  if (!heroImages || !heroContainer) return;
  
  if (heroImages.type !== 'three-portraits') {
    stopPortraitAnimation();
  }
  
  heroContainer.style.aspectRatio = '';
  if (heroImgElement) {
    heroImgElement.style.objectFit = 'cover';
  }
}

export function renderHero(heroImages, heroImgElement, heroThreePortraits, heroContainer) {
  if (!heroImages || !heroContainer) return;
  
  if (heroImages.type === 'three-portraits') {
    if (heroImgElement) heroImgElement.style.display = 'none';
    if (heroThreePortraits) {
      heroThreePortraits.classList.remove('hidden');
      heroThreePortraits.innerHTML = '';
      heroImages.images.forEach((img) => {
        const portraitDiv = document.createElement('div');
        portraitDiv.className = 'h-full relative overflow-hidden portrait-item';
        portraitDiv.style.width = '33.333%';
        portraitDiv.style.transition = 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        portraitDiv.style.willChange = 'width';
        portraitDiv.style.cursor = 'pointer';
        portraitDiv.style.flexShrink = '0';
        portraitDiv.dataset.aspectRatio = img.aspectRatio || '0.666667';
        const portraitImg = document.createElement('img');
        portraitImg.src = img.src;
        portraitImg.alt = img.alt || (typeof LanguageManager !== 'undefined' ? LanguageManager.get('showcase.heroAlt') : '');
        portraitImg.className = 'w-full h-full object-cover';
        portraitDiv.appendChild(portraitImg);
        heroThreePortraits.appendChild(portraitDiv);
      });
      startPortraitAnimation(heroThreePortraits, heroImages.images);
    }
  } else {
    if (heroThreePortraits) heroThreePortraits.classList.add('hidden');
    if (heroImgElement && heroImages.images[0]) {
      heroImgElement.style.display = 'block';
      heroImgElement.src = heroImages.images[0].src;
      heroImgElement.alt = heroImages.images[0].alt || (typeof LanguageManager !== 'undefined' ? LanguageManager.get('showcase.heroAlt') : '');
    }
    adjustHeroImageAspectRatio(heroImages, heroContainer, heroImgElement);
  }
}
