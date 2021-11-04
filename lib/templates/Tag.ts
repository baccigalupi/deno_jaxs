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
  removeAttributesOnElement,
  removeListener,
  removeListeners,
  setAttributesOnElement,
  setEventsOnElement,
} from '../utilities/dom.js';
import {
  removedKeys,
  separateAttrsAndEvents,
  updateAttributes,
} from '../utilities/object.ts';

export default class TagTemplate implements Template {
  type: string;
  events: EventAttributes;
  listeners: DomEventListeners;
  attributes: Attributes;
  children: Children;
  dom: TemplateDomCollection;
  generatesJsx: boolean;

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
    this.generatesJsx = false;
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

  update(template: Template, renderKit: RenderKit) {
    if (this.dom.length !== 1) return this.dom;
    const [element] = this.dom;

    this.updateAttributes(element as Element, template as TagTemplate);
    this.updateListeners(
      element as Element,
      template as TagTemplate,
      renderKit,
    );
    this.children.update((template as TagTemplate).children, renderKit);

    return this.dom;
  }

  updateAttributes(element: Element, template: TagTemplate) {
    const newAttributes = template.attributes;
    const updates = updateAttributes(this.attributes, newAttributes);
    setAttributesOnElement(element, updates);
    const removals = removedKeys(this.attributes, newAttributes);
    removeAttributesOnElement(element, removals);
    this.attributes = newAttributes;
  }

  updateListeners(
    element: Element,
    template: TagTemplate,
    renderKit: RenderKit,
  ) {
    const dom = this.dom[0];
    const newEvents = template.events;
    const updates = updateAttributes(this.events, newEvents);
    const removals = removedKeys(this.events, newEvents);

    for (const eventName in updates) {
      removeListener(dom, eventName, this.listeners[eventName]);
    }
    removals.forEach((eventName) => {
      removeListener(dom, eventName, this.listeners[eventName]);
      delete this.listeners[eventName];
    })

    const newListeners = setEventsOnElement(
      element,
      updates,
      renderKit.publish,
    ) as DomEventListeners;

    for (const eventName in updates) {
      this.listeners[eventName] = newListeners[eventName];
    }
    
    this.events = newEvents;
  }

  // This shouldn't be called because it isn't a generator template
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
