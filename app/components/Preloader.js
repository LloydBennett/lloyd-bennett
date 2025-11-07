import Components from 'classes/Components'

export default class Preloader extends Components {
  constructor(){
     super({
      elements: {
        loader: '[data-loader]', 
        loaderIcon: '[data-loader-icon]',
        loaderIconCircle: '[data-loader-spinner-circle]',
        loaderIconSpinner: '[data-loader-spinner]'   
      }      
    })
    
    this.LSPINNER_WIDTH = this.elements.loaderIconSpinner.getBoundingClientRect().width;
    this.LSPINNER_WIDTH_RULE = this.LSPINNER_WIDTH / 10;
    this.LSPINNER_RADIUS = this.elements.loaderIconCircle.r.baseVal.value;
    this.LSPINNER_CIRCUMFERENCE = 2 * Math.PI * this.LSPINNER_RADIUS + 1.5;

    this.elements.loaderIconCircle.style.strokeDasharray = this.LSPINNER_CIRCUMFERENCE;
    this.isLoading = true
  }

  calculatePageLoadTime(progress = 0) {
    return new Promise((resolve) => {
      let updateProgress = (progress) => {
        this.updateLoader(progress)
        progress++
        
        if(progress < 100) {
          setTimeout(() => {
            updateProgress(progress)
          }, 30)
        
        } else {
          this.isLoading = false
          resolve();
        }
      }
      updateProgress(progress);
    })
  }

  updateLoader(amount) {
    let progress = amount / 100;
    let dashoffset = +(this.LSPINNER_CIRCUMFERENCE * (1 - progress)).toFixed(3);

    // force full completion
    if (progress >= 1) {
      dashoffset = 0;
    }

    this.elements.loaderIconCircle.style.strokeDashoffset = dashoffset;
  }
}

