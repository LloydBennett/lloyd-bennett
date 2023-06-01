import Components from 'classes/Components'

export default class Navigation extends Components {
  constructor() {
    super({
      element: '[data-nav-menu]',
      elements: {
        trigger: '[data-nav-trigger]',
        body: 'body',
        background: '[data-nav-bg]'
      }
    })
  }
}