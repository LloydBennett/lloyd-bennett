import LocomotiveScroll from 'locomotive-scroll'
import Cursor from './components/Cursor'
import About from 'pages/About'
import Home from 'pages/Home'
import Project from 'pages/Project'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'

class App {
  constructor() {
    this.locomotiveScroll = new LocomotiveScroll( {
      el: document.querySelector('[data-scroll-container]'),
      smooth: true
    })

    this.createContent()
    this.createPages()
    this.addLinkListeners()
    this.createCursor()
    //this.addLinkListeners()
    this.createPreloader()
    this.createNavigation()
    this.updateScroll()
  }

  updateScroll() {
    let body = document.body
    const config = { attributes: true, attributeOldValue: true, childList: false, subtree: false }

    const observer = new MutationObserver(entries => {
      for (let i = 0; i < entries.length; i++) {
        if(entries[i].target.classList.contains('no-scrolling')) {
          this.locomotiveScroll.stop()
        }
        else {
          this.locomotiveScroll.start()
        }
      }
    })

    observer.observe(body, config)
  }

  createCursor() {
    this.cursor = new Cursor()
  }

  createNavigation() {
    this.navigation = new Navigation()
  }
  
  createPreloader() {
    this.preloader = new Preloader()
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
    
    if(this.pages[this.template] !== undefined || null) {
      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()
    }  
  }

  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  async onChange({ url, push = true }) {
    await this.page.hide()
    const req = await window.fetch(url)
    
    if(req.status === 200) {
      const html = await req.text()
      const div = document.createElement('div')

      if(push) {
        window.history.pushState({}, "", url)
      }
      
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
  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
  }

  addLinkListeners() {
    const links = document.querySelectorAll('[data-page-trigger]')

    links.forEach((l) => {
      
      l.onclick = event => {
        event.preventDefault()
        const href = l.href

        this.onChange({ url: href })
      }
    });
    
  }
}

new App();