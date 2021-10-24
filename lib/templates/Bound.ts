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
  viewModelProps: State;
  props: Attributes;
  dom: TemplateDomCollection;

  constructor(
    Template: TemplateCreator,
    viewModel: ViewModel,
    attributes: Attributes,
  ) {
    this.Template = Template;
    this.viewModel = viewModel;
    this.attributes = attributes || {};
    this.viewModelProps = {};
    this.props = {};
    this.dom = [];
  }

  render(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    return this.dom;
  }

  rerender(renderKit: RenderKit) {
    this.dom = this.generateDom(renderKit);
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    const state = renderKit.state || {};
    this.viewModelProps = this.viewModel(state);

    this.props = {
      ...this.viewModelProps,
      ...this.attributes,
    };

    this.template = this.Template(this.props);
    return this.template.render(renderKit);
  }

  remove() {
    this.template && this.template.remove();
  }
}

export const bind = (Template: TemplateCreator, viewModel: ViewModel) => {
  return (attributes: Attributes) => new Bound(Template, viewModel, attributes);
};
