import Page from 'classes/Page'

export default class About extends Page {
  constructor() {
    super({
      id: 'about',
      elements: {
        heroText: '[data-intro-text]'
      }
    })
    this.splitLines()
    this.showLines()
  }

  showLines() {
    let lines = this.getLines();
    let txt = this.elements.heroText
    console.log(lines)

    lines.forEach((l, i) => {
      i = i + 1;

      l.forEach((w) => {
        let span = document.createElement('span')
        span.classList.add('inline-block', 'no-overflow-y')
        w.classList.add('inline-block')
        w.innerHTML += "&nbsp;"
        w.setAttribute('data-text-reveal', i)
        span.appendChild(w)
        txt.appendChild(span)
      })
      
    })
  }
  
  splitLines() {
    let heroText = this.elements.heroText
    
    heroText.innerHTML = heroText.innerText.split(/\s/).map(function(word) {
      return '<span>' + word + '</span>'
    }).join(' ');
  }

  getLines() {
    let lines = [];
    let line
    let text = this.elements.heroText
    let words = text.getElementsByTagName('span');
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