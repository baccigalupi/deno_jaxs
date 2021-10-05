import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import { bind, Bound } from '../../lib/templates/Bound.ts';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, xit, run } = testSuite();

describe('Templates, Bound', () => {
  describe('render', () => {
    it('binds jsx with state data correctly', () => {
      const Template = ({ name }) => <h1>Hello {name}!</h1>;
      const viewModel = (state) => {
        return {
          name: state.user.firstName,
        };
      };

      const BoundTemplate = bind(Template, viewModel);
      const template = <BoundTemplate />;

      const document = createTestDom();
      const state = { user: { firstName: 'Kane', lastName: 'Baccigalupi' } };
      const node = template.render({ document, state });

      assertEquals(domToString(node), '<h1>Hello Kane!</h1>');
    });

    it('works with attributes', () => {
      const Template = ({ name, greeting }) => (
        <h1>
          {greeting} {name}!
        </h1>
      );
      const viewModel = (state) => {
        return {
          name: state.user.firstName,
        };
      };

      const BoundTemplate = bind(Template, viewModel);
      const template = <BoundTemplate greeting='Hola' />;

      const document = createTestDom();
      const state = { user: { firstName: 'Kane', lastName: 'Baccigalupi' } };
      const node = template.render({ document, state });

      assertEquals(domToString(node), '<h1>Hola Kane!</h1>');
    });

    it('works with children', () => {
      const Template = ({ name, greeting, children }) => (
        <div>
          <h1>
            {greeting} {name}!
          </h1>
          {children}
        </div>
      );
      const viewModel = (state) => {
        return {
          name: state.user.firstName,
        };
      };

      const BoundTemplate = bind(Template, viewModel);
      const template = (
        <BoundTemplate greeting='Hola'>
          <p>We are pleased to have a member of the family.</p>
        </BoundTemplate>
      );

      const document = createTestDom();
      const state = { user: { firstName: 'Kane', lastName: 'Baccigalupi' } };
      const node = template.render({ document, state });

      assertEquals(
        domToString(node),
        '<div><h1>Hola Kane!</h1><p>We are pleased to have a member of the family.</p></div>',
      );
    });

    it('works with both state and props', () => {
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
      let node = template.render({ document, state });
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

      node = template.render({ document, state });
      assertEquals(
        domToString(node),
        '<li class="nav-item"><a href="/hello-nav-world" class="nav-link active">Hello World</a></li>',
      );
    });
  });

  describe('willChange', () => {
    it('returns false if the bound state is equal', () => {
      const document = createTestDom();
      const originalState = { hello: 'world', list: ['thing, thang'] };
      const Template = ({ name }) => <h1>Hello {name}!</h1>;
      const viewModel = (state) => {
        return {
          name: state.hello,
        };
      };
      const template = new Bound(Template, viewModel, {});
      template.render({ state: originalState, document });

      assertEquals(
        template.willChange({ state: { hello: 'world', list: [] } }),
        false,
      );
    });

    it('returns true if the bound state not equaL', () => {
      const document = createTestDom();
      const originalState = { hello: 'world', list: ['thing, thang'] };
      const Template = ({ name }) => <h1>Hello {name}!</h1>;
      const viewModel = (state) => {
        return {
          name: state.hello,
        };
      };
      const template = new Bound(Template, viewModel, {});
      template.render({ state: originalState, document });

      assertEquals(
        template.willChange({ state: { hello: 'wonk', list: [] } }),
        true,
      );
    });

    it('returns false if the bound state has an identical array', () => {
      const document = createTestDom();
      const originalState = { hello: 'world', list: ['thing, thang'] };
      const Template = ({ list }) => <h1>Hello {list.join(', ')}!</h1>;
      const viewModel = (state) => {
        return {
          list: state.list,
        };
      };
      const template = new Bound(Template, viewModel, {});
      template.render({ state: originalState, document });

      assertEquals(
        template.willChange({
          state: { hello: 'wonk', list: originalState.list },
        }),
        false,
      );
    });

    it('returns true if the bound state has a fuzzy equal array', () => {
      const document = createTestDom();
      const originalState = { hello: 'world', list: ['thing, thang'] };
      const Template = ({ list }) => <h1>Hello {list.join(', ')}!</h1>;
      const viewModel = (state) => {
        return {
          list: state.list,
        };
      };
      const template = new Bound(Template, viewModel, {});
      template.render({ state: originalState, document });

      assertEquals(
        template.willChange({
          state: { hello: 'world', list: ['thing', 'thang'] },
        }),
        true,
      );
    });
  });

  describe('rerender', () => {
    xit('returns a new dom when state changes', () => {
      const document = createTestDom();
      const originalState = { hello: 'world', list: ['thing, thang'] };
      const Template = ({ list }) => <h1>Hello {list.join(', ')}!</h1>;
      const viewModel = (state) => {
        return {
          list: state.list,
        };
      };
      const template = new Bound(Template, viewModel, {});
      template.render({ state: originalState, document });
      const newState = { hello: 'world', list: ['thing', 'thingy'] };
      const node = template.rerender({ state: newState, document });
      assertEquals(
        domToString(node),
        '<li class="nav-item"><a href="/hello-nav-world" class="nav-link active">Hello World</a></li>',
      );
    });
  });
});

await run();
