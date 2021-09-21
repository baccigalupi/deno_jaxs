import jsx from '../../lib/jsx';

import TagTemplate from '../../lib/templates/Tag';
import TextTemplate from '../../lib/templates/Text';

import { assert } from 'chai';
import sinon from 'sinon';

import { createTestDom, domToString } from '../support/testDom';

describe('Tag Templates', () => {
  it('without passed attributes generates objects for attributes and events', () => {
    const template = new TagTemplate('h1', null, 'Hello World');

    assert.deepEqual(template.attributes, {});
    assert.deepEqual(template.events, {});
  });

  it('normalized text children to a TextTemplate', () => {
    const template = new TagTemplate('h1', null, 'Hello World');

    assert.instanceOf(template.children.collection[0], TextTemplate);
    assert.equal(template.children.collection[0].value, 'Hello World');
  });

  it('separates events from attributes', () => {
    const template = new TagTemplate(
      'h1',
      {
        class: 'small-text',
        onclick: 'onClick:deployBomb',
        onHover: 'onHover:alertBomb',
      },
      'Hello World',
    );

    assert.deepEqual(template.attributes, { class: 'small-text' });
    assert.deepEqual(template.events, {
      click: 'onClick:deployBomb',
      hover: 'onHover:alertBomb',
    });
  });

  describe('rendering', () => {
    it('renders an html tag with no attributes, events or content', () => {
      const template = new TagTemplate('h1', null, null);

      const document = createTestDom();
      const node = template.render({ document });

      assert.equal(domToString(node), '<h1></h1>');
    });

    it('renders attributes into the tag', () => {
      const attributes = { class: 'fab fa-accessible-icon', id: 'wheelchair' };
      const template = new TagTemplate('i', attributes);

      const document = createTestDom();
      const node = template.render({ document });

      assert.equal(
        domToString(node),
        '<i class="fab fa-accessible-icon" id="wheelchair"></i>',
      );
    });

    it('attaches events via a declarative publisher', () => {
      const publish = sinon.fake();
      const attributes = { href: '#ohai', onClick: 'navigate' };
      const template = new TagTemplate('a', attributes);

      const document = createTestDom();
      const node = template.render({ document, publish });
      node.click();

      assert.equal(publish.getCall(0).firstArg, 'navigate');
      assert.instanceOf(
        publish.getCall(0).lastArg,
        document.defaultView.MouseEvent,
      );
    });

    it('renders text children', () => {
      const template = new TagTemplate('h1', null, 'Hello World');
      const document = createTestDom();

      const node = template.render({ document });
      assert.equal(domToString(node), '<h1>Hello World</h1>');
    });
  });

  it('jsx correctly converts to an html tag', () => {
    const template = <h1>Hello World</h1>;
    const document = createTestDom();

    const node = template.render({ document });
    assert.equal(domToString(node), '<h1>Hello World</h1>');
  });
});
