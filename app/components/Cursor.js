import Components from 'classes/Components'
import gsap from 'gsap'

export default class Cursor extends Components {
  constructor() {
    super({
      elements: {
        cursor: '[data-cursor]'
      }
    })
    
    this.width = this.elements.cursor.offsetWidth
    this.height = this.elements.cursor.offsetHeight

    console.log(this.width)
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
  }
}