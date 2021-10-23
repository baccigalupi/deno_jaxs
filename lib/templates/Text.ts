import { RenderKit, Template, TemplateDomCollection } from '../types.ts';
import { createTextNode } from '../utilities/dom.js';

export default class TextTemplate implements Template {
  dom: TemplateDomCollection;
  value: string;

  constructor(content: string) {
    this.value = content;
    this.dom = [];
  }

  render(renderKit: RenderKit): TemplateDomCollection {
    this.dom = this.generateDom(renderKit);
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    const textNode = createTextNode(this.value, renderKit.document);
    if (!textNode) return [];
    return [textNode];
  }

  remove() {
    this.dom.forEach((element) => element.remove());
  }
}
