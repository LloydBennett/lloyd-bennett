/**
 * Returns true if the current device supports touch input.
 * Checks both runtime capabilities and Modernizr class if present.
 */
export default function isTouchDevice() {
  const hasTouchEvents = 'ontouchstart' in window;
  const hasTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
  const hasTouchClass = document.documentElement.classList.contains('touch');

  return hasTouchEvents || hasTouchPoints || hasTouchClass;
}

export function isSmallViewport() {
  return window.innerWidth <= 768;
}