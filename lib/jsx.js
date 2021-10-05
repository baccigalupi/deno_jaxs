import TagTemplate from './templates/Tag.ts';
import AbstractTemplate from './templates/Abstract.js';
import FragmentTemplate from './templates/Fragment.js';

const jsx = (type, attributes, ...children) => {
  if (typeof type === 'string') {
    return new TagTemplate(type, attributes, children);
  } else {
    return new AbstractTemplate(type, attributes, children);
  }
};

jsx.fragment = (attributes, maybeChildren) => {
  const children = maybeChildren || attributes.children || [];
  return new FragmentTemplate(children);
};

export default jsx;
