import { RenderKit, Template, TemplateDomCollection } from '../types.ts';
import { createTextNode } from '../utilities/dom.js';

export default class TextTemplate implements Template {
  dom: TemplateDomCollection;
  value: string;

  constructor(content: string) {
    this.value = content;
    this.dom = [];
  }

  render({ document }: RenderKit): TemplateDomCollection {
    this.dom = [createTextNode(this.value, document) as Text];
    return this.dom;
  }

  remove() {
    this.dom.forEach((element) => element.remove());
  }
}
