import {
  Attributes,
  DomEventListeners,
  EventAttributes,
  RenderKit,
  Template,
} from '../types.ts';
import Children from './Children.ts';
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

  remove() {
    this.children.remove();
    this.removeListeners();
    this.removeDom();
  }

  removeListeners() {
    this.dom && removeListeners(this.dom, this.listeners);
  }

  removeDom() {
    this.dom && this.dom.remove();
  }
}
