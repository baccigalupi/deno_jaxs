import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assertEquals,
  assertStrictEquals,
  assertStringIncludes
} from 'https://deno.land/std/testing/asserts.ts';
import jsx from '../../../lib/jsx.js';
import { bind } from '../../../lib/templates/Bound.ts';

import { createTestDom, domToString } from '../../support/testDom.js';
const { describe, it, xit, run, only } = testSuite();

describe('jsx, rerendering', () => {
  describe('basic tags', () => { 
    xit('no-ops when without any change', () => {
      const Template = () => <h1>Hello World</h1>;
      const template = <Template />;

      const document = createTestDom();

      const [node] = template.render({ document, state: {} });
      const originalString = domToString(node);

      const [rerenderedDom] = template.rerender({
        document,
        state: { new: 'state' },
      });
      const rerenderedToString = domToString(rerenderedDom);

      assertEquals(rerenderedToString, originalString);
      assertStrictEquals(rerenderedDom, node);
    });

    xit('updates attributes', () => {
      const document = createTestDom();

      const Template = ({className}) => <h1 class={className}>Hello World</h1>;
      const BoundTemplate = bind(Template, (state) => {
        let className = 'text-bold';

        if (state.highlight) className += ' highlighted';

        return {
          className
        };
      });

      const template = <BoundTemplate />;

      let [dom] = template.render({document, state: {}});
      assertEquals(domToString(dom), '<h1 class="text-bold">Hello World</h1>');

      [dom] = template.rerender({
        document,
        state: {highlighted: true}
      });
      assertEquals(domToString(dom), '<h1 class="text-bold highlighted">Hello World</h1>'
    });

    xit('updates events', () => {});

    xit('updates text children', () => {
      const document = createTestDom();

      const Template = ({name}) => <h1>Hello {name}</h1>;
      const BoundTemplate = bind(Template, (state) => ({name: state.name}));

      const template = <BoundTemplate />;

      let [dom] = template.render({document, state: {name: 'Guest'}});
      assertEquals(domToString(dom), '<h1>Hello Guest</h1>');

      [dom] = template.rerender({document, state: {name: 'Kane'}});
      assertEquals(domToString(dom), '<h1>Hello Kane</h1>'
    });
  });

  describe('changing types', () => {
    xit('works when switching from a tag to fragment', () => {
      const document = createTestDom();

      const Statement = () => <p>It's clear, right?</p>
      const ExpandedStatement = () => (
        <>
          <p>Sometimes one paragraph isn't enough.</p>
          <p>Then you need two ore more!</p>
        </>
      )

      const Explaination = ({expanded}) => {
        if (expanded) return <ExpandedStatement />
        return <Statement />
      }

      const BoundExplaination = bind(Explaination, (state) => ({ expanded: !!state.expanded }));

      const template = <BoundExplaination />
      let dom = template.render({document, state: {expanded: false}});

      assertEquals(dom.length, 1);
      assertStringIncludes(domToString(dom[0]), "<p>It's clear, right?</p>");

      dom = template.rerender({document, state: {expanded: true}});
      assertEquals(dom.length, 2);
      assertStringIncludes(domToString(dom[0]), "<p>Sometimes one paragraph isn't enough.</p>");
    });
 
    xit('works when switching from fragment to tag', () => {
      const document = createTestDom();

      const Statement = () => <p>It's clear, right?</p>
      const ExpandedStatement = () => (
        <>
          <p>Sometimes one paragraph isn't enough.</p>
          <p>Then you need two ore more!</p>
        </>
      )

      const Explaination = ({expanded}) => {
        if (expanded) return <ExpandedStatement />
        return <Statement />
      }

      const BoundExplaination = bind(Explaination, (state) => ({ expanded: !!state.expanded }));

      const template = <BoundExplaination />
      let dom = template.render({document, state: {expanded: true}});

      assertEquals(dom.length, 2);
      assertStringIncludes(domToString(dom[0]), "<p>Sometimes one paragraph isn't enough.</p>");
  

      dom = template.rerender({document, state: {expanded: false}});
      assertEquals(dom.length, 1);
      assertStringIncludes(domToString(dom[0]), "<p>It's clear, right?</p>");
    });
  });
});

await run();
