import {
  Attributes,
  DomEventListeners,
  EventAttributes,
  RenderKit,
  Template,
  TemplateDomCollection,
} from '../types.ts';
import Children from './Children.ts';
import {
  appendAfter,
  createDecoratedNode,
  removeListeners,
} from '../utilities/dom.js';
import { separateAttrsAndEvents } from '../utilities/object.ts';

export default class TagTemplate implements Template {
  type: string;
  events: EventAttributes;
  listeners: DomEventListeners;
  attributes: Attributes;
  children: Children;
  dom: TemplateDomCollection;

  constructor(
    tagType: string,
    combinedAttributes: Attributes,
    children: Array<Template>,
  ) {
    this.type = tagType;
    const { events, attributes } = separateAttrsAndEvents(combinedAttributes);
    this.events = events;
    this.attributes = attributes;
    this.listeners = {};
    this.children = new Children(children);
    this.dom = [];
  }

  render(renderKit: RenderKit): TemplateDomCollection {
    const { dom, listeners } = this.generateDom(renderKit);
    if (!dom) return this.dom;

    this.children.render(renderKit, dom);
    this.dom = [dom];
    this.listeners = listeners as DomEventListeners;
    return this.dom;
  }

  updatable(other: Template) {
    return other.constructor === TagTemplate &&
      (other as TagTemplate).type === this.type;
  }

  replaceDom(dom: TemplateDomCollection) {
    this.removeDependents();

    this.dom[0].replaceWith(dom[0]);
    let lastElement = dom[0];

    dom.forEach((element, index) => {
      if (index === 0) {
        lastElement = element;
        return;
      }

      appendAfter(element, lastElement);
      lastElement = element;
    });
  }

  // Rerendering self, has to happen from parent who can compare template objects:
  // create new template
  // check to see if the tag type, attributes or events have changed.
  // if changed tag type changed, `this.dom.replaceWith(newTemplateDom)`
  // else if attributes, diff and remove/add
  //           if events changed, diff remove/add
  //
  // Then tell children to rerender
  rerender(renderKit: RenderKit): TemplateDomCollection {
    const { dom, listeners } = this.generateDom(renderKit);
    if (!dom) return this.dom;

    this.children.render(renderKit, dom);
    this.dom = [dom];
    this.listeners = listeners as DomEventListeners;
    return this.dom;
  }

  generateDom(renderKit: RenderKit) {
    return createDecoratedNode(
      this.type,
      this.attributes,
      this.events,
      renderKit,
    );
  }

  removeDependents() {
    this.children.remove();
    this.removeListeners();
  }

  remove() {
    this.removeDependents();
    this.removeDom();
  }

  removeListeners() {
    this.dom.forEach((element) => removeListeners(element, this.listeners));
  }

  removeDom() {
    this.dom.forEach((element) => element.remove());
  }
}
