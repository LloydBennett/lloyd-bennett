import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default class VideoPlayer extends Components {
  constructor() {
    super({
      elements: {
        scrollVideo: '[data-video-frame]'
      }
    })

    gsap.registerPlugin(ScrollTrigger)
    this.init()
  }

  init() {
    console.log('go away!')
    this.playOnScroll()
  }

  playOnScroll() {
    if(!this.elements.scrollVideo) return

    let scrollVideo = [this.elements.scrollVideo]
    
    scrollVideo.forEach(frame => {
      const video = frame.querySelector("[data-video]")
      const poster = frame.querySelector("[data-video-poster]")
      
      console.log(poster)

      ScrollTrigger.create({
        trigger: frame,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          video.play()
          gsap.to(poster, { opacity: 0, duration: 0.3, ease: "power2.out" });
        },
        onEnterBack: () => {
          video.play()
          gsap.to(poster, { opacity: 0, duration: 0.3, ease: "power2.out" });
        },
        onLeave: () => {
          video.pause()
          gsap.to(poster, { opacity: 1, duration: 0.3, ease: "power2.out" });
        },
        onLeaveBack: () => {
          video.pause();
          gsap.to(poster, { opacity: 1, duration: 0.3, ease: "power2.out" });
        }
      })
    })
  }
}