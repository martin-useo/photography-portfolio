import { isMobile, isTablet, isDesktop, BREAKPOINTS } from './breakpoints.js';

export function detectDevice() {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent;
  
  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    width,
    isIOS: /iPhone|iPad|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
    breakpoint: width < BREAKPOINTS.tablet ? 'mobile' : (width < BREAKPOINTS.desktop ? 'tablet' : 'desktop')
  };
}

export function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}


export function detectDevice() {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent;
  
  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    width,
    isIOS: /iPhone|iPad|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
    breakpoint: width < BREAKPOINTS.tablet ? 'mobile' : (width < BREAKPOINTS.desktop ? 'tablet' : 'desktop')
  };
}

export function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}


export function detectDevice() {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent;
  
  return {
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    width,
    isIOS: /iPhone|iPad|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
    breakpoint: width < BREAKPOINTS.tablet ? 'mobile' : (width < BREAKPOINTS.desktop ? 'tablet' : 'desktop')
  };
}

export function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

