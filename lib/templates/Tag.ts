import {
  Attributes,
  DomEventListeners,
  EventAttributes,
  RenderKit,
  Template,
} from '../types.ts';
import Children from './Children.js';
import { createDecoratedNode, removeListeners } from '../utilities/dom.js';
import { separateAttrsAndEvents, shallowEqual } from '../utilities/object.ts';

export default class TagTemplate implements Template {
  type: string;
  events: EventAttributes;
  listeners: DomEventListeners;
  attributes: Attributes;
  children: Children;
  dom: Element | undefined;

  constructor(
    tagType: string,
    combinedAttributes: Attributes,
    children: Array<Template>,
  ) {
    this.type = tagType;
    const { events, attributes } = separateAttrsAndEvents(combinedAttributes);
    this.events = events;
    this.attributes = attributes;
    this.listeners = [];
    this.children = new Children(children);
  }

  render(renderKit: RenderKit) {
    const { dom, listeners } = createDecoratedNode(
      this.type,
      this.attributes,
      this.events,
      renderKit,
    );

    this.children.renderIntoParent(dom, renderKit);
    this.dom = dom as Element;
    this.listeners = listeners;
    return this.dom;
  }

  willChange(renderKit: RenderKit) {
    const { props } = renderKit;

    const { attributes } = separateAttrsAndEvents({
      ...this.attributes,
      props,
    });

    return !shallowEqual(attributes, this.attributes);
  }

  rerender(renderKit: RenderKit) {
    const { props } = renderKit;
    const { events, attributes } = separateAttrsAndEvents({
      ...this.attributes,
      props,
    });

    if (shallowEqual(attributes, this.attributes)) {
      return this.dom as Element;
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

    this.dom = dom as Element;
    this.children.renderIntoParent(this.dom, renderKit);
    this.listeners = listeners;
    return this.dom;
  }

  remove() {
    this.removeListeners();
    this.removeDom();
  }

  removeListeners() {
    removeListeners(this.dom, this.listeners);
    this.children.removeListeners();
  }

  removeDom() {
    this.dom && this.dom.remove();
  }
}
