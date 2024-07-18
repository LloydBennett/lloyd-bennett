import Components from 'classes/Components'
import gsap from 'gsap'

export default class Preloader extends Components {
  constructor(){
     super({
      elements: {
        loader: '[data-loader]', 
        background: '[data-loader-bg]'
      }
    })
    console.log(this.elements)
  }
}