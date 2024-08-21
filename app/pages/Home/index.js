import Page from 'classes/Page'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home'
      elements: {
        cta: '[data-home-cta]',
        workSection: '[data-work]'
      }
    })
    this.addLinkListeners()

  }
  addLinkListeners() {
    if(this.elements.cta) {
      this.elements.cta.addEventListener('click', () => {
  }
}