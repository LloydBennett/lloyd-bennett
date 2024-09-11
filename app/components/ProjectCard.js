import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default class ProjectCard extends Components {
  constructor(){
     super({
      elements: {
        projectCard: '[data-project-card]',
        projectImg: '[data-project-img]'
      }
    })
    gsap.registerPlugin(ScrollTrigger)
    this.scrollAnim()
  }
  scrollAnim() {

    this.elements.projectCard.forEach(element => {
      let img = element.querySelector('[data-project-img]')

      gsap.from(img, {
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          markers: false
        },
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
    })
  }
}