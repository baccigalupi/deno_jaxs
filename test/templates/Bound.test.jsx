import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import { bind, Bound } from '../../lib/templates/Bound.ts';
import TagTemplate from '../../lib/templates/Tag.ts';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, only, xit, run } = testSuite();

describe('Templates, Bound', () => {
  describe('render', () => {
    it('binds state data correctly', () => {
      const Template = ({ name }) =>
        new TagTemplate(
          'h1',
          null,
          ['Hello ', name, '!'],
        );

      const viewModel = (state) => {
        return {
          name: state.user.firstName,
        };
      };

      const BoundTemplate = bind(Template, viewModel);
      const template = BoundTemplate();

      const document = createTestDom();
      const state = { user: { firstName: 'Kane', lastName: 'Baccigalupi' } };
      const node = template.render({ document, state });

      assertEquals(domToString(node), '<h1>Hello Kane!</h1>');
    });

    it('works with attributes and bound state', () => {
      const Template = ({ name, greeting }) => {
        return new TagTemplate(
          'h1',
          null,
          [greeting, ' ', name, '!'],
        );
      };

      const viewModel = (state) => {
        return {
          name: state.user.firstName,
        };
      };

      const BoundTemplate = bind(Template, viewModel);
      const template = BoundTemplate({ greeting: 'Hola' });

      const document = createTestDom();
      const state = { user: { firstName: 'Kane', lastName: 'Baccigalupi' } };
      const node = template.render({ document, state });

      assertEquals(domToString(node), '<h1>Hola Kane!</h1>');
    });

    it('works with children', () => {
      const Template = ({ name, greeting, children }) => {
        return new TagTemplate('div', null, [
          new TagTemplate('h1', null, [greeting, ' ', name, '!']),
          ...children,
        ]);
      };

      const viewModel = (state) => {
        return {
          name: state.user.firstName,
        };
      };

      const BoundTemplate = bind(Template, viewModel);
      const template = BoundTemplate({
        greeting: 'Hola',
        children: [
          new TagTemplate(
            'p',
            null,
            'We are pleased to have a member of the family.',
          ),
        ],
      });

      const document = createTestDom();
      const state = { user: { firstName: 'Kane', lastName: 'Baccigalupi' } };
      const node = template.render({ document, state });

      assertEquals(
        domToString(node),
        '<div><h1>Hola Kane!</h1><p>We are pleased to have a member of the family.</p></div>',
      );
    });
  });
});

await run();
