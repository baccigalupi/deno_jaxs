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

  render(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    return recursiveRender(this.collection, renderKit);
  }

  renderIntoParent(parentNode: Element, renderKit: RenderKit) {
    this.render(renderKit).forEach((dom) => {
      parentNode.appendChild(dom);
    });
  }

  remove() {
    this.collection.forEach((child) => child.remove());
  }
}
