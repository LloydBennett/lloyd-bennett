import { scroll } from 'utils/locomotive-scroll'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cursor from 'components/Cursor'
import About from 'pages/About'
import Home from 'pages/Home'
import Project from 'pages/Project'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import SplitText from 'components/SplitText'
import ProjectCard from 'components/ProjectCard'

class App {
  constructor() {
    this.locomotiveScroll = scroll
    this.setUpScrollTrigger()
    this.createContent()
    this.createPreloader()
    
    this.addLinkListeners()
    this.createCursor()
    
    this.createNavigation()
    this.updateScroll()
    
    this.locomotiveScroll.init()
    this.addEventListeners()
    this.createSplitText()
    this.createProjectCard()
    
    this.preloader.calculatePageLoadTime().then(()=> {
      this.createPages()
    })
  }
  setUpScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger)

    let container = document.querySelector('[data-scroll-container]')
    this.locomotiveScroll.on('scroll', ScrollTrigger.update)
    
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop: (value) => {
        return arguments.length ? this.locomotiveScroll.scrollTo(value, 0 , 0) : this.locomotiveScroll.scroll.instance.scroll.y
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      pinType: container.style.transform ? "transform" : "fixed"
    })
  }

  updateScroll() {
    let body = document.body
    const config = { attributes: true, attributeOldValue: true, childList: false, subtree: false }

    const mObs = new MutationObserver(entries => {
      for (let i = 0; i < entries.length; i++) {
        if(entries[i].target.classList.contains('no-scrolling')) {
          this.locomotiveScroll.stop()
        }
        else {
          this.locomotiveScroll.start()
        }
      }
    })

    new ResizeObserver(() => {
      this.locomotiveScroll.update()
    }).observe(document.querySelector("[data-scroll-container]"))

    mObs.observe(body, config)
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

  createSplitText() {
    this.splitText = new SplitText()
  }

  createProjectCard() {
    this.projectCard = new ProjectCard()
  }

  createContent() {
    this.head = document.querySelector('head')
    this.content = document.querySelector('.main')
    this.template = this.content.getAttribute('data-page')

    this.descriptionsList = new Set([
      ...this.head.querySelectorAll('meta[name*="description"]'),
      ...this.head.querySelectorAll('meta[property*="description"]')
    ])
    this.twitterMeta = this.head.querySelector('meta[name="twitter:image"]')
    this.ogMeta = this.head.querySelector('meta[property="og:image"]')
    this.metaURL = this.head.querySelector('meta[property="og:url"]')
  }

  createPages() {
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
      const title = div.querySelector('title').innerText
      const newDescription = div.querySelector('meta[name="description"]').getAttribute('content')
      const newOgImg = div.querySelector('meta[property="og:image"]').getAttribute('content')
      const newTwitterImg = div.querySelector('meta[name="twitter:image"]').getAttribute('content')

      const newList = divContent.classList
      this.content.classList.remove(this.template)
      this.content.classList.add(...newList)
      
      this.template = divContent.getAttribute('data-page')
      this.content.setAttribute('data-page', this.template)

      this.content.innerHTML = divContent.innerHTML
      this.head.querySelector('title').innerHTML = title

      this.descriptionsList.forEach((element) => {
        element.setAttribute('content', newDescription)
      })
      
      this.twitterMeta.setAttribute('content', newTwitterImg)
      this.ogMeta.setAttribute('content', newOgImg)
      this.metaURL.setAttribute('content', url)

      this.page = this.pages[this.template]
      this.page.create()
      this.createSplitText()
      this.createProjectCard()
      this.createCursor()
      this.page.show()
    }
    else {
      console.log('Error loading page!')
    }
  }

  addEventListeners() {
    ScrollTrigger.addEventListener('refresh', () => this.locomotiveScroll.update())
    ScrollTrigger.defaults({ scroller: '[data-scroll-container]' })
  }

  addLinkListeners() {
    const links = document.querySelectorAll('[data-page-trigger]')

    links.forEach((l) => {
      
      l.onclick = event => {
        event.preventDefault()
        const href = l.href
        
        if(href !== window.location.href) {
          this.onChange({ url: href })
        } else {
          return
        }
      }
    })
    
  }
}

new App();