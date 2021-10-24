import { RenderKit, Template, TemplateDomCollection } from '../types.ts';
import { ensureArray } from '../utilities/array.ts';
import { recursiveRender, replaceTextNodes } from '../utilities/children.js';

export default class Children implements Template {
  collection: Array<Template>;
  dom: TemplateDomCollection;

  constructor(jsxChildren: Array<Template>) {
    this.collection = ensureArray(jsxChildren).map(replaceTextNodes).flat();
    this.dom = [];
  }

  render(renderKit: RenderKit, parentElement: Element | undefined) {
    this.dom = this.generateDom(renderKit);
    this.attachToParent(parentElement);
    return this.dom;
  }

  rerender(renderKit: RenderKit, parentElement: Element | undefined) {
    this.dom = this.generateDom(renderKit);
    this.attachToParent(parentElement);
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    return recursiveRender(this.collection, renderKit);
  }

  attachToParent(parentElement: Element | undefined) {
    if (!parentElement) return;

    this.dom.forEach((dom) => {
      parentElement.appendChild(dom);
    });
  }

  remove() {
    this.collection.forEach((child) => child.remove());
  }
}
