import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import { isArray } from '../../lib/utilities/array.ts';

const defaultContent = '<div id=\'app\'></div>';

export const createTestDom = (content = defaultContent) => {
  return new DOMParser().parseFromString(
    `<!DOCTYPE html><body>${content}<body>`,
    'text/html',
  );
};

export const domToString = (element) => {
  if (element.outerHTML) return element.outerHTML;
  if (isArray(element)) return wrapElements(element).outerHTML;

  return element.body.outerHTML;
};

const wrapElements = (elements) => {
  const document = createTestDom();
  const wrapper = document.createElement('div');
  elements.forEach((element) => {
    wrapper.appendChild(element);
  });
  return wrapper;
};
