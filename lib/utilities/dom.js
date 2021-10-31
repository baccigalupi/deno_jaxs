// Note about TS in Deno with DOM stuff:
// The existing libraries for types and their mapping is not useful or viable.
// I lost hours and found no bugs.

export const findTag = (tagName, node) => {
  tagName = tagName.toUpperCase();
  while (node.tagName !== tagName) {
    node = node.parentNode;
  }
  return node;
};

export const findHref = (node) => {
  if (!node || !node.getAttribute) return '';

  while (!node.getAttribute('href')) {
    node = node.parentNode;
    if (!node || !node.getAttribute) return '';
  }

  return node.getAttribute('href');
};

export const setAttributesOnElement = (element, attributes) => {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

export const setEventsOnElement = (element, events, publish) => {
  const listeners = [];
  for (const domEvent in events) {
    const eventName = events[domEvent];
    const listener = (event) => publish(eventName, event);
    listeners.push({ event: domEvent, listener });
    element.addEventListener(domEvent, listener);
  }
  return listeners;
};

export const removeListeners = (element, listeners) => {
  listeners.forEach(({ event, listener }) => {
    element.removeEventListener(event, listener);
  });
};

export const createNode = (type, document) => {
  document = document || window.document;
  return document.createElement(type);
};

export const createTextNode = (value, document) => {
  document = document || window.document;
  return document.createTextNode(value);
};

export const createDecoratedNode = (type, attributes, events, renderKit) => {
  const dom = createNode(type, renderKit.document);
  setAttributesOnElement(dom, attributes);
  const listeners = setEventsOnElement(dom, events, renderKit.publish);
  return { dom, listeners };
};

export const appendAfter = (newElement, sibling) => {
  sibling.parentNode.insertBefore(newElement, sibling.nextSibling);
};
