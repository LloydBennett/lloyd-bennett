import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default class Navigation extends Components {
  constructor() {
    super({
      elements: {
        text: '[data-text]'
      }
    })
    gsap.registerPlugin(ScrollTrigger)
    this.splitText()
    this.animateText()
  }

  splitText() {  
    let text = this.elements.text

    text.innerHTML = text.innerText.split(/\s/).map(function(word) {
      return '<span>' + word + '</span>'
    }).join(' ');
  }

  animateText() {
    let spans = this.elements.text.querySelectorAll('span')
    
    gsap.from(spans, {
      scrollTrigger: {
        trigger: '.type--call-out',
        start: 'top 80%',
        scrub: true,
        markers: false
      },
      opacity: 0.2,
      stagger: { amount: 1.2 },
      ease: 'power2.out'
    })
  }
}