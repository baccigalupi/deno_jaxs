import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import {
  assert,
  assertEquals,
  assertStringIncludes,
} from 'https://deno.land/std/testing/asserts.ts';

import { App } from '../../lib/app.js';
import {
  createAction,
  createReducer,
} from 'https://raw.githubusercontent.com/baccigalupi/redaxted/main/mod.js';
import { bind } from '../../lib/templates/Bound.js';

import jsx from '../../lib/jsx.js';
import { createTestDom, domToString } from '../support/testDom.js';
const { describe, it, xit, run } = testSuite();

const initialState = { imageSrc: '/profile.png' };
const action = createAction('alwaysChange');
const baseReducer = createReducer(action)
  .transform((state, payload) => ({ ...state, ...payload }))
  .initialState(initialState);

const document = createTestDom(`
  <div>
    <div id="image-holder"></div>
    <div id="footer"></div>
  </div>
`);

describe('App', () => {
  describe('initialization', () => {
    it('sets up some important stuff', () => {
      const handlers = [];
      const app = new App({ handlers, reducers: baseReducer });

      assertEquals(app.rootTemplates, []);
      assert(app.bus);
      assert(app.publish);
      assert(app.store);
      assertEquals(app.state, initialState);
    });
  });

  describe('render', () => {
    it('appends into the document at the selector location', () => {
      const handlers = [];
      const app = new App({ handlers, reducers: baseReducer });

      const Template = () => <img src='/image.png' />;
      app.render({ document, Template, selector: '#image-holder' });

      assertStringIncludes(domToString(document), '<img src="/image.png">');
      assertEquals(app.rootTemplates.length, 1);
    });

    it('can append multiple, separate templates into the document', () => {
      const handlers = [];
      const app = new App({ handlers, reducers: baseReducer });

      let Template = () => <img src='/image.png' />;
      app.render({ document, Template, selector: '#image-holder' });
      Template = () => <footer>Hello footer</footer>;
      app.render({ document, Template, selector: '#footer' });

      assertStringIncludes(domToString(document), '<img src="/image.png">');
      assertStringIncludes(
        domToString(document),
        '<footer>Hello footer</footer>',
      );
      assertEquals(app.rootTemplates.length, 2);
    });

    it('uses state', () => {
      const handlers = [];
      const app = new App({ handlers, reducers: baseReducer });

      const RawTemplate = ({ src }) => <img src={src} />;
      const BoundTemplate = bind(
        RawTemplate,
        (state) => ({ src: state.imageSrc }),
      );
      app.render({
        document,
        Template: BoundTemplate,
        selector: '#image-holder',
      });

      assertStringIncludes(domToString(document), '<img src="/profile.png">');
    });
  });

  describe('rerender', () => {
    xit('static content stays the same', () => {
      const handlers = [];
      const app = new App({ handlers, reducers: baseReducer });

      const Template = () => <img src='/image.png' />;
      app.render({ document, Template, selector: '#image-holder' });
      app.store.dispatch(action({ imageSrc: '/kane.png' }));

      assertStringIncludes(domToString(document), '<img src="/image.png">');
    });

    xit('uses new state', () => {
      const handlers = [];
      const app = new App({ handlers, reducers: baseReducer });

      const RawTemplate = ({ src }) => <img src={src} />;
      const BoundTemplate = bind(
        RawTemplate,
        (state) => ({ src: state.imageSrc }),
      );
      app.render({
        document,
        Template: BoundTemplate,
        selector: '#image-holder',
      });

      app.store.dispatch(action({ imageSrc: '/kane.png' }));
      console.log(document);
      assertStringIncludes(domToString(document), '<img src="/kane.png">');
    });
  });
});

await run();