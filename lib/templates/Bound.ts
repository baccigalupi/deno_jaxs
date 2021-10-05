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

  // TODO: are props used here??? Simplify if possible
  render({ document, props, publish, state }: RenderKit) {
    props = props || {};
    state = state || {};
    this.viewModelProps = this.viewModel(state);

    this.props = {
      ...this.viewModelProps,
      ...props,
      ...this.attributes,
    };

    this.template = this.Template(this.props);

    return this.template.render({
      document,
      publish,
      state,
      props: this.props,
    });
  }

  willChange({ state }: RenderKit) {
    state = state || {};
    const modelState = this.viewModel(state);
    return !shallowEqual(this.viewModelProps, modelState);
  }

  rerender({ document, state, publish }: RenderKit) {
    state = state || {};
    this.viewModelProps = this.viewModel(state);

    this.props = {
      ...this.props,
      ...this.viewModelProps,
      ...this.attributes,
    };

    this.template = this.Template(this.props);

    return this.template.rerender({
      document,
      publish,
      state,
      props: this.props,
    });
  }

  remove() {
    this.template && this.template.remove();
  }
}

export const bind = (Template: TemplateCreator, viewModel: ViewModel) => {
  return (attributes: Attributes) => new Bound(Template, viewModel, attributes);
};
