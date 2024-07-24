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
        w.classList.add('inline-block', "white-space")
        w.innerHTML += "&nbsp;"
        w.setAttribute('data-text-reveal', i)
        
        txt.appendChild(w)
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