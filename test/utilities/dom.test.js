import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { findHref, findTag } from '../../lib/utilities/dom.js';

import { createTestDom } from '../support/testDom.js';

Deno.test('DOM utilities: findHref finds the href when it is the direct target node', () => {
  const document = createTestDom('<a id="find-me" href="/foo"></a>');
  const node = document.getElementById('find-me');
  assertEquals(findHref(node), '/foo');
});

Deno.test('DOM utilities: findHref finds the href at the nearest parent when not available on target node', () => {
  const document = createTestDom(
    '<a id="find-me" href="/foo"><ul><li id="click-me">Click me</li></ul></a>',
  );
  const node = document.getElementById('click-me');
  assertEquals(findHref(node), '/foo');
});

Deno.test('DOM utilities: findTag finds the current node when it has a matching tag', () => {
  const document = createTestDom('<a id="find-me" href="/foo"></a>');
  const node = document.getElementById('find-me');
  assertEquals(findTag('a', node), node);
});

Deno.test('DOM utilities: findTag finds nearest parent node when not the right tag name', () => {
  const document = createTestDom(
    '<a id="find-me" href="/foo"><ul><li id="click-me">Click me</li></ul></a>',
  );
  const child = document.getElementById('click-me');
  const node = document.getElementById('find-me');
  assertEquals(findTag('a', child), node);
});
