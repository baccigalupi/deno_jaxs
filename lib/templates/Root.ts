import {
  RenderKit,
  Template,
  TemplateCreator,
  TemplateDomCollection,
} from '../types.ts';

export class Root implements Template {
  Template: TemplateCreator;
  selector: string;
  document: Document;
  parentElement: Element | null;
  dom: TemplateDomCollection;
  template: Template | undefined;

  constructor(Template: TemplateCreator, selector: string, document = null) {
    this.Template = Template;
    this.selector = selector;
    this.document = document || window.document;
    this.parentElement = this.document.querySelector(selector);
    this.dom = [];
  }

  render(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    this.attachToParent();
    return this.dom;
  }

  rerender(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    this.attachToParent();
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    this.template = this.Template({});
    return this.template.render(renderKit);
  }

  attachToParent() {
    if (this.parentElement == null) return;

    const parent = this.parentElement as Element;
    parent.innerHTML = '';
    this.dom.forEach((element) => parent.appendChild(element));
  }

  remove() {
    this.template && this.template.remove();
  }
}
