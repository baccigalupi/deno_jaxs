import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';

import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { ensureArray, isArray } from '../../lib/utilities/array.ts';

const { describe, it, run } = testSuite();

describe('Utilities', () => {
  describe('array', () => {
    it('isArray will check whether its an array', () => {
      assertEquals(isArray(''), false);
      assertEquals(isArray({}), false);
      assertEquals(isArray(undefined), false);
      assertEquals(isArray(null), false);
      assertEquals(isArray([]), true);
      assertEquals(isArray(['hello']), true);
    });

    describe('ensureArray', () => {
      it('converts values to array with that element', () => {
        assertEquals(ensureArray('foo'), ['foo']);
        assertEquals(ensureArray({}), [{}]);
      });

      it('turns falsey values into empty arrays', () => {
        assertEquals(ensureArray(''), []);
        assertEquals(ensureArray(null), []);
        assertEquals(ensureArray(undefined), []);
      });

      it('leaves arrays as they are', () => {
        assertEquals(ensureArray([]), []);
        assertEquals(ensureArray(['foo']), ['foo']);
      });
    });
  });
});

await run();
