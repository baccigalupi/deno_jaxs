import TextTemplate from '../../lib/templates/Text';

import { assert } from 'chai';

import { createTestDom } from '../support/testDom';

describe('Text Templates', () => {
  it('renders a dom text node', () => {
    const document = createTestDom();
    const template = new TextTemplate('Hello World');

    const node = template.render({ document });
    assert.equal(node.data, 'Hello World');
  });
});
