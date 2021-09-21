import { createReducer } from '../store/reducerUtilities';
import { shallowEqual } from '../utilities/object';

const normalizeHash = (hash) => {
  return hash[0] === '#' ? hash.slice(1) : hash;
};

const queryParams = (queryString) => {
  return queryString
    .replace(/^\?/, '')
    .split('&')
    .reduce((aggregate, pairString) => {
      if (!pairString) return aggregate;

      const pair = pairString.split('=');
      aggregate[pair[0]] = pair[1];
      return aggregate;
    }, {});
};

const locationChanged = (state, locationData) => {
  if (!state) return true;
  return (
    locationData.hash !== state.hash ||
    locationData.path !== state.path ||
    !shallowEqual(locationData.queryParams, state.queryParams)
  );
};

const dataFromLocation = () => {
  const { hash, pathname, search } = location;
  return {
    hash: normalizeHash(hash),
    path: pathname,
    queryParams: queryParams(search),
  };
};

const transformer = (state) => {
  const locationData = dataFromLocation();

  if (locationChanged(state, locationData)) {
    return locationData;
  } else {
    return state;
  }
};

export default createReducer('updateLocation')
  .initialState(() => dataFromLocation())
  .transform(transformer);
