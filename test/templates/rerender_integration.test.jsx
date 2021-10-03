import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import { bind } from '../../lib/templates/Bound.js';
import {
  createTestDom,
  domToString,
  stripWhiteSpace,
} from '../support/testDom.js';

const { describe, it, xit, run } = testSuite();

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

describe('Template rerendering', () => {
  xit('no-op & no changes', () => {
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
      stripWhiteSpace(domToString(node)),
      stripWhiteSpace(`
        <div>
          <h1>Todo</h1>
          <ul>
            <li class="backlog">Re-rendering</li>
            <li class="complete">Rendering</li>
          </ul>
        </div>
      `),
    );

    template.rerender({ document, state });
    assertEquals(
      stripWhiteSpace(domToString(node)),
      stripWhiteSpace(`
        <div>
          <h1>Todo</h1>
          <ul>
            <li class="backlog">Re-rendering</li>
            <li class="complete">Rendering</li>
          </ul>
        </div>
      `),
    );
  });

  xit('with state changes', () => {
    const BoundList = setupBoundListTemplate();
    let state = {
      items: [
        { state: 'backlog', description: 'Re-rendering' },
        { state: 'complete', description: 'Rendering' },
      ],
    };
    const template = <BoundList />;
    const document = createTestDom();
    const node = template.render({ document, state });
    assertEquals(
      stripWhiteSpace(domToString(node)),
      stripWhiteSpace(`
        <div>
          <h1>Todo</h1>
          <ul>
            <li class="backlog">Re-rendering</li>
            <li class="complete">Rendering</li>
          </ul>
        </div>
      `),
    );

    state = {
      items: [
        { state: 'wip', description: 'Re-rendering' },
        { state: 'complete', description: 'Rendering' },
      ],
    };

    template.rerender({ document, state });
    assertEquals(
      stripWhiteSpace(domToString(node)),
      stripWhiteSpace(`
        <div>
          <h1>Todo</h1>
          <ul>
            <li class="wip">Re-rendering</li>
            <li class="complete">Rendering</li>
          </ul>
        </div>
      `),
    );
  });
});

run();
