import events from '../store/events.js';
import { createReducer } from '../store/reducerUtilities.js';

const transformer = (_, payload) => payload;
export default createReducer(events.store.refreshToken)
  .initialState('')
  .transform(transformer);
