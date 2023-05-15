import About from 'pages/About'
import Home from 'pages/Home'
import Project from 'pages/Project'
import Navigation from 'components/Navigation'

class App {
  constructor() {
    this.createContent();
    this.createPages();
  }

  createContent() {
    this.content = document.querySelector('.main')
    this.template = this.content.getAttribute('data-page')
  }

  createPages(){
    this.pages = {
      home: new Home(),
      about: new About(),
      project: new Project()
    }
    
    this.page = this.pages[this.template]
    console.log(this.template)
    this.page.create();
  }
}

new App();