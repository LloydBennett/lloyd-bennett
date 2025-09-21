import Components from 'classes/Components'
import gsap from 'gsap'
import { scroll } from 'utils/LenisScroll'

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
        cursor: '[data-cursor]'
      }
    })

    this.isAnimating = false
    this.isMenuOpen = false
    this.svgPath = {}
    this.linkSpans = []
    this.scrollPosition = 0
    this.lScroll = scroll
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
    this.elements.navLinks.forEach((link, i) => {
      const parentItem = link.closest('[data-nav-menu-item]')
      const underline = parentItem?.querySelector('[data-nav-link-line]')
      const imgPrev = parentItem?.querySelector('[data-nav-menu-preview]')

      const handleMouseMove = (e, setNow = false) => {
        const linkRect = link.getBoundingClientRect()
        const previewRect = imgPrev.getBoundingClientRect()

        const relX = e.clientX - linkRect.left
        const relY = e.clientY - linkRect.top

        const x = relX - previewRect.width / 2
        const y = relY - previewRect.height / 2

        if(!setNow) {
          gsap.to(imgPrev, { 
            x: x, 
            y: y,
            duration: 0.3,
            ease: "power3.out"
          })
        }
        else {
          gsap.set(imgPrev, { x, y })
        }
      }
      
      link.addEventListener('mouseenter', (e) => {
        this.elements.navLinks.forEach(otherLink => {
          if (otherLink !== link) {
            otherLink.classList.add('is-disabled')
          } else {
            otherLink.classList.remove('is-disabled')
            otherLink.classList.add('is-active')
          }
        })

        if (underline && !this.isAnimating) {
          gsap.to(underline, {
            x: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        }

        handleMouseMove(e, true)
        this.showNavPreview(imgPrev)
      })

      link.addEventListener('mouseleave', (e) => {
        this.elements.navLinks.forEach(otherLink => {
          otherLink.classList.remove('is-disabled', 'is-active')
        })

        if (underline) {
          gsap.to(underline, {
            x: "-100%",
            duration: 0.3,
            ease: "power2.in"
          })
        }

        this.hideNavPreview(imgPrev)
      })

      link.addEventListener('mousemove', (e) => {
        handleMouseMove(e)
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
    this.elements.navMenu.classList.toggle('menu-is-open')
  }

  openMenu() {
    this.lScroll.stop()

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
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""

    this.lScroll.start()
    
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

  showNavPreview(img) {
    gsap.to(img, {
      scale: 1,
      duration: 0.3,
      ease: "Power2.out"
    })
  }

  hideNavPreview(img) {
    gsap.to(img, {
      scale: 0,
      duration: 0.3,
      ease: "Power2.out"
    })
  }
}