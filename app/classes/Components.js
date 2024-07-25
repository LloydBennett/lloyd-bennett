import create from '../utils/Create'

export default class Components {
  constructor({ elements }) {
    this.selectors = { ...elements }
    Components.prototype.create = create
    this.create()
    this.addEventListeners()
  }
  
  addEventListeners() {

  }

  removeEventListeners() {

  }
}