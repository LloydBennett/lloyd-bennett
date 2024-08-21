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
        cursor: '[data-cursor]'
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

    this.intialiseNavLinks()
  }

  intialiseNavLinks() {
    let elTl = gsap.timeline()

    this.elements.navLinks.forEach((element, id) => {
      let tag = element.dataset.tag
      let imagePrev = document.querySelector(`[data-tag-prev=${tag}]`)
      let imageH = this.elements.imgPreview.offsetHeight
      let imageW = this.elements.imgPreview.offsetWidth
      
      const hoverAnim = (e) => {
        // add a delay if animating is true then wait until its false
        gsap.to(imagePrev, { opacity: 1 })
        gsap.to(this.elements.imgPreview, { 
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)", 
          duration: 0.6, 
          ease: "power3.out"
        })
        gsap.to(this.elements.cursor, { opacity: 0 })
      }

      const hoverOutAnim = (e) => {
        gsap.to(this.elements.imgPreview, 
        { 
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", 
          duration: 0.6, 
          ease: "power3.out" 
        })
        gsap.to(imagePrev, { opacity: 0 })
        gsap.to(this.elements.cursor, { opacity: 1 })
      }
      
      element.addEventListener('mouseover', hoverAnim)
      element.addEventListener('mouseout', hoverOutAnim)
      
      document.addEventListener('mousemove', (e) => {
        let x = e.clientX - (imageW / 2)
        let y = e.clientY - (imageH / 2)

        
        gsap.to(this.elements.imgPreview, { 
          x: x, 
          y: y,
          rotate: "4deg",
          duration: 0.8,
          ease: "power3.out"
        })
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
    this.elements.navMenu.classList.add('is-animating')
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
}