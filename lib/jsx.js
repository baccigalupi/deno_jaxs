import TagTemplate from './templates/Tag.ts';
import AbstractTemplate from './templates/Abstract.ts';
import Children from './templates/Children.ts';

const jsx = (type, attributes, ...children) => {
  if (typeof type === 'string') {
    return new TagTemplate(type, attributes, children);
  }

  return new AbstractTemplate(type, attributes, children);
};

jsx.fragment = (attributes, maybeChildren) => {
  const children = maybeChildren || attributes.children || [];
  return new Children(children);
};

export default jsx;
