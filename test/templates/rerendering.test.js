import jsx from '../../lib/jsx';
import { bind } from '../../lib/templates/Bound';
import { assert } from 'chai';
import { createTestDom, domToString } from '../support/testDom';

describe('Rerendering combined template type', () => {
  describe('lists on things, where things get hard', () => {
    const List = ({ items }) => {
      return (
        <>
          <h1>Todo</h1>
          <ul>
            <ListItems items={items} />
          </ul>
        </>
      );
    };

    const ListItems = ({ items }) => {
      return items.map((item) => <Item item={item} />);
    };

    const Item = ({ item }) => {
      return <li class={item.state}>{item.description}</li>;
    };

    const viewModel = (state) => state;
    const BoundList = bind(List, viewModel);

    it('no ops without any changes', () => {
      let state = {
        items: [
          { state: 'backlog', description: 'Re-rendering' },
          { state: 'complete', description: 'Rendering' },
        ],
      };
      const template = <BoundList />;
      const document = createTestDom();
      const node = template.render({ document, state });
      assert.equal(
        domToString(node),
        '<div><h1>Todo</h1><ul><li class="backlog">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
      );

      template.rerender({ document, state });
      assert.equal(
        domToString(node),
        '<div><h1>Todo</h1><ul><li class="backlog">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
      );
    });

    xit('rerenders with a change', () => {
      let items = [
        { state: 'backlog', description: 'Re-rendering' },
        { state: 'complete', description: 'Rendering' },
      ];
      const template = <BoundList />;
      const document = createTestDom();
      const node = template.render({ document });
      assert.equal(
        domToString(node),
        '<div><h1>Todo</h1><ul><li class="backlog">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
      );

      items = [
        { state: 'wip', description: 'Re-rendering' },
        { state: 'complete', description: 'Rendering' },
      ];
      template.rerender({ document, props: { items } });
      assert.equal(
        domToString(node),
        '<div><h1>Todo</h1><ul><li class="wip">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
      );
    });
  });
});
