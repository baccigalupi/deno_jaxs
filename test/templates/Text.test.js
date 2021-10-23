import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from 'https://deno.land/std/testing/asserts.ts';

import TextTemplate from '../../lib/templates/Text.ts';
import { createTestDom, domToString } from '../support/testDom.js';

const { describe, it, run, xit } = testSuite();

describe('Templates Text', () => {
  it('renders a dom text node', () => {
    const document = createTestDom();
    const template = new TextTemplate('Hello World');

    const nodes = template.render({ document });
    const [node] = nodes;
    assertEquals(nodes.length, 1);
    assertEquals(node.data, 'Hello World');
  });

  it('remove removes the node', () => {
    const template = new TextTemplate('hello');
    const document = createTestDom();
    const [node] = template.render({ document });

    document.body.appendChild(node);
    assertMatch(domToString(document), /hello/);

    template.remove();
    assertNotMatch(domToString(document), /hello/);
  });

  xit('rerender return the existing dom', () => {});
});

await run();
