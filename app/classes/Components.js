export default class Components {
  constructor({ elements, element }) {
    this.selector = element
    this.selectorChildren = { ...elements }
    this.create()
    this.addEventListeners()
  }
  create() {
    this.element = document.querySelector(this.selector)
    this.elements = {}
    // this.selectorChildren.forEach(element => {
      
    // });
  }
  addEventListeners() {

  }
  removeEventListeners() {
    
  }
}