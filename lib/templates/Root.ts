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

  updatable(_other: Template) {
    return true; // Root templates should never be asked this!
    // They are the top of the stack.
  }

  rerender(renderKit: RenderKit) {
    const template = this.Template({});

    // if (this.template === undefined || !this.template.updatable(template)) {
    //   return this.replaceWith(template, renderKit);
    // }
    //
    //    this.template.update(new template)
    //    return this.dom;

    this.dom = this.generateDom(renderKit);
    this.attachToParent();
    return this.dom;
  }

  replaceWith(template: Template, renderKit: RenderKit) {
    this.dom = template.render(renderKit);
    // this.template.replaceDom(dom);
    this.template = template;
    return this.dom;
  }

  replaceDom(dom: TemplateDomCollection) {
    // no-op; Root elements have no parents to call this
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
