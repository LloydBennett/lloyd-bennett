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
    gsap.set(spans, { opacity: 0.3 })
    
    gsap.to(spans, {
      scrollTrigger: {
        trigger: '.type--call-out',
        start: 'top bottom-=20%',
        markers: true
      },
      opacity: 1,
      duration: 0.6,
      stagger: { amount: 1.6 },
      ease: 'power2.out'
    });
  }
}