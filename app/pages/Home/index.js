import { scroll } from 'utils/LenisScroll'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Page from 'classes/Page'


export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      elements: {
        cta: '[data-home-cta]',
        workSection: '[data-work]',
        transition: '[data-menu-move]',
        floatingPoster:'[data-floating-poster]',
        introSection: '[data-skills-section]',
        posterImgs: '[data-floating-poster-images]'
      }
    })
    
    gsap.registerPlugin(ScrollTrigger)

    this.scroll = scroll
    this.init()
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
  
  animateFloatingPoster() {
    const children = this.elements.posterImgs;
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 0.15, ease: "linear" } });

    const len = children.length;

    gsap.set(children, { opacity: 0, zIndex: 0 });
    gsap.set(children[0], { opacity: 1, zIndex: 1 });

    for (let i = 0; i < len; i++) {
      const current = children[i];
      const next = children[(i + 1) % len];

      // Bring next on top
      tl.set(next, { zIndex: 2 })            
        .to(next, { opacity: 1 })         
        .to(current, { opacity: 0 }, ">")
        .set(current, { zIndex: 0 })
        .set(next, { zIndex: 1 });
    }

    return tl
  }

  init() {
    if(!this.elements.floatingPoster) return

    gsap.set(this.elements.floatingPoster, { opacity: 0 }); // ensure hidden initially
    let anim = this.animateFloatingPoster()

    const breakpoints = [
      { query: "(max-width: 1199px)", start: "10% bottom", end: "150% bottom" },
      { query: "(min-width: 1200px)", start: "top bottom", end: "250% bottom" },
    ]

    breakpoints.forEach(bp => {
      gsap.matchMedia().add(bp.query, () => {
        ScrollTrigger.create({
          trigger: this.elements.introSection,
          start: bp.start,   
          end: bp.end,      
          markers: false,
          onEnter: () => {
            gsap.to(this.elements.floatingPoster, { opacity: 1, duration: 0.4, ease: "power2.out" })
            anim.play()
          },
          onLeave: () => { 
            gsap.to(this.elements.floatingPoster, { opacity: 0, duration: 0.4, ease: "power2.out" })
            anim.pause()
          },
          onEnterBack: () =>  { 
            gsap.to(this.elements.floatingPoster, { opacity: 1, duration: 0.4, ease: "power2.out" })
            anim.play()
          },
          onLeaveBack: () => {
            gsap.to(this.elements.floatingPoster, { opacity: 0, duration: 0.4, ease: "power2.out" })
            anim.pause()
          }
        })
      })
    })
  }
}