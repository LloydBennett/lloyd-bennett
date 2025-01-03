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
    if(this.elements.projectCard) {
      this.elements.projectCard.forEach(element => {
        let img = element.querySelector('[data-project-img] img')
        
        gsap.from(img, {
          scrollTrigger: { 
            trigger: element,
            start: 'top 80%'          
          },
          scale: 1.5,
          duration: 0.8,
          ease: 'power2.out'
        })
      })
    } 
    else {
      return
    }
  }
}

