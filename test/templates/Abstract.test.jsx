import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import AbstractTemplate from '../../lib/templates/Abstract.js';

import { createTestDom, domToString } from '../support/testDom.js';

Deno.test('Template, Abstract: correctly wraps them via jsx', () => {
  const Template = () => <h1>Hello World</h1>;
  const template = <Template />;

  assert(template instanceof AbstractTemplate);
  assertEquals(template.type, Template);
  assertEquals(template.attributes, {});
  assertEquals(template.children, []);
});

Deno.test('Template, Abstract: has abstract attributes', () => {
  const Template = ({ name }) => <h1>Hello {name}</h1>;
  const template = <Template name='World' />;

  assertEquals(template.attributes, { name: 'World' });
});

Deno.test('Template, Abstract: correctly renders', () => {
  const Template = () => <h1>Hello World</h1>;
  const template = <Template />;

  const document = createTestDom();
  const node = template.render({ document });
  assertEquals(domToString(node), '<h1>Hello World</h1>');
});

Deno.test('Template, Abstract: with attributes passes abstract attributes as props down to the underlying type, on render', () => {
  const Template = ({ name }) => <h1>Hello {name}</h1>;
  const template = <Template name='World' />;

  const document = createTestDom();
  const node = template.render({ document });
  assertEquals(domToString(node), '<h1>Hello World</h1>');
});

Deno.test('Template, Abstract: with attributes passes down attributes correctly arbitrarily deep', () => {
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

Deno.test('Template, Abstract: with children renders them correctly', () => {
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
