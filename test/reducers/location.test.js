import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import {
  locationChanged,
  normalizeHash,
  queryParams,
} from '../../lib/reducers/location.js';

// TODO: headles browser integration test for full reducer since Deno messes
// with the global location

const { describe, it, run } = testSuite();

describe('Reducers', () => {
  describe('location functions', () => {
    it('parses query params', () => {
      assertEquals(queryParams('?foo=bar&zardoz=false'), {
        foo: 'bar',
        zardoz: 'false',
      });
    });

    it('extracts the hash', () => {
      assertEquals(normalizeHash('#pound'), 'pound');
    });

    describe('locationChanged', () => {
      it('is true if the path changes', () => {
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

      it('is true if the query changes', () => {
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

      it('is true if the hash changes', () => {
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

      it('is false if nothing changed', () => {
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
    });
  });
});

await run();
