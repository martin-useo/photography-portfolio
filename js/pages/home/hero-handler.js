import { getHeroImages as getMobileHeroImages, renderHero as renderMobileHero, adjustHeroImageAspectRatio as adjustMobileHeroAspectRatio } from './mobile/hero-handler.js';
import { getHeroImages as getDesktopHeroImages, renderHero as renderDesktopHero, adjustHeroImageAspectRatio as adjustDesktopHeroAspectRatio, stopPortraitAnimation } from './desktop/hero-handler.js';

export { stopPortraitAnimation };

function isDesktop() {
  if (typeof window !== 'undefined' && typeof window.isDesktop === 'function') {
    return window.isDesktop();
  }
  return window.innerWidth >= 768;
}

export function getHeroImages(allImages) {
  if (isDesktop()) {
    return getDesktopHeroImages(allImages);
  }
  return getMobileHeroImages(allImages);
}

export function renderHero(heroImages) {
  const heroImgElement = document.getElementById('hero-image');
  const heroThreePortraits = document.getElementById('hero-three-portraits');
  const heroContainer = document.getElementById('hero-container');
  
  if (!heroContainer) return;
  
  if (isDesktop()) {
    renderDesktopHero(heroImages, heroImgElement, heroThreePortraits, heroContainer);
  } else {
    renderMobileHero(heroImages, heroImgElement, heroThreePortraits, heroContainer);
  }
}

export function adjustHeroImageAspectRatio(heroImages) {
  const heroImgElement = document.getElementById('hero-image');
  const heroContainer = document.getElementById('hero-container');
  
  if (!heroContainer) return;
  
  if (isDesktop()) {
    adjustDesktopHeroAspectRatio(heroImages, heroContainer, heroImgElement);
  } else {
    adjustMobileHeroAspectRatio(heroImages, heroContainer, heroImgElement);
  }
}
