import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { Root } from '../../lib/templates/Root.ts';
import TagTemplate from '../../lib/templates/Tag.ts';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, run } = testSuite();

describe('Template, Root', () => {
  it('renders a simple template into the document in the right place', () => {
    const document = createTestDom();
    const Template = () => new TagTemplate('h1', null, ['Hello world!']);
    const root = new Root(Template, '#app', document);
    root.render({ document });
    const parentNode = document.querySelector('#app');
    assertEquals(
      domToString(parentNode),
      '<div id="app"><h1>Hello world!</h1></div>',
    );
  });
});

await run();
