import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assertEquals,
  assertStringIncludes,
} from 'https://deno.land/std/testing/asserts.ts';
import jsx from '../../lib/jsx.js';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, xit, run, only } = testSuite();

describe('jsx, basics', () => {
  it('works without a functional closure', () => {
    const template = <h1>Hello World</h1>;
    const document = createTestDom();

    const [node] = template.render({ document });
    assertEquals(domToString(node), '<h1>Hello World</h1>');
  });

  it('renders correct with no attributes', () => {
    const Template = () => <h1>Hello World</h1>;
    const template = <Template />;

    const document = createTestDom();
    const [node] = template.render({ document });
    assertEquals(domToString(node), '<h1>Hello World</h1>');
  });

  it('renders correctly with attributes', () => {
    const Template = ({ name }) => <h1>Hello {name}</h1>;
    const template = <Template name='World' />;

    const document = createTestDom();
    const [node] = template.render({ document });
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
    const [node] = template.render({ document });
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
    const [node] = template.render({ document });
    assertEquals(
      domToString(node),
      '<header>Hello <div><b>BACCIGALUPI</b>, Kane</div></header>',
    );
  });
});

await run();
