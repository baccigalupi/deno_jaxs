import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { spy } from 'https://deno.land/x/mock@v0.10.0/spy.ts';

import {
  attachHistoryListener,
  navigate,
} from '../../lib/handlers/navigation.js';
import events from '../../lib/store/events.ts';

import { createTestDom } from '../support/testDom.js';

const { describe, it, xit, run } = testSuite();

const setupHistory = () => {
  globalThis.history = {
    pushState: spy(),
  };
};

const clearHistory = () => globalThis.history = undefined;

describe('Handlers', () => {
  describe('navigation', () => {
    it('pushes paths into history', () => {
      setupHistory();
      const publish = spy();
      const path = '/foo/bar';
      navigate(publish, path);
      assertEquals(history.pushState.calls[0].args[2], path);
      clearHistory();
    });

    it('publishes the right event', () => {
      setupHistory();
      const publish = spy();
      const path = '/foo/bar';
      navigate(publish, path);
      assertEquals(publish.calls[0].args[0], events.store.updateLocation);
      clearHistory();
    });

    // TODO: test in headless browser, deno does funky shit with the location in global
    xit(
      'attachHistoryListener publishes navigation events when they occur on the window',
      () => {
        const publish = spy();
        const document = createTestDom();
        window.onpopstate = document.defaultView.onpopstate;
        attachHistoryListener(publish);
        window.history.pushState({}, null, '/home');
        window.history.pushState({}, null, '/next-page');
        window.history.back();

        // This setTimeout is a bit of a hack, process.nextTick doesn't provide
        // enough time, and unlike other async things, we don't have a handle on
        // the callback/promise. We could subscribe to the event to verify
        // instead.
        assert.equal(publish.calls.length, 1);
        assert.equal(publish.calls[0].args[0], events.store.updateLocation);

        window.onpopstate = undefined;
      },
    );
  });
});

await run();
