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
        let aTag = element.querySelector('a')
        let img = element.querySelector('[data-project-img] img')
        let cover = element.querySelector('[data-project-cover]')
        
        let tl = gsap.timeline( {
          scrollTrigger: { 
            trigger: element,
            start: 'top 80%'          
          }
        })

        tl.fromTo( aTag,
         { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"},
         { 
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.6,
          ease: 'power2.out',
        }
        ).fromTo(cover,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" },
          { 
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", 
            duration: 0.4,
            ease: "power2.out"
          }, '-=0.2'

        ).from(img, {
          scale: 2,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4')
      })

    } 
    else {
      return
    }
  }
}

