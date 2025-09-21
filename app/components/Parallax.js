import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default class Parallax extends Components {
  constructor() {
    super({
      elements: {
        parallax: '[data-parallax]'
      }
    })

    gsap.registerPlugin(ScrollTrigger)
    this.defaults = {
      y: '-20%',
      speed: 0.9,
      trigger: '10% 60%',
      ease: 'power2.out'
    }

    this.init()
  }

  init() {
    if (!this.elements.parallax) {
      console.warn('⚠️ No elements found with data-parallax')
      return
    }

    // Support NodeList or single element
    const items = this.elements.parallax instanceof NodeList 
      ? this.elements.parallax 
      : [this.elements.parallax]

    items.forEach(element => {
      this.setupParallax(element)
    })
  }

  setupParallax(element) {
    const mm = gsap.matchMedia()

    // Check if element has responsive config via data-parallax-config
    // Example: data-parallax-config='{"(max-width: 768px)": {"y": "-10%"}}'
    const configAttr = element.dataset.parallaxConfig
    const config = configAttr ? JSON.parse(configAttr) : {}

    mm.add("(min-width: 0px)", () => {
      this.animateElement(element, {})
    })

    Object.keys(config).forEach(query => {
      mm.add(query, () => {
        this.animateElement(element, config[query])
      })
    })
  }

  animateElement(element, overrides = {}) {
  // STEP 1: start with defaults
  let settings = {
    y: this.defaults.y,
    speed: this.defaults.speed,
    trigger: this.defaults.trigger,
    ease: this.defaults.ease
  }

  // STEP 2: override with data attributes
  if (element.dataset.parallax) {
    settings.y = `-${element.dataset.parallax}%`
  }
  if (element.dataset.parallaxSpeed) {
    settings.speed = parseFloat(element.dataset.parallaxSpeed)
  }
  if (element.dataset.parallaxTrigger) {
    settings.trigger = element.dataset.parallaxTrigger
  }

  // STEP 3: responsive config overrides
  if (overrides.y !== undefined) {
    // normalize y → if it's a number-like string, add "%"
    if (!isNaN(overrides.y)) {
      settings.y = `${overrides.y}%`
    } else {
      settings.y = overrides.y // already valid
    }
  }
  if (overrides.speed !== undefined) settings.speed = overrides.speed
  if (overrides.trigger !== undefined) settings.trigger = overrides.trigger
  if (overrides.ease !== undefined) settings.ease = overrides.ease

  // Kill any existing animations/ScrollTriggers for this element
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger === element) trigger.kill()
  })

  // Apply GSAP animation
  gsap.to(element, {
    y: settings.y,
    ease: settings.ease,
    duration: settings.speed,
    scrollTrigger: {
      trigger: element,
      start: settings.trigger,
      scrub: true
    }
  })
  }

}