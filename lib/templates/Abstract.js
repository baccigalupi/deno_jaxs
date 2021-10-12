import { isArray } from '../utilities/array.ts';
import { shallowEqual } from '../utilities/object.ts';
import { cloneWithDefaults } from '../utilities/object.ts';
import Children from './Children.ts';

export default class AbstractTag {
  constructor(type, attributes, children) {
    this.type = type;
    this.attributes = cloneWithDefaults(attributes);
    this.children = children;
  }

  render({ props, document, publish, state }) {
    props = props || {};
    this.props = props;
    this.renderedAttributes = this.normalizeRenderedAttributes(props);

    this.template = this.type(this.renderedAttributes);

    if (isArray(this.template)) {
      this.template = new Children(this.template);
    }

    return this.template.render({
      document,
      publish,
      state,
      props: this.renderedAttributes,
      children: this.children,
    });
  }

  attributesWillChange(props) {
    const normalizedAttributes = this.normalizeRenderedAttributes(props);
    return !shallowEqual(this.renderedAttributes, normalizedAttributes);
  }

  childrenDifferent(renderStuff) {
    if (!renderStuff.children) return false;
    return this.children !== renderStuff.children;
  }

  childrenWillChange(renderStuff) {
    let willChange = false;
    const length = this.children.length;
    for (let i = 0; i < length; i++) {
      willChange = this.children[i].willChange(renderStuff);
      if (willChange) break;
    }
    return willChange;
  }

  // renderStuff { props, children, state }
  willChange(renderStuff) {
    if (this.attributesWillChange(renderStuff.props)) return true;
    if (this.childrenDifferent(renderStuff)) return true;
    return this.childrenWillChange(renderStuff);
  }

  rerender({ props, document, state, publish }) {
    this.removeListeners();
    this.removeDom();

    props = props || {};
    this.props = props;
    this.renderedAttributes = this.normalizeRenderedAttributes(props);

    this.template = this.type(this.renderedAttributes);
    if (isArray(this.template)) {
      this.template = new Fragment(this.template);
    }

    return this.template.rerender({
      document,
      publish,
      state,
      props: this.renderedAttributes,
      children: this.children,
    });
  }

  normalizeRenderedAttributes(props) {
    const attributes = { children: this.children };
    for (const key in this.attributes) {
      const values = [props[key], this.attributes[key], ''];
      attributes[key] = values.find((value) => value !== undefined);
    }
    return attributes;
  }

  removeListeners() {
    this.template.removeListeners();
  }

  removeDom() {
    this.template.removeDom();
  }
}
