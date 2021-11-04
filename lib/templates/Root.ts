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
  generatesJsx: boolean;

  constructor(Template: TemplateCreator, selector: string, document = null) {
    this.Template = Template;
    this.dom = [];
    this.generatesJsx = true;

    this.selector = selector;
    this.document = document || window.document;
    this.parentElement = this.document.querySelector(selector);
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
    if (this.template === undefined) return this.render(renderKit);

    const { template } = this.generateTemplate(renderKit);

    if (template.generatesJsx) {
      return template.rerender(renderKit);
    } else if (this.template.updatable(template)) {
      return this.update(template, renderKit);
    } else {
      return this.replaceWith(template, renderKit);
    }
  }

  replaceWith(template: Template, renderKit: RenderKit) {
    if (this.template === undefined) return this.dom;

    this.dom = template.render(renderKit);
    this.template.replaceDom(this.dom);
    this.template = template;
    return this.dom;
  }

  update(template: Template, renderKit: RenderKit) {
    if (this.template === undefined) return this.dom;

    this.template.update(template, renderKit);
    this.template = template;

    return this.dom;
  }

  replaceDom(dom: TemplateDomCollection) {
    // no-op; Root elements have no parents to call this
  }

  generateDom(renderKit: RenderKit) {
    const { template } = this.generateTemplate(renderKit);
    this.template = template;
    return this.template.render(renderKit);
  }

  generateTemplate(_renderKit: RenderKit) {
    const template = this.Template({});
    return { template };
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
