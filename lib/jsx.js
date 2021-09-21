import TagTemplate from './templates/Tag';
import AbstractTemplate from './templates/Abstract';
import FragmentTemplate from './templates/Fragment';

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
