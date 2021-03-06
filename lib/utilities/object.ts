import { Attributes, AttributesAndEvents } from '../types.ts';

export const cloneWithDefaults = (
  rawAttributes: Attributes,
  defaultValue = '',
): Attributes => {
  const attributes = { ...rawAttributes };
  for (const key in attributes) {
    attributes[key] = normalizeValueForKey(attributes, key, defaultValue);
  }
  return attributes;
};

export const separateAttrsAndEvents = (
  combined: Attributes,
  defaultValue = '',
): AttributesAndEvents => {
  const attributes: Attributes = {};
  const events: Attributes = {};

  for (const key in combined) {
    const value = combined[key];
    if (key.match(/on.+/i)) {
      const eventKey = key.slice(2).toLowerCase();
      events[eventKey] = value;
    } else {
      attributes[key] = normalizeValueForKey(combined, key, defaultValue);
    }
  }

  return {
    attributes,
    events,
  };
};

export const shallowEqual = (object1: Attributes, object2: Attributes) => {
  if (!keysMatch(object1, object2)) return false;

  for (const key in object1) {
    if (object1[key] !== object2[key]) return false;
  }

  return true;
};

export const keysMatch = (object1: Attributes, object2: Attributes) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  const length = keys1.length;
  if (length !== keys2.length) return false;

  keys1.sort();
  keys2.sort();

  for (let i = 0; i < length; i++) {
    if (keys1[i] !== keys2[i]) return false;
  }

  return true;
};

export const normalizeValueForKey = (
  object: Attributes,
  key: string,
  defaultValue = '',
) => {
  if (object[key] === undefined) return defaultValue;
  return object[key];
};

export const removedKeys = (
  original: Attributes,
  newObject: Attributes,
): Array<string> => {
  const removed: Array<string> = [];
  Object.keys(original).reduce((aggregate, key) => {
    if (newObject[key] === undefined) aggregate.push(key);
    return aggregate;
  }, removed);
  return removed;
};

export const updateAttributes = (
  original: Attributes,
  newObject: Attributes,
): Attributes => {
  const updates: Attributes = {};
  Object.keys(newObject).reduce((aggregate, key) => {
    if (newObject[key] !== original[key]) {
      aggregate[key] = newObject[key];
    }
    return aggregate;
  }, updates);
  return updates;
};
