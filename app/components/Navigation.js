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
        navLinkSpans: '.nav-menu__list-item [data-page-trigger] span',
        linkTextChar: '[data-link-text] span',
        menuMove: '[data-menu-move]',
        imgPreview: '[data-nav-menu-preview]',
        imgPrevBelt: '[data-nav-menu-prev-belt]',
        cursor: '[data-cursor]'
      }
    })

    this.isAnimating = false
    this.isMenuOpen = false
    this.insideProject = false
    this.svgPath = {}
    this.linkSpans = []
    this.indexCache = 0
    this.addEventListeners()
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

    this.intialiseNavLinks()
  }

  intialiseNavLinks() {
    this.elements.navLinks.forEach((project, i) => {
      let tag = project.dataset.tag
            
      project.addEventListener('mousemove', (e) => {
        this.handleMouseMove(e)
        this.showNavPreview()
        this.moveProjectImg(i);
      })

      project.addEventListener('mouseleave', () => {
        this.hideNavPreview()
      })
    })
  }

  animate() {
    this.isAnimating = true
    let tl = gsap.timeline()

    tl.to(this.elements.navBar, { duration: 0.3, opacity: 0, ease: "power2.out", onComplete: () => {
      this.elements.navBar.classList.toggle('inverted')
    }}
  )
    this.isMenuOpen? this.closeMenu() : this.openMenu()
    this.elements.body.classList.toggle('no-scrolling')
    this.elements.navMenu.classList.toggle('menu-is-open')
  }

  openMenu() {
    let tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false
      }
    })

    this.svgPath.start = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'
    this.svgPath.middle = 'M 0 100 V 50 Q 50 0 100 50 V 100 z'
    this.svgPath.end = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'

    tl.set(this.elements.bg, { attr: { d: this.svgPath.start }})
    tl.fromTo(this.elements.navMenu, { duration: 0.4, opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible" } , "-=0.8")
    
    tl.to(this.elements.bg, { duration: 0.8, attr: { d: this.svgPath.middle }, ease: "power4.in", delay: 0.1 }, "elements")
      .to(this.elements.bg, { duration: 0.4, attr: { d: this.svgPath.end }, ease: "power2.out", onComplete: () => { this.elements.cursor.classList.add("cursor--inverted")} })
    tl.to(this.elements.menuMove, { y: "-100", duration: 1, ease: 'power4.in'}, "elements")
    
    tl.fromTo(this.elements.linkTextChar, { y: "110%" }, { y: 0, ease: 'power2.out', duration: 0.4, stagger: { amount: 1 } })

    tl.to(this.elements.navBar, { duration: 0.6, opacity: 1, ease: "power2.out" }, '-=0.3 nav')
  }

  closeMenu() {
    let tl = gsap.timeline({
      onComplete: () => this.isAnimating = false
    })

    this.svgPath.start = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'
    this.svgPath.middle = 'M 0 100 V 50 Q 50 0 100 50 V 100 z'
    this.svgPath.end = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'

    tl.set(this.elements.bg, { attr: { d: this.svgPath.start }})
    
    tl.to(this.elements.linkTextChar, { y: "110%", ease: 'power2.out', duration: 0.4, stagger: { amount: 0.5 } })

    setTimeout(() => {
      this.elements.cursor.classList.remove("cursor--inverted")  
    }, 400);

    tl.to(this.elements.bg, { duration: 0.8, attr: { d: this.svgPath.middle }, ease: "power4.in" }, "-=1.1")
      .to(this.elements.bg, { duration: 0.4, attr: { d: this.svgPath.end }, ease: "power2.out" }, "-=0.3")
    
    tl.to(this.elements.menuMove, { y: 0, duration: 1, ease: 'power4.out'}, '-=0.5')
    
    tl.to(this.elements.navBar, { duration: 0.6, opacity: 1, ease: "power2.out" }, '-=0.3 nav')

    tl.to(this.elements.navMenu, { duration: 0.6, opacity: 0, visibility: "hidden" })
  }

  showNavPreview() {
    if (!this.insideProject) {
      this.insideProject = true;
      gsap.to(this.elements.imgPreview, {
        scale: 1,
        duration: 0.3,
        ease: "Power2.out"
      })
    }
  }

  hideNavPreview() {
    if (this.insideProject) {
      this.insideProject = false;
      gsap.to(this.elements.imgPreview, {
        scale: 0,
        duration: 0.3,
        ease: "Power2.out"
      })
    }
  }

  handleMouseMove(e) {
    const previewRect = this.elements.imgPreview.getBoundingClientRect()
    const offsetX = previewRect.width / 2
    const offsetY = previewRect.height / 2
    const x = e.pageX - offsetX
    const y = e.pageY - offsetY

    gsap.to(this.elements.imgPreview, { 
      x: x, 
      y: y,
      duration: 0.4,
      ease: "power3.out"
    })
  }

  moveProjectImg(i) {
    let yPos = `-${this.elements.imgPreview.offsetHeight * i}`
    
    console.log(`last index: ${this.indexCache}`, `new index: ${i}`)

    if(i !== this.indexCache) {
      gsap.to(this.elements.imgPrevBelt, { 
        y: yPos,
        duration: 0.4,
        ease: "power2.out"
      })

      this.indexCache = i
    }
  }
}