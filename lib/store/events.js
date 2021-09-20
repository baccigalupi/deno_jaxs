export const createEvent = (name) => {
  return { [name]: name }
}

export const storeEvent = (name) => {
  const eventName = `store:${name}`
  return { [name]: eventName }
}

export default {
  store: {
    ...storeEvent('refreshToken'),
    ...storeEvent('updateLocation')
  }
}
