import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import {
  locationChanged,
  normalizeHash,
  queryParams,
} from '../../lib/reducers/location.js';

// NOTE: location can't be mocked in Deno in a reasonable way, so this tests the utility functions
// around the reducer.

Deno.test('Reducers, location: parses query params', () => {
  assertEquals(queryParams('?foo=bar&zardoz=false'), {
    foo: 'bar',
    zardoz: 'false',
  });
});

Deno.test('Reducers, location: extracts the hash', () => {
  assertEquals(normalizeHash('#pound'), 'pound');
});

Deno.test('Reducers, location: location changed is true if the path changes', () => {
  const originalState = {
    hash: '#pound',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  const newState = {
    hash: '#pound',
    path: '/new-path',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  assertEquals(locationChanged(originalState, newState), true);
});

Deno.test('Reducers, location: location changed is true if the query changes', () => {
  const originalState = {
    hash: '#pound',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  const newState = {
    hash: '#pound',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'true',
      something: 'else',
    },
  };

  assertEquals(locationChanged(originalState, newState), true);
});

Deno.test('Reducers, location: location changed is true if the hash changes', () => {
  const originalState = {
    hash: '#pound',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  const newState = {
    hash: '#pounder',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  assertEquals(locationChanged(originalState, newState), true);
});

Deno.test('Reducers, location: location changed is false if nothing changed', () => {
  const originalState = {
    hash: '#pound',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  const newState = {
    hash: '#pound',
    path: '/',
    queryParams: {
      foo: 'bar',
      zardoz: 'false',
    },
  };

  assertEquals(locationChanged(originalState, newState), false);
});
