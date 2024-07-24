import GSAP from 'gsap'
import create from '../utils/Create'

export default class Page {
  constructor({ elements, id }) {
    this.id = id
    this.selectors = { ...elements }
    Page.prototype.create = create 
    this.create()
    console.log(this)
  }
  // create() {
  //   this.element = document.querySelector(this.selector)
  //   this.elements = {}
  //   // this.selectorChildren.forEach(element => {
      
  //   // });
  //   console.log('Create', this.id, this.element)
  // }
  show() {
    return new Promise(resolve => {
      // GSAP.from(this.element, {
      //   autoAlpha: 0,
      //   onComplete: resolve
      // })
    })
  }
  hide() {
    return new Promise(resolve => {
      // GSAP.from(this.element, {
      //   autoAlpha: 0,
      //   onComplete: resolve
      // })
    })
  }
}