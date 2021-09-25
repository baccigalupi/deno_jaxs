export const createEvent = (name: string) => {
  return { [name]: name };
};

export const storeEvent = (name: string) => {
  const eventName = `store:${name}`;
  return { [name]: eventName };
};

export default {
  store: {
    ...storeEvent('updateLocation'),
  },
};
