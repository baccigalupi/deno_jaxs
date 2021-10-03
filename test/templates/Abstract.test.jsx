import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import AbstractTemplate from '../../lib/templates/Abstract.js';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, xit, run } = testSuite();

describe('Templates, Abstract', () => {
  describe('jsx initialization', () => {
    it('correctly wraps basic tags', () => {
      const Template = () => <h1>Hello World</h1>;
      const template = <Template />;

      assert(template instanceof AbstractTemplate);
      assertEquals(template.type, Template);
      assertEquals(template.attributes, {});
      assertEquals(template.children, []);
    });

    it('sets up abstract attributes', () => {
      const Template = ({ name }) => <h1>Hello {name}</h1>;
      const template = <Template name='World' />;
      assertEquals(template.attributes, { name: 'World' });
    });
  });

  describe('rendering', () => {
    it('is correct with no attributes', () => {
      const Template = () => <h1>Hello World</h1>;
      const template = <Template />;

      const document = createTestDom();
      const node = template.render({ document });
      assertEquals(domToString(node), '<h1>Hello World</h1>');
    });

    it('is correct with attributes', () => {
      const Template = ({ name }) => <h1>Hello {name}</h1>;
      const template = <Template name='World' />;

      const document = createTestDom();
      const node = template.render({ document });
      assertEquals(domToString(node), '<h1>Hello World</h1>');
    });

    it('passes down attributes to other template in the view, deeply', () => {
      const EmphasizedName = ({ name }) => <b>{name.toUpperCase()}</b>;
      const AccountingName = ({ firstName, lastName }) => (
        <div>
          <EmphasizedName name={lastName} />, {firstName}
        </div>
      );
      const Greeting = ({ user }) => {
        return (
          <header>
            Hello{" "}
            <AccountingName
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </header>
        );
      };

      const user = {
        firstName: 'Kane',
        lastName: 'Baccigalupi',
      };

      const template = <Greeting user={user} />;

      const document = createTestDom();
      const node = template.render({ document });
      assertEquals(
        domToString(node),
        '<header>Hello <div><b>BACCIGALUPI</b>, Kane</div></header>',
      );
    });

    it('passes down attributes to children', () => {
      const EmphasizedName = ({ name }) => <b>{name.toUpperCase()}</b>;
      const AccountingName = ({ firstName, lastName }) => (
        <div>
          <EmphasizedName name={lastName} />, {firstName}
        </div>
      );
      const Greeting = ({ children }) => <header>Hello {children}</header>;

      const template = (
        <Greeting>
          <AccountingName firstName='Kane' lastName='Baccigalupi' />
        </Greeting>
      );

      const document = createTestDom();
      const node = template.render({ document });
      assertEquals(
        domToString(node),
        '<header>Hello <div><b>BACCIGALUPI</b>, Kane</div></header>',
      );
    });
  });

  describe('willChange (for rerendering)', () => {
    it('Template, Abstract: willChange when props and state remains the same', () => {
      const document = createTestDom();
      const EmphasizedName = ({ name }) => <b>{name.toUpperCase()}</b>;
      const template = <EmphasizedName name='kane' />;
      template.render({ document });
      assertEquals(template.willChange({ props: { name: 'kane' } }), false);
    });

    it('Template, Abstract: willChange when props change', () => {
      const document = createTestDom();
      const EmphasizedName = ({ name }) => <b>{name.toUpperCase()}</b>;
      const template = <EmphasizedName name='kane' />;
      template.render({ document });
      assertEquals(
        template.willChange({ props: { name: 'baccigalupi' } }),
        true,
      );
    });

    it('Template, Abstract: willChange when children change', () => {
      const document = createTestDom();
      const Wrapper = ({ children }) => <div>{children}</div>;

      const template = (
        <Wrapper>
          <b>Hello!</b>
        </Wrapper>
      );
      template.render({ document });

      assertEquals(template.willChange({ children: [<b>Goodbye!</b>] }), true);
    });

    xit(
      'Template, Abstract: willChange won\'t change if children are the same',
      () => {
        const document = createTestDom();
        const Wrapper = ({ children }) => <div>{children}</div>;

        const template = (
          <Wrapper>
            <b>Hello!</b>
          </Wrapper>
        );
        template.render({ document });

        assertEquals(
          template.willChange({ children: template.children }),
          false,
        );
      },
    );

    it('Template, Abstract: willChange if one of the children willChange', () => {
      const document = createTestDom();
      const Wrapper = ({ children }) => <div>{children}</div>;

      const template = (
        <Wrapper>
          <b>Hello!</b>
        </Wrapper>
      );
      template.render({ document });
      template.children[0].willChange = () => true;

      assertEquals(template.willChange({ children: template.children }), true);
    });
  });
});

await run();
