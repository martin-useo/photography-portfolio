export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

export function isMobile() {
  return window.innerWidth < BREAKPOINTS.MD;
}

export function isTablet() {
  return window.innerWidth >= BREAKPOINTS.SM && window.innerWidth < BREAKPOINTS.LG;
}

export function isDesktop() {
  return window.innerWidth >= BREAKPOINTS.MD;
}
