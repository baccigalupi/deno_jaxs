import Children from './Children.js';
import { createDecoratedNode, removeListeners } from '../utilities/dom.js';
import { separateAttrsAndEvents, shallowEqual } from '../utilities/object.ts';

export default class TagTemplate {
  constructor(tagType, combinedAttributes, children) {
    this.type = tagType;
    const { events, attributes } = separateAttrsAndEvents(combinedAttributes);
    this.events = events;
    this.attributes = attributes;
    this.children = new Children(children);
  }

  render(renderKit) {
    const { dom, listeners } = createDecoratedNode(
      this.type,
      this.attributes,
      this.events,
      renderKit,
    );

    this.children.renderIntoParent(dom, renderKit);
    this.dom = dom;
    this.listeners = listeners;
    return this.dom;
  }

  willChange(renderKit) {
    const { props } = renderKit;

    const { attributes } = separateAttrsAndEvents({
      ...this.attributes,
      props,
    });

    console.log(this.attributes, attributes);

    return !shallowEqual(attributes, this.attributes);
  }

  rerender(renderKit) {
    const { props } = renderKit;
    const { events, attributes } = separateAttrsAndEvents({
      ...this.attributes,
      props,
    });

    if (shallowEqual(attributes, this.attributes)) {
      return this.dom;
    }

    this.removeListeners();
    this.removeDom();

    this.attributes = attributes;
    this.events = events;

    const { dom, listeners } = createDecoratedNode(
      this.type,
      this.attributes,
      this.events,
      renderKit,
    );

    this.children.renderIntoParent(dom, renderKit);
    this.dom = dom;
    this.listeners = listeners;
    return this.dom;
  }

  removeListeners() {
    removeListeners(this.dom, this.listeners);
    this.children.removeListeners();
  }

  removeDom() {
    this.dom.remove();
  }
}
