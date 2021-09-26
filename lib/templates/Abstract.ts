import {
  Attributes,
  Children,
  RenderKit,
  Template,
  TemplateCreator,
} from '../types.ts';
import { isArray } from '../utilities/array.ts';
import { cloneWithDefaults } from '../utilities/object.ts';
import Fragment from './Fragment.js';

export default class AbstractTag {
  type: TemplateCreator;
  attributes: Attributes;
  children: Children;

  props: Attributes | undefined;
  template: Template | undefined;
  renderedAttributes: Attributes | undefined;

  constructor(
    type: TemplateCreator,
    attributes: Attributes,
    children: Children,
  ) {
    this.type = type;
    this.attributes = cloneWithDefaults(attributes);
    this.children = children;
  }

  render({ props, document, publish, state }: RenderKit) {
    this.props = props || {};
    this.renderedAttributes = this.normalizeRenderedAttributes(props || {});

    const template = this.type(this.renderedAttributes);

    if (isArray(template)) {
      this.template = new Fragment(this.template);
    } else {
      this.template = template;
    }

    return this.template.render({
      document,
      publish,
      state,
      props: this.renderedAttributes,
      children: this.children,
    });
  }

  rerender({ props, document, state, publish }: RenderKit) {
    this.removeListeners();
    this.removeDom();

    return this.render({
      props,
      document,
      state,
      publish,
    });
  }

  normalizeRenderedAttributes(props: Attributes) {
    const attributes: Attributes = { children: this.children };
    for (const key in this.attributes) {
      const values = [props[key], this.attributes[key], ''];
      attributes[key] = values.find((value) => value !== undefined);
    }
    return attributes;
  }

  removeListeners() {
    this.template && this.template.removeListeners();
  }

  removeDom() {
    this.template && this.template.removeDom();
  }
}
