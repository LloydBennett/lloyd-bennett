import gsap from 'gsap'
import Components from 'classes/Components'

export default class Cursor extends Components {
  constructor() {
    super({
      elements: {
        cursor: '[data-cursor]',
        cursorFooter: '[data-cursor-footer]',
        projects: '[data-project-card] a',
        footer: '[data-footer]',
        navMenu: '[data-nav-menu]'
      }
    })
    
    this.width = this.elements.cursor.offsetWidth
    this.height = this.elements.cursor.offsetHeight

    this.mouse = { x: 0, y: 0 } // track latest mouse pos
    this.hoveredProject

    this.addEventListeners()
  }

  create() {
    super.create()
  }

  addEventListeners() {
    let hasMoved = false

    this.elements.cursorFooter.style.opacity = 0

    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY

      if (!hasMoved) {
        gsap.set(this.elements.cursor, { top: this.mouse.y, left: this.mouse.x })
        this.elements.cursor.classList.remove("is-hidden")
        hasMoved = true
      } else {
        gsap.to(this.elements.cursor, { 
          top: this.mouse.y, 
          left: this.mouse.x,
          duration: 0.6,
          ease: "power2.out"
        })
      }

      this.updateFooterCursor()
      this.updateProjectHover()
    })

    window.addEventListener("scroll", () => {
      this.updateFooterCursor(true) // snap update
      this.updateProjectHover()
    })

    if(this.elements.projects) {
      this.elements.projects.forEach(element => {        
        element.addEventListener("mouseover", () => {
          this.elements.cursor.classList.add("cursor--expanded")
        })
  
        element.addEventListener("mouseleave", () => {
          this.elements.cursor.classList.remove("cursor--expanded")
        })
      });
    }    
  }
 
  updateProjectHover() {
    if (!this.elements.projects) return
    let menu = document.querySelector('[data-nav-menu]')

    if (menu.classList.contains("menu-is-open")) {
      this.elements.cursor.classList.remove("cursor--expanded")
      return
    }

    const mouseX = this.mouse.x
    const mouseY = this.mouse.y
    let hovering = false

    this.elements.projects.forEach(project => {
      const rect = project.getBoundingClientRect()
      if (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      ) {
        hovering = true
      }
    })

    if (hovering) {
      this.elements.cursor.classList.add("cursor--expanded")
    } else {
      this.elements.cursor.classList.remove("cursor--expanded")
    }
  }

  updateFooterCursor(isScroll = false) {
    if (!this.elements.cursorFooter || !this.elements.footer) return

    const footerBounds = this.elements.footer.getBoundingClientRect()
    const cursorX = this.mouse.x
    const cursorY = this.mouse.y

    const intersects =
      cursorX + this.width / 2 > footerBounds.left &&
      cursorX - this.width / 2 < footerBounds.right &&
      cursorY + this.height / 2 > footerBounds.top &&
      cursorY - this.height / 2 < footerBounds.bottom

    if (intersects) {
      this.elements.cursorFooter.style.opacity = 1

      gsap.to(this.elements.cursorFooter, {
        top: cursorY,
        left: cursorX,
        duration: isScroll ? 0 : 0.6,
        ease: "power2.out",
        onUpdate: () => {
          const rect = this.elements.cursorFooter.getBoundingClientRect()

          const topInset = Math.max(0, footerBounds.top - rect.top)
          const leftInset = Math.max(0, footerBounds.left - rect.left)
          const bottomInset = Math.max(0, rect.bottom - footerBounds.bottom)
          const rightInset = Math.max(0, rect.right - footerBounds.right)

          this.elements.cursorFooter.style.clipPath = `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`
        }
      })

      const fullyInside =
        cursorX - this.width / 2 >= footerBounds.left &&
        cursorX + this.width / 2 <= footerBounds.right &&
        cursorY - this.height / 2 >= footerBounds.top &&
        cursorY + this.height / 2 <= footerBounds.bottom

      if (fullyInside) {
        this.elements.cursor.classList.add("is-hidden")
      } else {
        this.elements.cursor.classList.remove("is-hidden")
      }

    } else {
      this.elements.cursorFooter.style.opacity = 0
      this.elements.cursor.classList.remove("is-hidden")
    }
  }
}