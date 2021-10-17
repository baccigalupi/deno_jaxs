import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import jsx from '../../lib/jsx.js';
import { bind } from '../../lib/templates/Bound.ts';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, run } = testSuite();

describe('jsx, bound templates', () => {
  it('work with both state and props', () => {
    const TabNavItem = ({ href, currentPath, description }) => {
      const active = currentPath === href ? ' active' : '';
      const classList = `nav-link${active}`;
      return (
        <li class='nav-item'>
          <a href={href} class={classList}>
            {description}
          </a>
        </li>
      );
    };

    const viewModel = (state) => {
      return {
        currentPath: state.app.location.path,
      };
    };

    const state = {
      app: {
        location: {
          path: '/hello-nav-world',
        },
      },
    };

    const BoundTemplate = bind(TabNavItem, viewModel);

    let template = (
      <BoundTemplate
        href='/navigation'
        description='Navigation'
      />
    );

    const document = createTestDom();
    let [node] = template.render({ document, state });
    assertEquals(
      domToString(node),
      '<li class="nav-item"><a href="/navigation" class="nav-link">Navigation</a></li>',
    );

    template = (
      <BoundTemplate
        href='/hello-nav-world'
        description='Hello World'
      />
    );

    [node] = template.render({ document, state });
    assertEquals(
      domToString(node),
      '<li class="nav-item"><a href="/hello-nav-world" class="nav-link active">Hello World</a></li>',
    );
  });
});

await run();
