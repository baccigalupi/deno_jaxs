import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import {
  cloneWithDefaults,
  separateAttrsAndEvents,
  shallowEqual,
} from '../../lib/utilities/object.ts';

const { describe, it, run } = testSuite();

describe('Utilities', () => {
  describe('object', () => {
    describe('cloneWithDefaults', () => {
      it('converts undefined to empty strings', () => {
        assertEquals(cloneWithDefaults({ hello: undefined }), { hello: '' });
      });

      it('leaves null, and empty values as is', () => {
        assertEquals(cloneWithDefaults({ hello: null }), { hello: null });
        assertEquals(cloneWithDefaults({ hello: '' }), { hello: '' });
        assertEquals(cloneWithDefaults({ hello: 0 }), { hello: 0 });
        assertEquals(cloneWithDefaults({ hello: [] }), { hello: [] });
      });

      it('converts undefined to alternative values', () => {
        const cloned = cloneWithDefaults({ hello: undefined }, 'gerbil');
        assertEquals(cloned, { hello: 'gerbil' });
      });
    });

    it('separateAttrsAndEvents returns separate hashes', () => {
      const combined = {
        onClick: 'submit-something',
        class: 'bg-white text-black',
      };

      const { events, attributes } = separateAttrsAndEvents(combined);

      assertEquals(events, { click: 'submit-something' });
      assertEquals(attributes, { class: 'bg-white text-black' });
    });

    describe('shallowEqual', () => {
      it('is not equal with different key lengths', () => {
        const small = {
          one: 'one',
        };

        const bigger = {
          one: 'one',
          two: 'two',
        };

        assertEquals(shallowEqual(small, bigger), false);
      });

      it('is not equal with different values', () => {
        const almost = {
          one: 'one',
          two: 2,
        };

        const original = {
          one: 'one',
          two: 'two',
        };

        assertEquals(shallowEqual(almost, original), false);
      });

      it('is not equal with different values', () => {
        const same = {
          one: 'one',
          two: 'two',
        };

        const original = {
          one: 'one',
          two: 'two',
        };

        assertEquals(shallowEqual(same, original), true);
      });

      it('will only test that nested objects/arrays are the same object', () => {
        const arr: Array<string> = [];
        assertEquals(shallowEqual({ arr: arr }, { arr: arr }), true);
        assertEquals(shallowEqual({ arr: arr }, { arr: [] }), false);

        const obj = {};
        assertEquals(shallowEqual({ obj: obj }, { obj: obj }), true);
        assertEquals(shallowEqual({ obj: obj }, { obj: {} }), false);
      });
    });
  });
});

await run();
