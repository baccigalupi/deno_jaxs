import { RenderKit, Template, TemplateDomCollection } from '../types.ts';
import { ensureArray } from '../utilities/array.ts';
import { recursiveRender, replaceTextNodes } from '../utilities/children.js';

export default class Children implements Template {
  collection: Array<Template>;
  dom: TemplateDomCollection;
  parentElement: Element | undefined;

  constructor(jsxChildren: Array<Template>) {
    this.collection = ensureArray(jsxChildren).map(replaceTextNodes).flat();
    this.dom = [];
  }

  render(renderKit: RenderKit, parentElement: Element | undefined) {
    this.parentElement = parentElement;
    this.dom = this.generateDom(renderKit);
    this.attachToParent();
    return this.dom;
  }

  updatable(other: Template) {
    return other.constructor === Children;
  }

  rerender(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    this.attachToParent();
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    return recursiveRender(this.collection, renderKit);
  }

  attachToParent() {
    if (this.parentElement === undefined) return;

    const parent = this.parentElement as Element;
    this.dom.forEach((dom) => {
      parent.appendChild(dom);
    });
  }

  remove() {
    this.collection.forEach((child) => child.remove());
  }
}
