import Children from './Children';

export default class FragmentTag {
  constructor(children) {
    this.children = new Children(children);
  }

  render(renderKit) {
    this.dom = this.children.render(renderKit);
    return this.dom;
  }

  rerender(renderKit) {
    this.dom = this.children.rerender(renderKit);
    return this.dom;
  }

  removeListeners() {
    this.children.removeListeners();
  }

  removeDom() {
    this.children.removeDom();
  }
}
