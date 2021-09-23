export const isArray = Array.isArray;

export const ensureArray = (children) => {
  if (isArray(children)) {
    return children;
  }

  if (!children) {
    return [];
  }

  return [children];
};
