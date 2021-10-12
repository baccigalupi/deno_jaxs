import { RenderKit, Template } from '../types.ts';
import { ensureArray } from '../utilities/array.ts';
import { recursiveRender, replaceTextNodes } from '../utilities/children.js';

export default class Children implements Template {
  collection: Array<Template>;
  dom: Array<Element>;

  constructor(jsxChildren: Array<Template>) {
    this.collection = ensureArray(jsxChildren).map(replaceTextNodes).flat();
    this.dom = [];
  }

  render(renderKit: RenderKit) {
    this.dom = recursiveRender(this.collection, renderKit);
    return this.dom;
  }

  willChange(_renderKit: RenderKit) {
    return true;
  }

  rerender(renderKit: RenderKit) {
    return this.render(renderKit);
  }

  renderIntoParent(parentNode: Element, renderKit: RenderKit) {
    this.render(renderKit).forEach((dom) => {
      parentNode.appendChild(dom);
    });
  }

  rerenderIntoParent(parentNode: Element, renderKit: RenderKit) {
    this.rerender(renderKit).forEach((dom) => {
      parentNode.appendChild(dom);
    });
  }

  remove() {
    this.collection.forEach((child) => child.remove());
  }
}
