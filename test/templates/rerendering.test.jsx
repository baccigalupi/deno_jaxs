import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import { bind } from '../../lib/templates/Bound.js';
import { createTestDom, domToString } from '../support/testDom.js';

const setupBoundListTemplate = () => {
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
  return bind(List, viewModel);
};

Deno.test('Template, re-rendering: no-op & no changes', () => {
  const BoundList = setupBoundListTemplate();
  const state = {
    items: [
      { state: 'backlog', description: 'Re-rendering' },
      { state: 'complete', description: 'Rendering' },
    ],
  };
  const template = <BoundList />;
  const document = createTestDom();
  const node = template.render({ document, state });
  assertEquals(
    domToString(node),
    '<div><h1>Todo</h1><ul><li class="backlog">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
  );

  template.rerender({ document, state });
  assertEquals(
    domToString(node),
    '<div><h1>Todo</h1><ul><li class="backlog">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
  );
});

// Deno.test('Template, re-rendering: rerenders with a change', () => {
//   const BoundList = setupBoundListTemplate();

//   let items = [
//     { state: 'backlog', description: 'Re-rendering' },
//     { state: 'complete', description: 'Rendering' },
//   ];
//   const state = { items };
//   const template = <BoundList />;
//   const document = createTestDom();
//   let node = template.render({ document, state });
//   assertEquals(
//     domToString(node),
//     '<div><h1>Todo</h1><ul><li class="backlog">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
//   );

//   items = [
//     { state: 'wip', description: 'Re-rendering' },
//     { state: 'complete', description: 'Rendering' },
//   ];
//   node = template.rerender({ document, props: { items } });
//   assertEquals(
//     domToString(node),
//     '<div><h1>Todo</h1><ul><li class="wip">Re-rendering</li><li class="complete">Rendering</li></ul></div>',
//   );
// });
