import TagTemplate from './templates/Tag.ts';
import Children from './templates/Children.ts';

const ensureChildrenArray = (maybeChildren, attributes) =>
  maybeChildren || attributes.children || [];

const packageAttributes = (maybeAttributes, maybeChildren) => {
  const attributes = maybeAttributes || {};
  const children = ensureChildrenArray(maybeChildren, attributes);
  attributes.children = attributes.children || children;
  return attributes;
};

const jsx = (type, attributes, ...children) => {
  if (typeof type === 'string') {
    return new TagTemplate(type, attributes, children);
  }

  return type(packageAttributes(attributes, children));
};

jsx.fragment = (attributes, maybeChildren) => {
  const children = ensureChildrenArray(maybeChildren, attributes);
  return new Children(children);
};

export default jsx;
