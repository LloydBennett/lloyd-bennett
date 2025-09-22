import { scroll } from 'utils/LenisScroll'
import Page from 'classes/Page'

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      elements: {
        cta: '[data-home-cta]',
        workSection: '[data-work]',
        transition: '[data-menu-move]'
      }
    })
    this.scroll = scroll 
    this.addLinkListeners()
  }
  addLinkListeners() {
    if(this.elements.cta && this.elements.workSection) {
      this.elements.cta.addEventListener('click', () => {
        this.scroll.scrollTo(this.elements.workSection, {
          duration: 1.5
        })
      })
    }
  }
}