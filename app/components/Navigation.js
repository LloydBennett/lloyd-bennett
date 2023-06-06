import Components from 'classes/Components'
import { split } from 'utils/text';
import gsap from 'gsap'

export default class Navigation extends Components {
  constructor() {
    super({
      element: '[data-nav-menu]',
      elements: {
        trigger: '[data-nav-trigger]',
        body: 'body',
        bg: '[data-nav-menu-bg]',
        bgPath: '.bg-path',
        navBar: '[data-nav-bar]',
        linkText: '[data-link-text]',
        navLinks: '.nav-menu__list-item [data-page-trigger]'
      }
    })
    this.animating = false
    this.tl = gsap.timeline({ paused: true })
  }

  create() {
    super.create()
    this.intialiseNavText()
    this.addEvents()
  }

  addEvents() {
    this.elements.trigger.addEventListener('click', () => this.animate())
    this.elements.navLinks.forEach(element => { 
      let imagePrev = element.nextElementSibling
      console.log(imagePrev)

      element.addEventListener('mousemove', (e) => {
        this.getPos(e, imagePrev)
      })

      element.addEventListener('mouseenter', (e) => {
        setTimeout(function() {
            
          imagePrev.classList.add('show')
      
        }, 10);
      })

      element.addEventListener('mouseleave', () => imagePrev.classList.remove('show')) 

    })
  }

  intialiseNavText() {
    this.elements.linkText.forEach((element, index) => {
      let word = element.innerHTML.trim().replace(/ /g, '\u00a0')
      let letters = word.split("");
      
      element.innerHTML = ''
      
      letters.forEach((l, i)=> {
        let elSpan = document.createElement('span')
        elSpan.innerHTML = l
        element.appendChild(elSpan)
      })
    });
  }

  animate() {
    const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z"
    const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z"
    let path = document.querySelector('.bg-path')
    let spans = document.querySelectorAll('[data-link-text] span')

    //this.animating = !this.animating
    
    //console.log(this.animating)

    this.elements.navBar.classList.toggle('inverted')
    
    this.tl.fromTo(this.element, { duration: 0.4, opacity: 0, display: "none" }, { opacity: 1, display: "block" })

    this.tl.to(path, { duration: 0.8, attr: { d: start }, ease: "power3.in" })
        .to(path, { duration: 0.4, attr: { d: end }, ease: "power3.out" })
    
    this.tl.fromTo(spans, { duration: 0.4, y: "100%" }, { y: 0, stagger: 0.05 })
    .reverse()
    
    this.tl.reversed(!this.tl.reversed());
  }

  getPos(e, el) {
    // Get coordinates for the current cursor position
    var xPos = 0,
        yPos = 0;
    
    xPos = (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPos = (el.offsetTop - el.scrollTop + el.clientTop);
    
    var mouseX = e.clientX - xPos,
        mouseY = e.clientY - yPos; 
    
    el.style.top = '' + mouseY + 'px';
    el.style.left = '' + mouseX + 'px';
  }
}