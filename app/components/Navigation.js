import Components from 'classes/Components'
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

    this.intialiseNavText()
    this.addEventListeners()
    this.animate()
  }

  create() {
    super.create()
  }

  addEventListeners() {
    this.elements.trigger.addEventListener('click', () => {
      this.animating = !this.animating
      this.tl.reversed(!this.tl.reversed());
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

  intialiseNavLinks() {
    this.elements.navLinks.forEach(element => { 
      let imagePrev = element.nextElementSibling

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

  animate() {
    const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z"
    const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z"
    let path = document.querySelector('.bg-path')
    let spans = document.querySelectorAll('[data-link-text] span')
    let hamburgerIcon = this.elements.navBar.querySelectorAll('.hamburger__line')
    let newTl = gsap.timeline()

    this.tl.to(this.elements.navBar, 
    { 
      duration: 0.3, 
      opacity: 0
    })

    this.tl.fromTo(this.element, { duration: 0.4, opacity: 0, display: "none" }, { opacity: 1, display: "block" } , "-=0.8")

    this.tl.to(path, { duration: 0.8, attr: { d: start }, ease: "power3.in" }, "-=0.5")
        .to(path, { duration: 0.4, attr: { d: end }, ease: "power3.out" })
        .reverse()

    this.tl.to(this.elements.navBar, { duration: 0.3, opacity: 1, color: "white" }, '-=0.3 nav')
    this.tl.to(hamburgerIcon, { duration: 0.3, "background-color": "white" }, '-=0.3 nav')
    
    if(this.animating) {
      newTl.fromTo(spans, { duration: 0.4, y: "100%" }, { y: 0, stagger: 0.03 }, '-=0.3')
    }
    else {
      newTl.fromTo(spans, { duration: 0.4, y: 0 }, { y: "100%" }, '-=0.3')
    }
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