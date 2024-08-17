import GSAP from 'gsap'
import create from '../utils/Create'

export default class Page {
  constructor({ elements, id }) {
    this.id = id
    this.selectors = { ...elements }
    Page.prototype.create = create
    this.create()
  }
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