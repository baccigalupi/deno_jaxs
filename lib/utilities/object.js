export const cloneWithDefaults = (_attributes, defaultValue = '') => {
  const attributes = { ..._attributes }
  for (let key in attributes) {
    const value = attributes[key]
    attributes[key] = value === undefined ? defaultValue : value
  }
  return attributes
}

export const separateAttrsAndEvents = (combined, defaultValue = '') => {
  const attributes = {}
  const events = {}

  for (let key in combined) {
    const value = combined[key]
    if (key.match(/on.+/i)) {
      const eventKey = key.slice(2).toLowerCase()
      events[eventKey] = value
    } else {
      attributes[key] = value === undefined ? defaultValue : value
    }
  }

  return {
    attributes,
    events
  }
}

export const shallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) return false

  return !keys1.reduce((bool, key) => {
    return bool && object1[key] !== object2[key]
  }, false)
}

export const normalizeKey = (object, key, defaultValue = '') => {
  if (object[key] === undefined) return defaultValue
  return object[key]
}
