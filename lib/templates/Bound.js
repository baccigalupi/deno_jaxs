import { shallowEqual } from '../utilities/object.ts';

export class Bound {
  constructor(Template, viewModel, attributes) {
    this.Template = Template;
    this.viewModel = viewModel;
    this.attributes = attributes || {};
  }

  // TODO: are props used here??? Simplify if possible
  render({ document, props, publish, state }) {
    props = props || {};
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

  willChange(newState) {
    const modelState = this.viewModel(newState);
    return !shallowEqual(this.viewModelProps, modelState);
  }

  rerender({ document, state, publish }) {
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

  removeListeners() {
    this.template && this.template.removeListeners();
  }

  removeDom() {
    this.template && this.template.removeDom();
  }
}

export const bind = (Template, viewModel) => {
  return (attributes) => new Bound(Template, viewModel, attributes);
};
