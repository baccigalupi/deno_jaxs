import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assert,
  assertEquals,
  assertNotMatch,
  assertNotStrictEquals,
  assertStrictEquals,
} from 'https://deno.land/std/testing/asserts.ts';

import { createTestDom, domToString } from '../support/testDom.js';
import jsx from '../../lib/jsx.js';

import TagTemplate from '../../lib/templates/Tag.ts';
import TextTemplate from '../../lib/templates/Text.ts';

const { describe, it, xit, run } = testSuite();

describe('Templates Tag', () => {
  describe('initialization', () => {
    it('setups empty events and attributes for undecorated tags', () => {
      const template = new TagTemplate('h1', null, 'Hello World');
      assertEquals(template.attributes, {});
      assertEquals(template.events, {});
    });

    it('separates events from attributes for tags with attributes', () => {
      const template = new TagTemplate(
        'h1',
        {
          class: 'small-text',
          onclick: 'onClick:deployBomb',
          onHover: 'onHover:alertBomb',
        },
        'Hello World',
      );

      assertEquals(template.attributes, { class: 'small-text' });
      assertEquals(template.events, {
        click: 'onClick:deployBomb',
        hover: 'onHover:alertBomb',
      });
    });

    it('normalizes children', () => {
      const template = new TagTemplate('h1', null, 'Hello World');
      assert(template.children.collection[0] instanceof TextTemplate);
      assertEquals(template.children.collection[0].value, 'Hello World');
    });
  });

  describe('rendering', () => {
    it('creates a correct simple tag representation', () => {
      const template = new TagTemplate('h1', null, null);
      const document = createTestDom();
      const node = template.render({ document });

      assertEquals(domToString(node), '<h1></h1>');
    });

    it('generates correct attributes into the tag', () => {
      const attributes = { class: 'fab fa-accessible-icon', id: 'wheelchair' };
      const template = new TagTemplate('i', attributes);

      const document = createTestDom();
      const node = template.render({ document });

      assertEquals(
        domToString(node),
        '<i class="fab fa-accessible-icon" id="wheelchair"></i>',
      );
    });

    it('generates self-closing tags', () => {
      const template = new TagTemplate('img', { src: '/profile.png' }, null);
      const document = createTestDom();
      const node = template.render({ document });

      assertEquals(domToString(node), '<img src="/profile.png">');
    });

    it('generates text children elements', () => {
      const template = new TagTemplate('h1', null, 'Hello World');
      const document = createTestDom();

      const node = template.render({ document });
      assertEquals(domToString(node), '<h1>Hello World</h1>');
    });
  });
});

await run();

// FUCK: deno dom doesn't include implementation of events
// Deno.test('Templates, TagTemplate: attaches events via a declarative publisher', () => {
//   const publish = spy();
//   const attributes = { href: '#ohai', onClick: 'navigate' };
//   const template = new TagTemplate('a', attributes);

//   const document = createTestDom();
//   const node = template.render({ document, publish });
//   node.click();

//   assertEquals(publish.calls[0].args[0], 'navigate');
//   assert(
//     publish.calls[0].args[1] instanceof document.defaultView.MouseEvent,
//   );
// });
