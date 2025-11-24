export function getHeroImages(allImages) {
  if (allImages.length > 0) {
    const fiveStarImages = allImages.filter(img => img.rating === 5);
    const sourceImages = fiveStarImages.length > 0 ? fiveStarImages : allImages;
    return { 
      type: 'single', 
      images: [sourceImages[Math.floor(Math.random() * sourceImages.length)]]
    };
  }
  return null;
}

export function adjustHeroImageAspectRatio(heroImages, heroContainer, heroImgElement) {
  if (!heroImages || !heroContainer) return;
  
  if (heroImages.type === 'single' && heroImages.images[0]?.aspectRatio) {
    heroContainer.style.aspectRatio = `${heroImages.images[0].aspectRatio}`;
    if (heroImgElement) {
      heroImgElement.style.objectFit = 'contain';
    }
  } else {
    heroContainer.style.aspectRatio = '';
    if (heroImgElement) {
      heroImgElement.style.objectFit = 'cover';
    }
  }
}

export function renderHero(heroImages, heroImgElement, heroThreePortraits, heroContainer) {
  if (!heroImages || !heroContainer) return;
  
  if (heroThreePortraits) {
    heroThreePortraits.classList.add('hidden');
  }
  
  if (heroImgElement && heroImages.images[0]) {
    heroImgElement.style.display = 'block';
    heroImgElement.src = heroImages.images[0].src;
    heroImgElement.alt = heroImages.images[0].alt || (typeof LanguageManager !== 'undefined' ? LanguageManager.get('showcase.heroAlt') : '');
  }
  
  adjustHeroImageAspectRatio(heroImages, heroContainer, heroImgElement);
}
