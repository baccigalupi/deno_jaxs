export const isArray = Array.isArray;

// deno-lint-ignore no-explicit-any
export const ensureArray = (children: any) => {
  if (isArray(children)) {
    return children;
  }

  if (!children) {
    return [];
  }

  return [children];
};
