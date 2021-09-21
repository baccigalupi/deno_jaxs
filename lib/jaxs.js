export { default as jsx } from './jsx';
export { default as createApp } from './app';
export { bind } from './templates/Bound';
export { default as router } from './app/routes';

import { linkSubscription } from './handlers/navigation';
import { noOpSubscription } from './handlers/noOp';

import { composeReducers, createReducer } from './store/reducerUtilities';
import location from './reducers/location';

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
