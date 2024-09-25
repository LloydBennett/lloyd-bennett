import Components from 'classes/Components'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default class Navigation extends Components {
  constructor() {
    super({
      elements: {
        text: '[data-text]'
      }
    })
    gsap.registerPlugin(ScrollTrigger)
    this.splitTextCache = []
    this.init()
  }
  
  addEventListeners(textObj) {
    window.addEventListener('resize', () => {
      this.splitText(textObj)
    })
  }
  init() {
    let textContent = [],
        text = this.elements.text
    
    if(text instanceof window.NodeList && text.length) {
      text.forEach((t) => {
        textContent.push({ text: t.innerText, htmlElem: t })
      })
    } else {
      textContent.push({ text: text.innerText, htmlElem: text })
    }
    this.textContent = textContent
    this.splitText(this.textContent)
  }

  splitText(text) {

    text.forEach((t) => {
      t.htmlElem.innerHTML = t.text.split(/\s/).map(function(word) {
        return '<span>' + word + '</span>'
      }).join(' ')
      this.checkTextType(t.htmlElem, t)
    })
  }

  checkTextType(text, obj) {
    let attr = text.getAttribute('data-text')

    if(attr === "line-break") {
      this.displayLines(text)

      if(this.splitTextCache.indexOf(text) === -1) {
        this.splitTextCache.push(text)
        this.addEventListeners([obj])
      }
    } else {
      this.scrollAnimateText(text)
    }
  }

  getLines(text) {
    let lines = [];
    let line
    let words = text.children
    let lastTop;

    for (var i = 0; i < words.length; i++) {
      let word = words[i];
      if (word.offsetTop != lastTop) {
        lastTop = word.offsetTop;
        line = [];
        lines.push(line);
      }
      line.push(word);
    }
    return lines;
  }

  displayLines(text) {
    let lines = this.getLines(text);

    lines.forEach((l, i) => {
      let lineSpan = document.createElement('span')
      lineSpan.classList.add('inline-block', 'no-overflow-y', 'white-space')
      i = i + 1;
      
      l.forEach((w) => {
        w.classList.add('inline-block')
        w.innerHTML += "&nbsp;"
        w.setAttribute('data-text-reveal', i)
        lineSpan.appendChild(w)
        text.appendChild(lineSpan)
      })
    })
  }

  scrollAnimateText(text) {
    let spans = text.querySelectorAll('span')
    gsap.from(spans, {
      scrollTrigger: {
        trigger: '.type--call-out',
        start: 'top 80%',
        scrub: true,
        markers: false
      },
      opacity: 0.2,
      stagger: { amount: 1.2 },
      ease: 'power2.out'
    })
  }
}