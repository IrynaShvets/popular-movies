export default class LoadMoreBtn {
  constructor({ selector, selector1, hidden = false }) {
    this.refs = this.getRefs(selector);
    this.refs1 = this.getRefs1(selector1);
    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    return refs;
  }

  getRefs1(selector1) {
    const refs1 = {};
    refs1.button = document.querySelector(selector1);
    return refs1;
  }

  show() {
    this.refs.button.classList.remove("hidden");
  }

  show1() {
    this.refs1.button.classList.remove("hidden");
    
  }

  hide() {
    this.refs.button.classList.add("hidden");
  }

  hide1() {
    this.refs1.button.classList.add("hidden");
  }
}


