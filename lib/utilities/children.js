import { isArray } from './array.ts';
import TextTemplate from '../templates/Text.ts';

/* three options for children
  1. there is no view
  2. view is an array, recurse
  3. view is a renderable thing
*/
export const recursiveRender = (
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

export const replaceTextNodes = (child) => {
  if (isTextNode(child)) {
    return textNode(child);
  }

  return child;
};

export const isTextNode = (child) => {
  return typeof child === 'string' || typeof child === 'number';
};

export const textNode = (content) => {
  return new TextTemplate(content);
};
