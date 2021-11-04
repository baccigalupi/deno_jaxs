import { RenderKit, Template, TemplateDomCollection } from '../types.ts';
import { appendAfter, createTextNode } from '../utilities/dom.js';

export default class TextTemplate implements Template {
  dom: TemplateDomCollection;
  value: string;
  generatesJsx: boolean;

  constructor(content: string) {
    this.value = content;
    this.dom = [];
    this.generatesJsx = false;
  }

  render(renderKit: RenderKit): TemplateDomCollection {
    this.dom = this.generateDom(renderKit);
    return this.dom;
  }

  updatable(other: Template) {
    return other.constructor === TextTemplate;
  }

  replaceDom(dom: TemplateDomCollection) {
    this.dom[0].replaceWith(dom[0]);
    let lastElement = dom[0];

    dom.forEach((element, index) => {
      if (index === 0) {
        lastElement = element;
        return;
      }

      appendAfter(element, lastElement);
      lastElement = element;
    });
  }

  rerender(renderKit: RenderKit): TemplateDomCollection {
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
