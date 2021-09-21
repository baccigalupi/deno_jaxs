import { findHref, findTag } from '../../lib/utilities/dom';

import { createTestDom, mockEvent } from '../support/testDom';
import { assert } from 'chai';

describe('DOM utilities', () => {
  describe('findHref', () => {
    it('finds the href when it is the direct target node', () => {
      const document = createTestDom('<a id="find-me" href="/foo"></a>');
      const node = document.getElementById('find-me');
      assert.equal(findHref(node), '/foo');
    });

    it('finds the href at the nearest parent when not available on target node', () => {
      const document = createTestDom(
        '<a id="find-me" href="/foo"><ul><li id="click-me">Click me</li></ul></a>',
      );
      const node = document.getElementById('click-me');
      assert.equal(findHref(node), '/foo');
    });
  });

  describe('findTag', () => {
    it('find the current node when it has a matching tag', () => {
      const document = createTestDom('<a id="find-me" href="/foo"></a>');
      const node = document.getElementById('find-me');
      assert.equal(findTag('a', node), node);
    });

    it('find nearest parent node when not the right tag name', () => {
      const document = createTestDom(
        '<a id="find-me" href="/foo"><ul><li id="click-me">Click me</li></ul></a>',
      );
      const child = document.getElementById('click-me');
      const node = document.getElementById('find-me');
      assert.equal(findTag('a', child), node);
    });
  });
});
