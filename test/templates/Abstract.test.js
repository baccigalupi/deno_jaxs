import jsx from '../../lib/jsx';

import AbstractTemplate from '../../lib/templates/Abstract';

import { assert } from 'chai';

import { createTestDom, domToString } from '../support/testDom';

describe('Abstract Templates', () => {
  describe('with simple template tags', () => {
    it('correctly wraps them via jsx', () => {
      const Template = () => <h1>Hello World</h1>;
      const template = <Template />;

      assert.instanceOf(template, AbstractTemplate);
      assert.equal(template.type, Template);
      assert.deepEqual(template.attributes, {});
      assert.deepEqual(template.children, []);
    });

    it('has abstract attributes', () => {
      const Template = ({ name }) => <h1>Hello {name}</h1>;
      const template = <Template name='World' />;

      assert.deepEqual(template.attributes, { name: 'World' });
    });

    it('correctly renders', () => {
      const Template = () => <h1>Hello World</h1>;
      const template = <Template />;

      const document = createTestDom();
      const node = template.render({ document });
      assert.equal(domToString(node), '<h1>Hello World</h1>');
    });
  });

  describe('with (abstract) attributes', () => {
    it('passes abstract attributes as props down to the underlying type, on render', () => {
      const Template = ({ name }) => <h1>Hello {name}</h1>;
      const template = <Template name='World' />;

      const document = createTestDom();
      const node = template.render({ document });
      assert.equal(domToString(node), '<h1>Hello World</h1>');
    });

    it('passes down attributes correctly arbitrarily deep', () => {
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
      assert.equal(
        domToString(node),
        '<header>Hello <div><b>BACCIGALUPI</b>, Kane</div></header>',
      );
    });
  });

  describe('with children', () => {
    it('renders them correctly', () => {
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
      assert.equal(
        domToString(node),
        '<header>Hello <div><b>BACCIGALUPI</b>, Kane</div></header>',
      );
    });
  });
});
