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

// deno-lint-ignore no-explicit-any
type Iterator = (element: any) => boolean;
// deno-lint-ignore no-explicit-any
export const any = (array: Array<any>, iterator: Iterator): boolean => {
  let isTrue = false;
  const length = array.length;
  for (let index = 0; index < length; index++) {
    isTrue = iterator(array[index]);
    if (isTrue) break;
  }
  return isTrue;
};
