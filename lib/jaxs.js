export { default as jsx } from './jsx.js';
export { default as createApp } from './app.js';
export { bind } from './templates/Bound.js';
export { default as router } from './app/routes.js';

import { linkSubscription } from './handlers/navigation.js';
import { noOpSubscription } from './handlers/noOp.js';

import { composeReducers, createReducer } from './store/reducerUtilities.js';
import location from './reducers/location.js';

export const subscriptions = {
  linkSubscription,
  noOpSubscription,
};

export const store = {
  createReducer,
  composeReducers,
  // combineReducer
};

export const reducers = {
  location,
};
