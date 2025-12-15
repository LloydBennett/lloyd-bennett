import Components from 'classes/Components'
import gsap from 'gsap'

export default class Icons extends Components {
  constructor() {
    super({ 
      elements: {
        strategy: '[data-icon-strategy]',
        scale: '[data-icon-scale]',
        building: '[data-icon-consistency]'
      }
      
    })

    this.init()
  }

  create() {
    super.create()
  }

  animateIcons() {
    if(this.elements.strategy) {
      const strTl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } })
      let path = this.elements.strategy.querySelector('path')
      let lineOne = this.elements.strategy.querySelector('#line1')
      let lineTwo = this.elements.strategy.querySelector('#line2')
      let lineThree = this.elements.strategy.querySelector('#line3')
      let lineFour = this.elements.strategy.querySelector('#line4')

      // animate the main path
      strTl.fromTo(
        path, 
        { strokeDashoffset: 100 }, 
        { strokeDashoffset: 0, duration: 3 }
      )

      // lines appear in sync with path
      strTl.fromTo(lineOne, { strokeDashoffset: 7, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.4 }, 0);      // start at same time as path
      strTl.fromTo(lineTwo, { strokeDashoffset: 10, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.4 }, 0.2);
      strTl.fromTo(lineThree, { strokeDashoffset: 5, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.4 }, 0.4);
      strTl.fromTo(lineFour, { strokeDashoffset: 14, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.4 }, 0.6);

      // hold all lines visible for a short delay
      strTl.to([lineOne,lineTwo,lineThree,lineFour], { duration: 0.1 });

      // fade all lines out together
      strTl.to([lineOne,lineTwo,lineThree,lineFour, path], { opacity: 0, duration: 0.4 });

      // reset for next loop
      strTl.set([lineOne,lineTwo,lineThree,lineFour, path], { strokeDashoffset: gsap.utils.wrap([7,10,5,14, 100]), opacity: 1 });
    }

    if(this.elements.building) {
      const bTl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } })
      let boxes = this.elements.building.querySelectorAll('svg rect')
      bTl.fromTo(boxes, { opacity: 0 }, { opacity: 1, duration: 2, stagger: 0.4 }, 0)
      
      //  // hold all lines visible for a short delay
      bTl.to({}, { duration: 0.4 });

      bTl.to(boxes, { opacity: 0, duration: 0.4 });

    }

    if(this.elements.scale) {
      const scTl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.in-out" } })

      let circle = this.elements.scale.querySelectorAll('circle')

      scTl.fromTo(circle, { scale: 0, opacity: 0.6, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 1, stagger: 0.15 }, 0)
      scTl.to({}, { duration: 0.1 })
      scTl.to(circle, { scale: 0, opacity: 0.6, transformOrigin: "50% 50%", duration: 1, stagger: 0.15 })

    }
  }

  init() {
    this.animateIcons()
  }

}