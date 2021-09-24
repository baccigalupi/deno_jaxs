import Children from './Children.js';
import { createDecoratedNode, removeListeners } from '../utilities/dom.js';
import { separateAttrsAndEvents } from '../utilities/object.ts';

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

  rerender(renderKit) {
    this.removeListeners();
    this.removeDom();
    return this.render(renderKit);
  }

  removeListeners() {
    removeListeners(this.dom, this.listeners);
    this.children.removeListeners();
  }

  removeDom() {
    this.dom.remove();
  }
}
