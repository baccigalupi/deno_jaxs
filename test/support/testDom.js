import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { isArray } from '../../lib/utilities/array';

const defaultContent = '<div id=\'app\'></div>';

let currentDom;

export const createTestDom = (content = defaultContent) => {
  const dom = new JSDOM(`<!DOCTYPE html><body>${content}<body>`, {
    url: 'http://localhost',
  });
  currentDom = dom;
  return dom.window.document;
};

export const domToString = (element) => {
  if (element.outerHTML) return element.outerHTML;
  if (isArray(element)) return wrapElements(element).outerHTML;

  return element.body.outerHTML;
};

const wrapElements = (elements) => {
  const document = currentDom.window.document;
  const wrapper = document.createElement('div');
  elements.forEach((element) => {
    wrapper.append(element);
  });
  return wrapper;
};

export const mockEvent = (target) => {
  return {
    preventDefault: sinon.fake(),
    stopPropagation: sinon.fake(),
    target,
  };
};
