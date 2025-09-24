import { scroll } from 'utils/LenisScroll'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Page from './classes/Page'
import Cursor from 'components/Cursor'
import About from 'pages/About'
import Home from 'pages/Home'
import Project from 'pages/Project'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import SplitText from 'components/SplitText'
import ProjectCard from 'components/ProjectCard'
import Parallax from 'components/Parallax'

class App {
  constructor() {
    this.lenisScroll = scroll
    this.setUpScrollTrigger()
    this.createContent()
    this.createPreloader()
    
    //this.addLinkListeners()
    this.createCursor()
    
    this.createNavigation()
    //this.updateScroll()
    
    //this.addEventListeners()
    this.createSplitText()
    this.createProjectCard()
    this.createParallaxItems()
    
    this.preloader.calculatePageLoadTime().then(()=> {
      this.createPages()
    })

    this.triggerLink = null
  }
  
  setUpScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger)
    
    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    this.lenisScroll.on('scroll', ScrollTrigger.update);

     gsap.ticker.add(() => {
       this.lenisScroll.raf(performance.now());
     });
 
     gsap.ticker.lagSmoothing(0);
  }

  updateScroll() {
    let body = document.body
    const config = { attributes: true, attributeOldValue: true, childList: false, subtree: false }

    const mObs = new MutationObserver(entries => {
      for (let i = 0; i < entries.length; i++) {
        if(entries[i].target.classList.contains('no-scrolling')) {
          this.lenisScroll.stop()
          console.log("stopping lenis")
        }
        else {
          this.lenisScroll.start()
          console.log("starting lenis")
        }
      }
    })

  //   new ResizeObserver(() => {
  //     this.locomotiveScroll.update()
  //   }).observe(document.querySelector("[data-scroll-container]"))

    mObs.observe(body, config)
  }

  createParallaxItems() {
    this.Parallax = new Parallax()
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
    
    const PageClass = this.pages[this.template] || Page

    this.page = new PageClass()
    this.page.create()
    this.page.show()
      
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
    console.log(`page trigger when hide is called: `)
    
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
      //const heroImg = div.querySelector('[data-main-hero]')
      const newList = divContent.classList
      
      //this.page.heroImg = heroImg
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
      
      // setTimeout(() => {
      //   console.log(this.page.heroImg);
      // }, 0)

      this.page = this.pages[this.template]
      this.page.create()
      this.createSplitText()
      this.createProjectCard()
      this.createCursor()
      this.page.pageTrigger = this.triggerLink
      this.page.heroImg = document.querySelector('[data-main-hero]')
      this.page.show()
    }
    else {
      console.log('Error loading page!')
    }
  }

  addEventListeners() {
    // ScrollTrigger.addEventListener('refresh', () => this.locomotiveScroll.update())
    // ScrollTrigger.defaults({ scroller: '[data-scroll-container]' })
  }

  addLinkListeners() {
    const links = document.querySelectorAll('[data-page-trigger]')

    links.forEach((l) => {
      
      l.onclick = event => {
        event.preventDefault()
        const href = l.href
        const linkData = l.getAttribute('data-page-trigger')
        const linkTag = l.getAttribute('data-tag')

        if(href !== window.location.href) {
          this.triggerLink = linkData
          this.page.pageTrigger = linkData
          this.page.pageTag = linkTag

          if(this.navigation.isMenuOpen) {
            this.navigation.elements.navLinks.forEach(link => {
              link.removeEventListener('mouseout', link._hoverOutAnim)
            })
            this.navigation.disableMouseMove()
          }

          this.onChange({ url: href })
        } else {
          if(this.navigation.isMenuOpen) {
            this.navigation.animate()
            this.navigation.isMenuOpen = false
          }
          else {
            return
          }
        }
      }
    })
    
  }
}

new App();