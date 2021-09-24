import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import TextTemplate from '../../lib/templates/Text.ts';
import { createTestDom } from '../support/testDom.js';

Deno.test('Templates, Text: renders a dom text node', () => {
  const document = createTestDom();
  const template = new TextTemplate('Hello World');

  const node = template.render({ document });
  assertEquals(node.data, 'Hello World');
});
