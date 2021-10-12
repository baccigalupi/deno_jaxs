import {
  Attributes,
  RenderKit,
  Template,
  TemplateCreator,
  TemplateDom,
} from '../types.ts';
import { isArray } from '../utilities/array.ts';
import { shallowEqual } from '../utilities/object.ts';
import { cloneWithDefaults } from '../utilities/object.ts';
import Children from './Children.ts';

export default class AbstractTag implements Template {
  type: TemplateCreator;
  attributes: Attributes;
  children: Array<Template>;
  props: Attributes;
  renderedAttributes: Attributes;
  template: Template | undefined;
  dom: TemplateDom | undefined;

  constructor(
    type: TemplateCreator,
    attributes: Attributes,
    children: Array<Template>,
  ) {
    this.type = type;
    this.attributes = cloneWithDefaults(attributes);
    this.children = children;
    this.props = {};
    this.renderedAttributes = {};
  }

  render({ props, document, publish, state }: RenderKit) {
    props = props || {};
    this.props = props;
    this.renderedAttributes = this.normalizeRenderedAttributes(props);

    this.template = this.type(this.renderedAttributes);

    if (isArray(this.template)) {
      this.template = new Children(this.template);
    }

    this.dom = this.template.render({
      document,
      publish,
      state,
      props: this.renderedAttributes,
      children: this.children,
    }) as TemplateDom;

    return this.dom;
  }

  attributesWillChange(props: Attributes) {
    const normalizedAttributes = this.normalizeRenderedAttributes(props);
    return !shallowEqual(this.renderedAttributes, normalizedAttributes);
  }

  childrenDifferent(renderKit: RenderKit) {
    if (!renderKit.children) return false;
    return this.children !== renderKit.children;
  }

  childrenWillChange(renderKit: RenderKit) {
    let willChange = false;
    const length = this.children.length;
    for (let i = 0; i < length; i++) {
      willChange = this.children[i].willChange(renderKit);
      if (willChange) break;
    }
    return willChange;
  }

  willChange(renderKit: RenderKit) {
    if (this.attributesWillChange(renderKit.props || {})) return true;
    if (this.childrenDifferent(renderKit)) return true;
    return this.childrenWillChange(renderKit);
  }

  rerender(renderKit: RenderKit) {
    if (!this.willChange(renderKit)) return this.dom as TemplateDom;

    const { props, document, state, publish } = renderKit;
    this.remove();

    this.props = props || {};
    this.renderedAttributes = this.normalizeRenderedAttributes(this.props);

    this.template = this.type(this.renderedAttributes);
    if (isArray(this.template)) {
      this.template = new Children(this.template);
    }

    return this.template.rerender({
      document,
      publish,
      state,
      props: this.renderedAttributes,
      children: this.children,
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

  remove() {
    this.template && this.template.remove();
  }
}
