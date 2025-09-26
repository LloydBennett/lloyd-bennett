import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default class VideoPlayer extends Components {
  constructor() {
    super({
      elements: {
        scrollVideo: '[data-video-frame="play-on-scroll"]'
      }
    })

    gsap.registerPlugin(ScrollTrigger)
    this.init()
  }

  init() {
    this.playOnScroll()
  }

  playOnScroll() {
    if(!this.elements.scrollVideo) return

    let scrollVideo = this.elements.scrollVideo

    // checks to see if we have a single element or multiple
    if (scrollVideo instanceof Element) {
      scrollVideo = [scrollVideo];
    } else {
      scrollVideo = Array.from(scrollVideo)
    }

    scrollVideo.forEach(frame => {
      const video = frame.querySelector("[data-video]")
      const poster = frame.querySelector("[data-video-poster]")

      if(!video) return

      ScrollTrigger.create({
        trigger: frame,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          video.play()

          if(poster) {
            gsap.to(poster, { opacity: 0, duration: 0.3, ease: "power2.out" });
          }
        },
        onEnterBack: () => {
          video.play()
          if(poster) {
            gsap.to(poster, { opacity: 0, duration: 0.3, ease: "power2.out" });
          }
        },
        onLeave: () => {
          video.pause()
          if(poster) {
            gsap.to(poster, { opacity: 1, duration: 0.3, ease: "power2.out" });
          }
        },
        onLeaveBack: () => {
          video.pause();
          if(poster) {
            gsap.to(poster, { opacity: 1, duration: 0.3, ease: "power2.out" });
          }
        }
      })
    })
  }
}