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
    // generate new template
    // check whether new template should replace old
    // if replace
    //    this.template = new template
    //    dom = this.template.render
    //    this.dom.replaceWith(dom);
    //    return this.dom;
    // if update
    //    this.template.update(new template)
    //    return this.dom;

    this.dom = this.generateDom(renderKit);
    this.attachToParent();
    return this.dom;
  }

  updatable(_other: Template) {
    return true; // Root templates should never be asked this!
    // They are the top of the stack.
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
