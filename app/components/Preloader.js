import Components from 'classes/Components'
import gsap from 'gsap'

export default class Preloader extends Components {
  constructor(){
     super({
      elements: {
        loader: '[data-loader]', 
        background: '[data-preloader-bg]',
        titleSpans: '[data-title-reveal]',
        imageReveal: '[data-image-reveal]',
        heroImage: '[data-hero-image]',
        navBar: '[data-nav-bar]',
        text: '[data-text-reveal]',
        loaderIcon: '[data-loader-icon]',
        loaderIconCircle: '[data-loader-spinner-circle]',
        loaderIconSpinner: '[data-loader-spinner]',
        body: '[data-body]',
        scrollBtnCircle: '[data-scroll-btn-circle]',
        scrollBtnArrow: '[data-scroll-btn-arrow]'
      }
    })
    
    this.start = "M 0 0 V 100 Q 50 100 100 100 V 0 z"
    this.middle = "M 0 0 V 50 Q 50 0 100 50 V 0 z"
    this.end = "M 0 0 V 0 Q 50 0 100 0 V 0 z"

    this.LSPINNER_WIDTH = this.elements.loaderIconSpinner.getBoundingClientRect().width;
    this.LSPINNER_WIDTH_RULE = this.LSPINNER_WIDTH / 10;
    this.LSPINNER_RADIUS = (this.LSPINNER_WIDTH / 2) - (this.LSPINNER_WIDTH_RULE / 2) ;
    this.LSPINNER_CIRCUMFERENCE = 2 * Math.PI * this.LSPINNER_RADIUS;

    this.tl = gsap.timeline()
    this.elements.loaderIconCircle.style.strokeDasharray = this.LSPINNER_CIRCUMFERENCE;
    this.calculatePageLoadTime(0);
  }

  calculatePageLoadTime(progress) {
    this.updateLoading(progress);
    progress++;

    let timer = setTimeout(() => {
      this.calculatePageLoadTime(progress);
    }, 30);

    if(progress > 100) {
      clearInterval(timer);
      this.animate();
    }
  }

  updateLoading(amount) {
    let progress = amount / 100;
    let dashoffset = this.LSPINNER_CIRCUMFERENCE * (1 - progress);
    this.elements.loaderIconCircle.style.strokeDashoffset = dashoffset;
  }

  animate () {
    this.tl.set(this.elements.background, { attr: { d: this.start }})
           .to(this.elements.background, { duration: 0.8, attr: { d: this.middle }, ease: "power2.in" }, 0)
           .to(this.elements.background, { duration: 0.3, attr: { d: this.end }, ease: 'power4', 
           .to(this.elements.background, { duration: 0.4, attr: { d: this.end }, ease: 'power4', 
              onComplete: () => {
                this.tl.set(this.elements.loader, { display: "none" })
                this.elements.body.classList.remove("no-scrolling")
              }
            })
    this.tl.to(this.elements.loaderIcon, { opacity: 0, duration: 0.4, ease: 'power3.out' }, "-=0.4 icon")
    this.tl.fromTo(this.elements.titleSpans, { y: "200%" }, { y: 0, duration: 0.65, ease: "power2.easeOut", stagger: { amount: 0.6 }}, "-=0.2")
    this.tl.fromTo(this.elements.text, { y: "100%" }, { y: 0, duration: 0.4, ease: "power2.easeOut", stagger: (index, target, list) => { return target.dataset.textReveal * 0.1}}, "-=0.2")
    this.tl.fromTo(this.elements.heroImage, { backgroundSize: "200%" }, { backgroundSize: "100%", duration: 0.8, ease: "power2.easeOut" }, "-=0.3")
    this.tl.to(this.elements.imageReveal, { height: 0, duration: 0.6, ease: "power2.easeOut", stagger: { amount: 0.4 } }, "-=1")
    this.tl.to(this.elements.loaderIcon, { opacity: 0, duration: 0.4, ease: 'power2.out' }, "-=0.55 icon")
    this.tl.fromTo(this.elements.titleSpans, { y: "200%" }, { y: 0, duration: 0.65, ease: "power2.out", stagger: { amount: 0.6 }}, "-=0.2")
    this.tl.fromTo(this.elements.text, { y: "100%" }, { y: 0, duration: 0.4, ease: "power2.out", stagger: (index, target, list) => { return target.dataset.textReveal * 0.1}}, "-=0.2")
    this.tl.fromTo(this.elements.heroImage, { backgroundSize: "200%" }, { backgroundSize: "100%", duration: 0.8, ease: "power2.out" }, "-=0.3")
    this.tl.to(this.elements.imageReveal, { height: 0, duration: 0.6, ease: "power2.out", stagger: { amount: 0.4 } }, "-=1")
    
    if (this.elements.scrollBtnCircle) {
      this.tl.fromTo(this.elements.scrollBtnCircle, { strokeDashoffset: 2057, strokeDasharray: 2057 }, { strokeDashoffset:0, duration: 1.2, ease: "power2.out" }, "-=1");
      this.tl.fromTo(this.elements.scrollBtnArrow, { y: -100 }, { y: 0, duration: 0.4, ease: "power2.out" }, "-=0.6");
    }
    
    this.tl.fromTo(this.elements.navBar, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.easeOut" }, "-=0.2")
    this.tl.fromTo(this.elements.navBar, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.2")
  }
}

