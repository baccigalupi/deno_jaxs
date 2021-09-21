import reducer from '../../lib/reducers/token';
import events from '../../lib/store/events';

import { assert } from 'chai';

describe('token reducer', () => {
  it('defaults to a falsey value', () => {
    assert.notOk(reducer());
  });

  it('ignores unrelated events', () => {
    const originalState = 'token-token-token';
    const action = { type: 'whatever', payload: 'new-token' };
    const newState = reducer(originalState, action);
    assert.equal(newState, originalState);
  });

  it('uses the payload as new state when the event is right', () => {
    const originalState = 'token-token-token';
    const event = events.store.refreshToken;
    const action = { type: event, payload: 'new-token' };
    const newState = reducer(originalState, action);
    assert.equal(newState, 'new-token');
  });
});
