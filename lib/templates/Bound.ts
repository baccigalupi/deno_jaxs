import {
  Attributes,
  RenderKit,
  State,
  Template,
  TemplateCreator,
  TemplateDomCollection,
  ViewModel,
} from '../types.ts';

import { shallowEqual } from '../utilities/object.ts';

export class Bound implements Template {
  Template: TemplateCreator;
  template: Template | undefined;
  viewModel: ViewModel;
  attributes: Attributes;
  props: Attributes;
  dom: TemplateDomCollection;
  generatesJsx: boolean;

  constructor(
    Template: TemplateCreator,
    viewModel: ViewModel,
    attributes: Attributes,
  ) {
    this.Template = Template;
    this.dom = [];
    this.generatesJsx = true;

    this.viewModel = viewModel;
    this.attributes = attributes || {};
    this.props = {};
  }

  render(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    return this.dom;
  }

  updatable(_other: Template) {
    return true;
  }

  replaceDom(_dom: TemplateDomCollection) {
    // no-op
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

  generateDom(renderKit: RenderKit) {
    const { props, template } = this.generateTemplate(renderKit);
    this.props = props;
    this.template = template;
    return this.template.render(renderKit);
  }

  generateTemplate(renderKit: RenderKit) {
    const state = renderKit.state || {};
    const viewModelProps = this.viewModel(state);

    const props = {
      ...viewModelProps,
      ...this.attributes,
    };

    const template = this.Template(props);
    return { props, template };
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

  remove() {
    this.template && this.template.remove();
  }
}

export const bind = (Template: TemplateCreator, viewModel: ViewModel) => {
  return (attributes: Attributes) => new Bound(Template, viewModel, attributes);
};
