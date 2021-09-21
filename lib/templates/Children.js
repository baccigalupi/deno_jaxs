import { ensureArray, isArray } from '../utilities/array.js';
import TextTemplate from './Text.js';

/* three options for children
  1. there is no view
  2. view is an array, recurse
  3. view is a renderable thing
*/
const recursiveRender = (
  children,
  renderKit,
  rendered = [],
  method = 'render',
) => {
  return children
    .reduce((aggregate, view) => {
      if (!view) return aggregate;

      if (isArray(view)) {
        const dom = recursiveRender(view, renderKit, aggregate, method);
        return dom;
      }

      aggregate.push(view[method](renderKit));
      return aggregate;
    }, rendered)
    .flat();
};

const replaceTextNodes = (child) => {
  if (isTextNode(child)) {
    return textNode(child);
  }

  return child;
};

const isTextNode = (child) => {
  return typeof child === 'string' || typeof child === 'number';
};

const textNode = (content) => {
  return new TextTemplate(content);
};

export default class Children {
  constructor(jsxChildren) {
    this.collection = ensureArray(jsxChildren).map(replaceTextNodes).flat();
  }

  render(renderKit) {
    this.dom = recursiveRender(this.collection, renderKit);
    return this.dom;
  }

  rerender(renderKit) {
    return this.render(renderKit);
  }

  renderIntoParent(parentNode, renderKit) {
    this.render(renderKit).forEach((dom) => {
      parentNode.append(dom);
    });
  }

  rerenderIntoParent(parentNode, renderKit) {
    this.rerender(renderKit).forEach((dom) => {
      parentNode.append(dom);
    });
  }

  removeListeners() {
    this.collection.forEach((child) => child.removeListeners());
  }

  removeDom() {
    this.collection.forEach((child) => child.revomeDom());
  }
}
