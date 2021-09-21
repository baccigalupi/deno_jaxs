import events from '../store/events';
import { createReducer } from '../store/reducerUtilities';

const transformer = (_, payload) => payload;
export default createReducer(events.store.refreshToken)
  .initialState('')
  .transform(transformer);
