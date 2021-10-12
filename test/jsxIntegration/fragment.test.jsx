import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assertEquals,
  assertStringIncludes,
} from 'https://deno.land/std/testing/asserts.ts';
import jsx from '../../lib/jsx.js';

import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, xit, run } = testSuite();

describe('jsx, fragments', () => {
  it('renders simple tag templates', () => {
    const template = (
      <>
        <span>Hello</span>
        <b>World</b>
      </>
    );

    const document = createTestDom();
    const nodes = template.render({ document });

    assertEquals(domToString(nodes[0]), '<span>Hello</span>');
    assertEquals(domToString(nodes[1]), '<b>World</b>');
  });

  it('renders attributes when nested inside other views', () => {
    const WelcomeText = ({ name }) => {
      return (
        <>
          <h2>
            Hi <em>{name}</em>!
          </h2>
          <p>It's great having you here with us.</p>
          <p>Thanks for joining!</p>
        </>
      );
    };

    const PageFrame = ({ children }) => {
      return <section class='page-frame'>{children}</section>;
    };

    const WelcomePage = ({ name }) => {
      return (
        <PageFrame>
          <WelcomeText name={name} />
        </PageFrame>
      );
    };

    const template = <WelcomePage name='Kane' />;

    const document = createTestDom();
    const dom = template.render({ document });

    assertEquals(
      domToString(dom),
      '<section class="page-frame"><h2>Hi <em>Kane</em>!</h2><p>It\'s great having you here with us.</p><p>Thanks for joining!</p></section>',
    );
  });

  it('renders correctly fragmets within fragments', () => {
    const WelcomeText = ({ name, children }) => {
      return (
        <>
          <h2>
            Hi <em>{name}</em>!
          </h2>
          <p>It's great having you here with us.</p>
          <p>Thanks for joining!</p>
          {children}
        </>
      );
    };

    const Discount = () => {
      return (
        <>
          <hr />
          <h4>Get your discount thingy for joining</h4>
          <p>Act now and get your thingy for 20% off!</p>
        </>
      );
    };

    const template = (
      <WelcomeText name='Amir'>
        <Discount />
      </WelcomeText>
    );

    const document = createTestDom();
    const dom = template.render({ document });

    assertStringIncludes(
      domToString(dom),
      '</p><hr><h4>Get your discount thingy for joining</h4><p>Act now',
    );
  });
});

await run();
