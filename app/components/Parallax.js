import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default class Parallax extends Components {
  constructor() {
    super({
      elements: {
        parallax: '[data-parallax]'
      }      
    })
    gsap.registerPlugin(ScrollTrigger)
    this.init()
  }

  init() {
    if(!this.elements.parallax) {
      console.warn('There are no elements using data-parallax')
      return
    }

    if (this.elements.parallax instanceof NodeList || this.elements.parallax instanceof HTMLCollection) {
      this.elements.parallax.forEach(element => {
        console.log('multiple html elements')
        this.animate(element)
      })

    } else {
      console.log('single html element!')
      this.animate(this.elements.parallax)
    }
  }
  
  animate(element) {
    let dataVal = element.getAttribute('data-parallax')
    let yPos = `-${dataVal}%`

    gsap.to(element,
      {
        y: yPos,
        ease: 'power2.out',
        duration: 0.9,
        scrollTrigger: {
          trigger: element,
          start: '10% 60%',
          scrub: true,
          markers: true
        }
      }  
    )
  }
}