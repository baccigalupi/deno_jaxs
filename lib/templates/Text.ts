import { RenderKit, Template } from '../types.ts';
import { createTextNode } from '../utilities/dom.js';

export default class TextTemplate implements Template {
  dom: Text | undefined;
  value: string;

  constructor(content: string) {
    this.value = content;
  }

  render({ document }: RenderKit): Text {
    this.dom = createTextNode(this.value, document) as Text;
    return this.dom;
  }

  rerender(_renderKit: RenderKit): Text {
    return this.dom as Text;
  }

  removeDom() {}
  removeListeners() {}
}
