import gsap from 'gsap'
import create from '../utils/Create'
import { bg } from '../utils/BackgroundPath'

export default class Page {
  constructor({ elements = {}, id = 'default' } = {}) {
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
      loaderIcon: '[data-loader-icon]',
      linkTextChar: '[data-link-text] span',
      menuBg: '[data-nav-menu-bg]',
      navPreview: '[data-nav-menu-preview]',
      navItems: '.nav-menu__list-item',
      navLinks: '.nav-menu__list-item [data-page-trigger]',
      imageCover: '[data-image-cover]'
    }

    Page.prototype.create = create
    // this.loader = document.querySelector('[data-loader]')
    // this.loaderPath = document.querySelector('[data-preloader-bg]')
    this.pageTrigger = null
    this.pageTag = null
    this.heroImg = null
    this.tl = gsap.timeline()
    this.create()
  }

  getRotationAngle(element) {
    const computedStyle = window.getComputedStyle(element);
    const matrix = computedStyle.getPropertyValue('transform');

    if (matrix === 'none') {
      return 0; // No transformation applied, so no rotation
    }

    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);

    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle;
  }

  handlePageTransition(state, resolve) {
    let start = bg[state].start,
        middle = bg[state].middle,
        end = bg[state].end

    switch(this.pageTrigger) {
      case 'menu-link':
       this.menuTransition(state, resolve, { start, middle, end })
      break
      default:
        this.defaultTransition(state, resolve, { start, middle, end })
    }
  }
  show() {
    return new Promise(resolve => {
      //set scrolling to top of page - need to add this
      this.handlePageTransition('show', resolve)
    })
  }
  hide() {
    return new Promise(resolve => {
      this.handlePageTransition('hide', resolve)
    })
  }
  defaultTransition(state, resolve, { start, middle, end }) {
    if(!state) return
    
    switch (state) {
      case 'show':
        this.tl.set(this.elements.loaderBg, { attr: { d: start }})
        .to(this.elements.loaderBg, { duration: 0.8, attr: { d: middle }, ease: "power2.in" }, 0)
        .to(this.elements.loaderBg, { duration: 0.4, attr: { d: end }, ease: 'power4', 
          onComplete: () => {
            this.tl.set(this.elements.loader, { display: "none" })
            this.elements.body.classList.remove("no-scrolling")
          }})
      
        this.tl.to(this.elements.loaderIcon, { opacity: 0, duration: 0.4, ease: 'power2.out' }, "-=0.55 icon")
        this.tl.fromTo(this.elements.titleSpans, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", stagger: { amount: 0.4 }})

        this.tl.fromTo(this.elements.titleSpans, { y: "100%" }, { y: 0, duration: 0.65, ease: "power2.out", stagger: { amount: 0.5 }}, "<-0.1")

        this.tl.fromTo(this.elements.heroImgContainer, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)", duration: 0.6, stagger: { amount: 0.2 }, ease: "power2.out" }, "-=0.5")
        this.tl.fromTo(this.elements.imageCover, { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 0.4, stagger: { amount: 0.2 }, ease: "power2.out" }, '-=0.1')

        this.tl.fromTo(this.elements.heroImage, { scale: 2 }, { scale: 1, duration: 0.8, stagger: { amount: 0.2 }, ease: "power2.out" }, "-=0.4")
        this.tl.fromTo(this.elements.text, { y: "100%" }, { y: 0, duration: 0.5, ease: "power2.out", stagger: (index, target, list) => { return target.dataset.textReveal * 0.1}}, "-=0.2")

        if (this.elements.scrollBtnCircle) {
          this.tl.fromTo(this.elements.scrollBtnCircle, { strokeDashoffset: 2057, strokeDasharray: 2057 }, { strokeDashoffset:0, duration: 1.2, ease: "power2.out" }, "-=1");
          this.tl.fromTo(this.elements.scrollBtnArrow, { y: -100 }, { y: 0, duration: 0.4, ease: "power2.out" }, "-=0.6");
        }
      
        this.tl.fromTo(this.elements.navBar, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.2")
          .add(resolve)
      break
      case 'hide':
        this.elements.body.classList.add("no-scrolling")
        this.tl.set(this.elements.loaderBg, { attr: { d: start }})

        this.tl.to(this.elements.loader, { display: "block" })

        this.tl.to(this.elements.loaderBg, { duration: 0.8, attr: { d: middle }, ease: 'power4.in', delay: 0.1 }, 'transition')
        .to(this.elements.loaderBg, { duration: 0.4, attr: { d: end }, ease: 'power2.out' })

        this.tl.to(this.elements.transition, { y: "-100", duration: 1, ease: 'power4.in'}, 'transition')
          .add(resolve)
      break
      default:
        console.warn('A transition state (show / hide) has not been specified!')
        return
    }
  }

  menuTransition(state, resolve, { start, middle, end }) {
    switch (state) {
      case 'show':
        console.log('I am showing the next page')
        let y = this.heroImg.getBoundingClientRect().top,
            x = this.heroImg.getBoundingClientRect().left,
            width = this.heroImg.getBoundingClientRect().width,
            height = this.heroImg.getBoundingClientRect().height
            //rotationAngle = this.getRotationAngle(this.heroImg)
            
        //console.log(rotationAngle)
        this.tl.to(this.elements.navPreview, {
          y: `${y}px`,
          x: `${x}px`,
          ease: 'power2.out',
          duration: 0.8
        }).to(this.elements.navPreview, {
          width: `${width}px`,
          height: `${height}px`,
          ease: 'power2.out',
          duration: 0.8
        }, '-=0.3')



        
        // this.tl.set(this.elements.menuBg, { attr: { d: start }})
        // .to(this.elements.menuBg, { duration: 0.8, attr: { d: middle }, ease: "power2.in" }, 0)
        // .to(this.elements.menuBg, { duration: 0.4, attr: { d: end }, ease: 'power4', 
        //   onComplete: () => {
        //     console.log('menu closed')
        //     // this.elements.body.classList.remove("no-scrolling")
        // }})

        // this.tl.fromTo(this.elements.titleSpans, { y: "200%" }, { y: 0, duration: 0.65, ease: "power2.out", stagger: { amount: 0.6 }}, "-=0.2")
        // this.tl.fromTo(this.elements.text, { y: "100%" }, { y: 0, duration: 0.4, ease: "power2.out", stagger: (index, target, list) => { return target.dataset.textReveal * 0.1}}, "-=0.2")
      break
      case 'hide':
        const navPreviewChild = this.elements.navPreview.querySelector(`[data-tag-prev="${this.pageTag}"]`);

        this.tl.to(this.elements.navItems, { pointerEvents: "none"})
        this.tl.to(this.elements.navLinks, { pointerEvents: "none"})

        this.tl.fromTo(this.elements.linkTextChar, { y: 0 }, { y: "110%", ease: 'power2.out', duration: 0.4, stagger: { amount: 1 } })
        this.tl.to(this.elements.navPreview, { 
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          opacity: 1,
          duration: 0.6, 
          ease: "power3.out"
        })
        
        this.tl.to(navPreviewChild, { opacity: 1 }).add(resolve)
 
      break
      default:
        console.warn('A transition state (show / hide) has not been specified!')
        return
    } 
  }
}