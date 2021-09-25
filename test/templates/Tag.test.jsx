import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { spy } from 'https://deno.land/x/mock@v0.10.0/spy.ts';

import jsx from '../../lib/jsx.js';

import TagTemplate from '../../lib/templates/Tag.js';
import TextTemplate from '../../lib/templates/Text.ts';

import { createTestDom, domToString } from '../support/testDom.js';

Deno.test('Templates, Tag: without passed attributes generates objects for attributes and events', () => {
  const template = new TagTemplate('h1', null, 'Hello World');

  assertEquals(template.attributes, {});
  assertEquals(template.events, {});
});

Deno.test('Templates, Tag: normalized text children to a TextTemplate', () => {
  const template = new TagTemplate('h1', null, 'Hello World');

  assert(template.children.collection[0] instanceof TextTemplate);
  assertEquals(template.children.collection[0].value, 'Hello World');
});

Deno.test('Templates, Tag: separates events from attributes', () => {
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

Deno.test('Templates, Tag: renders an html tag with no attributes, events or content', () => {
  const template = new TagTemplate('h1', null, null);

  const document = createTestDom();
  const node = template.render({ document });

  assertEquals(domToString(node), '<h1></h1>');
});

Deno.test('Templates, Tag: renders attributes into the tag', () => {
  const attributes = { class: 'fab fa-accessible-icon', id: 'wheelchair' };
  const template = new TagTemplate('i', attributes);

  const document = createTestDom();
  const node = template.render({ document });

  assertEquals(
    domToString(node),
    '<i class="fab fa-accessible-icon" id="wheelchair"></i>',
  );
});

// FUCK: deno dom doesn't include implementation of events
// Deno.test('Templates, Tag: attaches events via a declarative publisher', () => {
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

Deno.test('Templates, Tag: renders text children', () => {
  const template = new TagTemplate('h1', null, 'Hello World');
  const document = createTestDom();

  const node = template.render({ document });
  assertEquals(domToString(node), '<h1>Hello World</h1>');
});

Deno.test('Templates, Tag: jsx correctly converts to an html tag', () => {
  const template = <h1>Hello World</h1>;
  const document = createTestDom();

  const node = template.render({ document });
  assertEquals(domToString(node), '<h1>Hello World</h1>');
});
