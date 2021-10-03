import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { findHref, findTag } from '../../lib/utilities/dom.js';
import { createTestDom } from '../support/testDom.js';

const { describe, it, run } = testSuite();

describe('Utilities', () => {
  describe('dom', () => {
    describe('findHref', () => {
      it('finds the href when it is the direct target node', () => {
        const document = createTestDom('<a id="find-me" href="/foo"></a>');
        const node = document.getElementById('find-me');
        assertEquals(findHref(node), '/foo');
      });

      it('finds the href at the nearest parent when not available on target node', () => {
        const document = createTestDom(
          '<a id="find-me" href="/foo"><ul><li id="click-me">Click me</li></ul></a>',
        );
        const node = document.getElementById('click-me');
        assertEquals(findHref(node), '/foo');
      });
    });

    describe('findTag', () => {
      it('finds the current node when it has a matching tag', () => {
        const document = createTestDom('<a id="find-me" href="/foo"></a>');
        const node = document.getElementById('find-me');
        assertEquals(findTag('a', node), node);
      });

      it('finds nearest parent node when not the right tag name', () => {
        const document = createTestDom(
          '<a id="find-me" href="/foo"><ul><li id="click-me">Click me</li></ul></a>',
        );
        const child = document.getElementById('click-me');
        const node = document.getElementById('find-me');
        assertEquals(findTag('a', child), node);
      });
    });
  });
});

await run();
