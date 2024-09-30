import gsap from 'gsap'
import create from '../utils/Create'

export default class Page {
  constructor({ elements, id }) {
    this.id = id
    this.selectors = { 
      ...elements,
      loader: '[data-loader]',
      loaderBg: '[data-preloader-bg]',
      body: '[data-body]',
      scrollBtnCircle: '[data-scroll-btn-circle]',
      scrollBtnArrow: '[data-scroll-btn-arrow]',
      navBar: '[data-nav-bar]',
      titleSpans: '[data-title-reveal]',
      text: '[data-text-reveal]',
      heroImage: '[data-hero-image]',
      heroImgContainer: '[data-hero-image-container]',
      loaderIcon: '[data-loader-icon]'
    }

    Page.prototype.create = create
    // this.loader = document.querySelector('[data-loader]')
    // this.loaderPath = document.querySelector('[data-preloader-bg]')
    
    this.tl = gsap.timeline()
    this.create()
  }
  show() {
    let start = "M 0 0 V 100 Q 50 100 100 100 V 0 z",
        middle = "M 0 0 V 50 Q 50 0 100 50 V 0 z",
        end = "M 0 0 V 0 Q 50 0 100 0 V 0 z"
    
    return new Promise(resolve => {
      //set scrolling to top of page - need to add this
      this.tl.set(this.elements.loaderBg, { attr: { d: start }})
      .to(this.elements.loaderBg, { duration: 0.8, attr: { d: middle }, ease: "power2.in" }, 0)
      .to(this.elements.loaderBg, { duration: 0.4, attr: { d: end }, ease: 'power4', 
        onComplete: () => {
          this.tl.set(this.elements.loader, { display: "none" })
          this.elements.body.classList.remove("no-scrolling")
        }})
      
      this.tl.to(this.elements.loaderIcon, { opacity: 0, duration: 0.4, ease: 'power2.out' }, "-=0.55 icon")
      this.tl.fromTo(this.elements.titleSpans, { y: "200%" }, { y: 0, duration: 0.65, ease: "power2.out", stagger: { amount: 0.6 }}, "-=0.2")
      this.tl.fromTo(this.elements.text, { y: "100%" }, { y: 0, duration: 0.4, ease: "power2.out", stagger: (index, target, list) => { return target.dataset.textReveal * 0.1}}, "-=0.2")
      this.tl.fromTo(this.elements.heroImgContainer, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)", duration: 0.6, stagger: { amount: 0.4 }, ease: "power2.out" }, "-=1")
      this.tl.fromTo(this.elements.heroImage, { scale: 2 }, { scale: 1, duration: 0.8, stagger: { amount: 0.4 }, ease: "power2.out" }, "-=1")

      if (this.elements.scrollBtnCircle) {
        this.tl.fromTo(this.elements.scrollBtnCircle, { strokeDashoffset: 2057, strokeDasharray: 2057 }, { strokeDashoffset:0, duration: 1.2, ease: "power2.out" }, "-=1");
        this.tl.fromTo(this.elements.scrollBtnArrow, { y: -100 }, { y: 0, duration: 0.4, ease: "power2.out" }, "-=0.6");
      }
    
      this.tl.fromTo(this.elements.navBar, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.2")
    })
  }
  hide() {
    let start = 'M 0 100 V 100 Q 50 100 100 100 V 100 z',
        middle = 'M 0 100 V 50 Q 50 0 100 50 V 100 z',
        end = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'
    
    return new Promise(resolve => {
      this.elements.body.classList.add("no-scrolling")
      this.tl.set(this.elements.loaderBg, { attr: { d: start }})

      this.tl.to(this.elements.loader, { display: "block" })

      this.tl.to(this.elements.loaderBg, { duration: 0.8, attr: { d: middle }, ease: 'power4.in', delay: 0.1 }, 'transition')
      .to(this.elements.loaderBg, { duration: 0.4, attr: { d: end }, ease: 'power2.out' })

      this.tl.to(this.elements.transition, { y: "-100", duration: 1, ease: 'power4.in', onComplete: resolve }, 'transition')
      //this.tl.to(this.element, { autoAlpha: 0, onComplete: resolve })
    })
  }
}