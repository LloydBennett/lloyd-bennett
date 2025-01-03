import LocomotiveScroll from 'locomotive-scroll'

export let scroll = new LocomotiveScroll( {
  el: document.querySelector('[data-scroll-container]'),
  smooth: true
})