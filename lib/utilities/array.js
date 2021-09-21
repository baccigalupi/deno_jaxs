export const isArray = (obj) => Array.isArray(obj);

export const ensureArray = (children) => {
  if (isArray(children)) {
    return children;
  }

  if (!children) {
    return [];
  }

  return [children];
};
