import Components from 'classes/Components'
import gsap from 'gsap'

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
  }

  create() {
    super.create()
  }
  addEventListeners() {
    document.addEventListener("mousemove", (e) => {
      let x = e.clientX
      let y = e.clientY
      let isCursorTouchingFooter = this.cursorDetection(this.elements.footer)

      gsap.to(this.elements.cursor, { 
        top: y, 
        left: x,
        duration: 0.6,
        ease: "power2.out"
      })

      if(isCursorTouchingFooter) {
        this.elements.cursor.classList.add("cursor--inverted")
      }
      else {
        if(!this.elements.navMenu.classList.contains('menu-is-open')) {
          this.elements.cursor.classList.remove("cursor--inverted")
        }
      }
    })

    this.elements.projects.forEach(element => {
      element.addEventListener("mouseover", () => {
        this.elements.cursor.classList.add("cursor--expanded")
      })

      element.addEventListener("mouseleave", () => {
        this.elements.cursor.classList.remove("cursor--expanded")
      })
    });

    console.log(this.elements.footer.getBoundingClientRect())
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