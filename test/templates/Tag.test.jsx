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

import TagTemplate from '../../lib/templates/Tag.js';
import TextTemplate from '../../lib/templates/Text.ts';

const { describe, it, xit, run } = testSuite();

describe('Templates', () => {
  describe('initialization (without jsx)', () => {
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

    it('works correctly with jsx', () => {
      const template = <h1>Hello World</h1>;
      const document = createTestDom();

      const node = template.render({ document });
      assertEquals(domToString(node), '<h1>Hello World</h1>');
    });
  });

  describe('willChange (for rerendering)', () => {
    xit(
      'will be false if the attributes do not change and children are the same',
      () => {
        const template = new TagTemplate(
          'h1',
          { class: 'bg-dark text-light' },
          'Hello World',
        );
        const document = createTestDom();
        template.render({ document });

        assertEquals(
          template.willChange({
            props: { class: 'bg-dark text-light' },
            children: template.children,
          }),
          false,
        );

        assertEquals(
          template.willChange({
            props: { class: 'bg-light text-dark' },
            children: template.children,
          }),
          true,
        );
      },
    );
  });

  describe('rerender', () => {
    xit(
      'without children will not change without a change in attributes',
      () => {
        const attributes = { src: '/profile.png' };
        const template = new TagTemplate('img', attributes, []);
        const document = createTestDom();

        const node = template.render({ document });
        document.body.appendChild(node);

        const newNode = template.rerender({
          document,
          props: attributes,
        });

        assertStrictEquals(node, newNode);
        assertStringIncludes(domToString(document), '<img src="/profile.png">');
      },
    );

    it(
      'without children will remove itself in the dom on attribute change and return a new dom',
      () => {
        const template = new TagTemplate('img', { src: '/profile.png' }, []);
        const document = createTestDom();

        const node = template.render({ document });
        document.body.appendChild(node);

        const newNode = template.rerender({
          document,
          props: { src: '/kane.png' },
        });

        assertNotStrictEquals(node, newNode);
        assertNotMatch(
          domToString(document),
          /<img src="profile.png">/,
        );
      },
    );

    xit(
      'with text child will not change with same children',
      () => {
        const children = [new TextTemplate('Hello Darkness')];
        const template = new TagTemplate('p', { class: 'bg-dark' }, children);
        const document = createTestDom();

        const node = template.render({ document });

        const newNode = template.rerender({
          document,
          children,
        });

        assertEquals(node, newNode);
        assertMatch(
          domToString(newNode),
          /<div class="bg-dark>Hello Darkness<\/div>/,
        );
      },
    );
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
