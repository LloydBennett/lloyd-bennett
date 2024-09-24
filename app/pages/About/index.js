import Page from 'classes/Page'

export default class About extends Page {
  constructor() {
    super({
      id: 'about',
      elements: {
        heroText: '[data-intro-text]',
        transition: '[data-menu-move]'
      }
    })
    this.text = this.elements.heroText.innerText
    this.splitLines()
    this.showLines()
    this.addEventListeners()
  }
  addEventListeners() {
    window.addEventListener('resize', () => {
      this.splitLines()
      this.showLines()
    })
  }
  
  showLines() {
    let lines = this.getLines();

    lines.forEach((l, i) => {
      let lineSpan = document.createElement('span')
      lineSpan.classList.add('inline-block', 'no-overflow-y', 'white-space')
      i = i + 1;
      
      l.forEach((w) => {
        w.classList.add('inline-block')
        w.innerHTML += "&nbsp;"
        w.setAttribute('data-text-reveal', i)
        lineSpan.appendChild(w)
        this.elements.heroText.appendChild(lineSpan)
      })
    })
  }

  splitLines() {
    let heroText = this.elements.heroText
    
    heroText.innerHTML = this.text.split(/\s/).map(function(word) {
      return '<span>' + word + '</span>'
    }).join(' ');
  }

  getLines() {
    let lines = [];
    let line
    let text = this.elements.heroText
    let words = text.getElementsByTagName('span')
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
}