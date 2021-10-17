import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from 'https://deno.land/std/testing/asserts.ts';

import TextTemplate from '../../lib/templates/Text.ts';
import { createTestDom, domToString } from '../support/testDom.js';

const { describe, it, run } = testSuite();

describe('Templates Text', () => {
  it('renders a dom text node', () => {
    const document = createTestDom();
    const template = new TextTemplate('Hello World');

    const node = template.render({ document });
    assertEquals(node.data, 'Hello World');
  });

  it('removeDom removes the node', () => {
    const template = new TextTemplate('hello');
    const document = createTestDom();
    const node = template.render({ document });

    document.body.appendChild(node);
    assertMatch(domToString(document), /hello/);

    template.removeDom();
    assertNotMatch(domToString(document), /hello/);
  });
});

await run();
