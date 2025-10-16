/**
 * Returns true if the current device supports touch input.
 * Checks both runtime capabilities and Modernizr class if present.
 */
export default function isTouchDevice() {
  const hasTouchEvents = 'ontouchstart' in window;
  const hasTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
  const hasTouchClass = document.documentElement.classList.contains('touch');

  const isSmallViewport = window.innerWidth <= 768;

  return hasTouchEvents || hasTouchPoints || hasTouchClass || isSmallViewport;
}