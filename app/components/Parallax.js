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
    };

    this.init();
  }

  init() {
    if (!this.elements.parallax) {
      console.warn('⚠️ No elements found with data-parallax');
      return
    }

    const items = this.elements.parallax instanceof NodeList
      ? this.elements.parallax
      : [this.elements.parallax]

    items.forEach(element => this.setupParallax(element));
  }

  setupParallax(element) {
    const mm = gsap.matchMedia();
    const configAttr = element.dataset.parallaxConfig;
    const config = configAttr ? JSON.parse(configAttr) : {};

    const queries = Object.keys(config).length ? config : { "(min-width: 0px)": {} };

    Object.entries(queries).forEach(([query, overrides]) => {
      mm.add(query, context => {
        // Inherit element-wide scrub if not defined in media query
        if (overrides.scrub === undefined && element.dataset.parallaxScrub) {
          const scrubVal = element.dataset.parallaxScrub;
          overrides.scrub = scrubVal === "true" ? true : parseFloat(scrubVal);
        }

        const ctx = gsap.context(() => this.animateElement(element, overrides));
        return () => ctx.revert();
      });
    });
  }

  animateElement(element, overrides = {}) {
    let settings = {
      y: this.defaults.y,
      speed: this.defaults.speed,
      trigger: this.defaults.trigger,
      ease: this.defaults.ease,
      scrub: false
    };

    // Element-wide attributes
    if (element.dataset.parallax) settings.y = `-${element.dataset.parallax}%`;
    if (element.dataset.parallaxSpeed) settings.speed = parseFloat(element.dataset.parallaxSpeed);
    if (element.dataset.parallaxTrigger) settings.trigger = element.dataset.parallaxTrigger;
    if (element.dataset.parallaxEase) settings.ease = element.dataset.parallaxEase;

    // Media query overrides
    Object.assign(settings, overrides);

    // Normalize scrub
    if (settings.scrub !== undefined) {
      settings.scrub = settings.scrub === true || settings.scrub === "true"
        ? true
        : parseFloat(settings.scrub) || false;
    }

    if (typeof settings.y === "string" && !settings.y.includes("%")) {
      settings.y = `-${settings.y}%`;
    }

    // Decide mode: scrub vs classic toggle
    if (settings.scrub) {
      gsap.to(element, {
        y: settings.y,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: settings.trigger,
          scrub: settings.scrub,
          fastScrollEnd: true
        }
      });
    } else {
      gsap.to(element, {
        y: settings.y,
        ease: settings.ease,
        duration: settings.speed,
        scrollTrigger: {
          trigger: element,
          start: settings.trigger,
          toggleActions: "play reverse play reverse"
        }
      });
    }
  }
}