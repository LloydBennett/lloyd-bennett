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

      gsap.to(this.elements.cursor, { 
        top: y, 
        left: x,
        duration: 0.6,
        ease: "power2.out"
      })
    })

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