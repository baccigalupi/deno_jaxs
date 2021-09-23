import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { ensureArray, isArray } from '../../lib/utilities/array.js';

Deno.test('Utilities, array: isArray will check whether its an array', () => {
  assertEquals(isArray(''), false);
  assertEquals(isArray({}), false);
  assertEquals(isArray(undefined), false);
  assertEquals(isArray(null), false);
  assertEquals(isArray([]), true);
  assertEquals(isArray(['hello']), true);
});

Deno.test('Utilities, array: ensureArray converts values to array with that element', () => {
  assertEquals(ensureArray('foo'), ['foo']);
  assertEquals(ensureArray({}), [{}]);
});

Deno.test('Utilities, array: ensureArray turns falsey values into empty arrays', () => {
  assertEquals(ensureArray(''), []);
  assertEquals(ensureArray(null), []);
  assertEquals(ensureArray(undefined), []);
});

Deno.test('Utilities, array: leaves arrays as they are', () => {
  assertEquals(ensureArray([]), []);
  assertEquals(ensureArray(['foo']), ['foo']);
});
