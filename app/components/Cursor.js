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
      let x = e.clientX - (this.width / 2 )
      let y = e.clientY - (this.height / 2 )

      gsap.to(this.elements.cursor, { 
        x: x, 
        y: y,
        duration: 0.4,
        ease: "power2.out"
      })
    })
  }
}