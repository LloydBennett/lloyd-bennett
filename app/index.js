import About from 'pages/About'
import Home from 'pages/Home'
import Project from 'pages/Project'
import Navigation from 'components/Navigation'

class App {
  constructor() {
    this.createContent()
    this.createPages()
    this.addLinkListeners()
    this.createNavigation()
    this.nav
  }

  createNavigation() {
    this.navigation = new Navigation()
  }

  createContent() {
    this.content = document.querySelector('.main')
    this.template = this.content.getAttribute('data-page')
  }

  createPages(){
    this.pages = {
      home: new Home(),
      about: new About(),
      project: new Project()
    }
    
    this.page = this.pages[this.template]
    this.page.create()
    this.page.show()
  }

  async onChange(url) {
    await this.page.hide()
    const req = await window.fetch(url)
    
    if(req.status === 200) {
      const html = await req.text()
      const div = document.createElement('div')
      div.innerHTML = html

      const divContent = div.querySelector('.main')
      const newList = divContent.classList

      this.content.classList.remove(this.template)
      this.content.classList.add(...newList)
      
      this.template = divContent.getAttribute('data-page')
      this.content.setAttribute('data-page', this.template)

      this.content.innerHTML = divContent.innerHTML
      
      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()
    }
    else {
      console.log('Error loading page!')
    }
  }

  addLinkListeners() {
    const links = document.querySelectorAll('[data-page-trigger]')

    links.forEach((l) => {
      
      l.onclick = event => {
        event.preventDefault()
        const href = l.href

        this.onChange(href)
      }
    });
    
  }
}

new App();