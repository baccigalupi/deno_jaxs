import reducer from '../../lib/reducers/location';

import { assert } from 'chai';

describe('location reducer', () => {
  afterEach(() => {
    global.location = undefined;
  });

  it('builds an initial state from the global location', () => {
    global.location = {
      hash: '',
      pathname: '/',
      search: '',
    };

    const state = reducer();
    assert.deepEqual(state, {
      hash: '',
      path: '/',
      queryParams: {},
    });
  });

  it('parses query params', () => {
    global.location = {
      hash: '',
      pathname: '/',
      search: '?foo=bar&zardoz=false',
    };

    const state = reducer();
    assert.deepEqual(state, {
      hash: '',
      path: '/',
      queryParams: {
        foo: 'bar',
        zardoz: 'false',
      },
    });
  });

  it('extracts the hash', () => {
    global.location = {
      hash: '#pound',
      pathname: '/',
      search: '',
    };

    const state = reducer();
    assert.deepEqual(state, {
      hash: 'pound',
      path: '/',
      queryParams: {},
    });
  });

  it('renames the pathname to path', () => {
    global.location = {
      hash: '',
      pathname: '/goodbye/zardoz',
      search: '',
    };

    const state = reducer();
    assert.deepEqual(state, {
      hash: '',
      path: '/goodbye/zardoz',
      queryParams: {},
    });
  });
});
