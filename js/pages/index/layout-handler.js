import { isMobile } from '../../responsive/breakpoints.js';
import { MOBILE_LAYOUTS, organizeImagesForLayout as organizeMobileImages, createLayoutStructure as createMobileLayout } from './mobile/layouts.js';
import { DESKTOP_LAYOUTS, organizeImagesForLayout as organizeDesktopImages, createLayoutStructure as createDesktopLayout } from './desktop/layouts.js';

export { MOBILE_LAYOUTS, DESKTOP_LAYOUTS };

export function getRandomLayout() {
  // Utiliser window.isMobile si disponible, sinon utiliser la fonction importée
  const checkIsMobile = (typeof window !== 'undefined' && typeof window.isMobile === 'function') 
    ? window.isMobile 
    : isMobile;
  
  if (checkIsMobile()) {
    if (MOBILE_LAYOUTS.length === 0) {
      return null;
    }
    return MOBILE_LAYOUTS[Math.floor(Math.random() * MOBILE_LAYOUTS.length)];
  } else {
    if (DESKTOP_LAYOUTS.length === 0) {
      return null;
    }
    return DESKTOP_LAYOUTS[Math.floor(Math.random() * DESKTOP_LAYOUTS.length)];
  }
}

export function organizeImagesForLayout(layout, cachedPortraitImages, cachedLandscapeImages) {
  // Déterminer si c'est mobile ou desktop basé sur le layout
  const isMobileLayout = layout.isMobile === true;
  const isDesktopLayout = !isMobileLayout;
  
  if (isMobileLayout) {
    return organizeMobileImages(layout, cachedPortraitImages, cachedLandscapeImages);
  } else if (isDesktopLayout) {
    return organizeDesktopImages(layout, cachedPortraitImages, cachedLandscapeImages);
  } else {
    return [];
  }
}

export function createLayoutStructure(layout, organizedImages, loadThumbnailForCanvas) {
  if (layout.isMobile) {
    return createMobileLayout(layout, organizedImages, loadThumbnailForCanvas);
  } else {
    return createDesktopLayout(layout, organizedImages, loadThumbnailForCanvas);
  }
}
