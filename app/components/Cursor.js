import gsap from 'gsap'
import Components from 'classes/Components'

export default class Cursor extends Components {
  constructor() {
    super({
      elements: {
        cursor: '[data-cursor]',
        cursorFooter: '[data-cursor-footer]',
        projects: '[data-project-card]',
        footer: '[data-footer]',
        navMenu: '[data-nav-menu]'
      }
    })
    
    this.width = this.elements.cursor.offsetWidth
    this.height = this.elements.cursor.offsetHeight

    this.mouse = { x: 0, y: 0 } // track latest mouse pos

    this.addEventListeners()
  }

  create() {
    super.create()
  }

  addEventListeners() {
    let hasMoved = false

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
    })

    // listen to Lenis scroll updates
    window.addEventListener("scroll", () => {
      this.updateFooterCursor(true) // snap update
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

  updateFooterCursor(isScroll = false) {
    if (!this.elements.cursorFooter || !this.elements.footer) return

    const footerBounds = this.elements.footer.getBoundingClientRect()
    const cursorX = this.mouse.x
    const cursorY = this.mouse.y

    // Check if any part of cursor is inside footer
    const intersects =
      cursorX + this.width / 2 > footerBounds.left &&
      cursorX - this.width / 2 < footerBounds.right &&
      cursorY + this.height / 2 > footerBounds.top &&
      cursorY - this.height / 2 < footerBounds.bottom

    if (intersects) {
      // Show footer cursor
      this.elements.cursorFooter.style.opacity = 1

      // Animate footer cursor exactly like main cursor
      gsap.to(this.elements.cursorFooter, {
        top: cursorY,
        left: cursorX,
        duration: isScroll ? 0 : 0.6,
        ease: "power2.out",
        onUpdate: () => {
          // Update clip-path in sync with footer cursor’s current animated position
          const rect = this.elements.cursorFooter.getBoundingClientRect()

          const topInset = Math.max(0, footerBounds.top - rect.top)
          const leftInset = Math.max(0, footerBounds.left - rect.left)
          const bottomInset = Math.max(0, rect.bottom - footerBounds.bottom)
          const rightInset = Math.max(0, rect.right - footerBounds.right)

          this.elements.cursorFooter.style.clipPath = `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`
        }
      })

      // Hide main cursor if fully inside footer
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
      // Outside footer
      this.elements.cursorFooter.style.opacity = 0
      this.elements.cursor.classList.remove("is-hidden")
    }
  }
}