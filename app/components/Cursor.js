import gsap from 'gsap'
import Components from 'classes/Components'

export default class Cursor extends Components {
  constructor() {
    super({
      elements: {
        cursor: '[data-cursor]',
        projects: '[data-project-card]',
        footer: '[data-footer]',
        navMenu: '[data-nav-menu]'
      }
    })
    
    this.width = this.elements.cursor.offsetWidth
    this.height = this.elements.cursor.offsetHeight
    this.scroll = scroll
    this.addEventListeners()

    // if(this.elements.footer) {
    //   this.scroll.on('scroll', (args) => {
    //     this.updateCursor()
    //   })
    // }
  }

  create() {
    super.create()
  }

  addEventListeners() {
    document.addEventListener("mousemove", (e) => {
      let x = e.clientX
      let y = e.clientY

      gsap.to(this.elements.cursor, { 
        top: y, 
        left: x,
        duration: 0.6,
        ease: "power2.out"
      })

      this.updateCursor()
    })

    if(this.elements.projects) {
      this.elements.projects.forEach(element => {
        let img = element.querySelector('[data-project-img] img')
        
        element.addEventListener("mouseover", () => {
          this.elements.cursor.classList.add("cursor--expanded")
          gsap.to(img, { 
            scale: 1.2,
            duration: 0.6,
            ease: "power2.out"
          })
        })
  
        element.addEventListener("mouseleave", () => {
          this.elements.cursor.classList.remove("cursor--expanded")
          gsap.to(img, { 
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          })
        })
      });
    }    
  }
  updateCursor() {
    let isCursorTouchingFooter = this.cursorDetection(this.elements.footer)

    if(isCursorTouchingFooter) {
      this.elements.cursor.classList.add("cursor--inverted")
    }
    else {
      if(!this.elements.navMenu.classList.contains('menu-is-open')) {
        this.elements.cursor.classList.remove("cursor--inverted")
      }
    }
  }

  cursorDetection(elem){
    let ePos = elem.getBoundingClientRect()
    let cursorPos = this.elements.cursor.getBoundingClientRect()
    
    if ( 
      ePos.right >= cursorPos.left && 
      ePos.left <= cursorPos.right && 
      ePos.bottom >= cursorPos.top && 
      ePos.top <= cursorPos.bottom 
    ) { 
      return true 
    } else { 
      return false
    }
  }
}