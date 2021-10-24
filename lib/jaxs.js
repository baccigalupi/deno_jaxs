export { default as jsx } from './jsx.js';
export { default as createApp } from './app.js';
export { bind } from './templates/Bound.ts';
export { default as router } from './app/router.ts';

import { linkSubscription } from './handlers/navigation.js';
import { noOpSubscription } from './handlers/noOp.js';

import Redux from 'https://dev.jspm.io/redux@4.0.5';
export const { createStore, combineReducers } = Redux;

export {
  composeReducers,
  createAction,
  createActions,
  createReducer,
} from 'https://raw.githubusercontent.com/baccigalupi/redaxted/main/mod.js';

import locationReducer from './reducers/location.js';

export const appHandlers = [
  linkSubscription,
  noOpSubscription,
];

export const appReducers = {
  location: locationReducer,
};
