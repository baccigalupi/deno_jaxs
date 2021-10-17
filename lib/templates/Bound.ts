import {
  Attributes,
  RenderKit,
  State,
  Template,
  TemplateCreator,
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
  }

  render({ document, publish, state }: RenderKit) {
    state = state || {};
    this.viewModelProps = this.viewModel(state);

    this.props = {
      ...this.viewModelProps,
      ...this.attributes,
    };

    this.template = this.Template(this.props);

    return this.template.render({
      document,
      publish,
      state,
    });
  }

  remove() {
    this.template && this.template.remove();
  }
}

export const bind = (Template: TemplateCreator, viewModel: ViewModel) => {
  return (attributes: Attributes) => new Bound(Template, viewModel, attributes);
};
