import Components from 'classes/Components'
import gsap from 'gsap'

export default class Navigation extends Components {
  constructor() {
    super({
      elements: {
        navMenu: '[data-nav-menu]',
        trigger: '[data-nav-trigger]',
        body: '[data-body]',
        bg: '[data-nav-menu-bg]',
        navBar: '[data-nav-bar]',
        linkText: '[data-link-text]',
        navLinks: '.nav-menu__list-item [data-page-trigger]',
        linkTextChar: '[data-link-text] span',
        menuMove: '[data-menu-move]'
      }
    })

    this.isAnimating = false
    this.isMenuOpen = false
    
    this.svgPath = {}
    this.linkSpans = []

  }

  create() {
    super.create()
  }

  addEventListeners() {
    this.elements.trigger.addEventListener('click', (e) => {
      if (this.isAnimating) return
      this.animate()
      this.isMenuOpen = !this.isMenuOpen
    })

    //this.intialiseNavLinks()
  }

  intialiseNavLinks() {
    let elTl = gsap.timeline()

    this.elements.navLinks.forEach((element, id) => { 
      let imagePrev = document.querySelectorAll('.nav-menu__list-img')[id]

      let currentSpan = element.querySelectorAll('span')
      
      let imageBounds = imagePrev.getBoundingClientRect()
      console.log(imagePrev.clientHeight)
      
      element.addEventListener('mousemove', (e) => {
        //let bounds = e.target.getBoundingClientRect()

        
        this.getPos(e, imagePrev, imageBounds)
      })

      element.addEventListener('mouseenter', (e) => {
        
        elTl.to(this.linkSpans, { duration: 0.3, color: COLOUR_GRIT_300 }, 'hover-link')
        elTl.to(currentSpan, { duration: 0.3, color: COLOUR_WHITE }, 'hover-link')
        
        gsap.set(imagePrev, { scale: 0.8, xPercent: 25, yPercent: 50, rotation: -15 })
        gsap.to(imagePrev, { duration: 0.1, opacity: 1 , scale: 1, yPercent: 0, rotation: 0 })
      })

      element.addEventListener('mouseleave', () => {
        gsap.to(imagePrev, { duration: 0.1, opacity: 0, scale: 0.8, xPercent: 25, yPercent: 50, rotation: -15 })
        gsap.to(this.linkSpans, { duration: 0.3, color: COLOUR_WHITE })
      }) 

    })
  }

  animate() {
    this.isAnimating = true
    let tl = gsap.timeline()

    tl.to(this.elements.navBar, { duration: 0.3, opacity: 0, ease: "power2.out" })
    this.elements.navBar.classList.toggle('inverted')
    this.isMenuOpen? this.closeMenu() : this.openMenu()
  }
  openMenu() {
    let tl = gsap.timeline({
      onComplete: () => this.isAnimating = false
    })

    this.svgPath.start = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'
    this.svgPath.middle = 'M 0 100 V 50 Q 50 0 100 50 V 100 z'
    this.svgPath.end = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'

    tl.set(this.elements.bg, { attr: { d: this.svgPath.start }})
    tl.fromTo(this.elements.navMenu, { duration: 0.4, opacity: 0, display: "none" }, { opacity: 1, display: "block" } , "-=0.8")
    
    tl.to(this.elements.bg, { duration: 0.8, attr: { d: this.svgPath.middle }, ease: "power4.in", delay: 0.1 }, "elements")
      .to(this.elements.bg, { duration: 0.4, attr: { d: this.svgPath.end }, ease: "power2.out" })
    tl.to(this.elements.menuMove, { y: "-100", duration: 1, ease: 'power4.in'}, "elements")
    
    tl.fromTo(this.elements.linkTextChar, { y: "110%" }, { y: 0, ease: 'power2.out', duration: 0.6, stagger: { amount: 1 } })

    tl.to(this.elements.navBar, { duration: 0.6, opacity: 1, ease: "power2.out" }, '-=0.3 nav')
  }
  closeMenu() {
    let tl = gsap.timeline({
      onComplete: () => this.isAnimating = false
    })

    this.elements.navLinks.forEach((els) => {
    this.svgPath.start = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'
    this.svgPath.middle = 'M 0 100 V 50 Q 50 0 100 50 V 100 z'
    this.svgPath.end = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'

      let spans = els.querySelectorAll('span')
    tl.set(this.elements.bg, { attr: { d: this.svgPath.start }})
    
      this.tl.fromTo(spans, { duration: 0.4, y: "100%" }, { y: 0, stagger: 0.03 }, "startTime-=0.3")
    tl.to(this.elements.linkTextChar, { y: "110%", ease: 'power2.out', duration: 0.6, stagger: { amount: 0.5 } })

    })
    tl.to(this.elements.bg, { duration: 0.8, attr: { d: this.svgPath.middle }, ease: "power2.in" }, "-=0.5")
      .to(this.elements.bg, { duration: 0.4, attr: { d: this.svgPath.end }, ease: "power4" })
    tl.to(this.elements.bg, { duration: 0.8, attr: { d: this.svgPath.middle }, ease: "power4.in" }, "-=0.8")
      .to(this.elements.bg, { duration: 0.4, attr: { d: this.svgPath.end }, ease: "power2.out" })

    tl.to(this.elements.menuMove, { y: 0, duration: 1, ease: 'power4.out'}, '-=1')

    tl.to(this.elements.navBar, { duration: 0.6, opacity: 1, ease: "power2.out" }, '-=0.3 nav')

    tl.to(this.elements.navMenu, { duration: 0.4, opacity: 0, display: "none" })
  }

  getPos( e, el, imgDimension) {
    // Get coordinates for the current cursor position
    let x = e.x
    let y = e.y

    //console.log(e)

    // image y pos = height of the image / position of the menu link
    // image x pos = width of the menu link, 
    
    let elBounds = e.target.getBoundingClientRect()
    //let yOffset = elBounds.top / iBounds.height
    //yOffset = gsap.utils.mapRange(0, 1.5, -150, 150, yOffset)

    console.log(imgDimension)
    // gsap.to(el, {
    //   duration: 0.8,
    //   x: Math.abs(x - elBounds.left) - imgDimension.width / 2,
    //   y: Math.abs(y - elBounds.top) - imgDimension.height / 2,
    // })

    gsap.to(el, {
      duration: 0.8,
      x: Math.abs(x - elBounds.width) /  256,
      y: Math.abs(y - elBounds.top) - 304
    })

    //console.log(`x: ${Math.abs(x - elBounds.left) - imgDimension.width / 2}`)

    // this.animatableProperties.ty.current = Math.abs(mousepos.y - this.bounds.el.top) - this.bounds.reveal.height/2;
    // this.animatableProperties.tx.current = Math.abs(mousepos.x - this.bounds.el.left) - this.bounds.reveal.width/2;

    // gsap.to(el, {
    //   duration: 1.25,
    //   x: Math.abs(x - elBounds.left) - iBounds.width / 1.55,
    //   y: Math.abs(y - elBounds.top) - iBounds.height / 2 - yOffset
    // })
    
    // var xPos = 0,
    //     yPos = 0;

    // let centerY = trigger.offsetTop + trigger.offsetHeight / 2;
    
    // xPos = (el.offsetLeft - el.scrollLeft + el.clientLeft);
    // //yPos = (el.offsetTop - el.scrollTop + el.clientTop);
    
    // yPos = (((el.offsetTop - el.scrollTop) - centerY) + el.clientTop);
    // var mouseX = e.clientX - xPos,
    //     mouseY = e.clientY - yPos; 
    
    // el.style.top = '' + mouseY + 'px';
    // el.style.left = '' + mouseX + 'px';
  }
}