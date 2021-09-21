import { attachHistoryListener, navigate } from '../../lib/handlers/navigation';
import events from '../../lib/store/events';

import { assert } from 'chai';
import sinon from 'sinon';
import { createTestDom } from '../support/testDom';

describe('handlers navigation', () => {
  describe('navigate', () => {
    beforeEach(() => {
      global.history = {
        pushState: sinon.fake(),
      };
    });

    afterEach(() => {
      global.history = undefined;
    });

    it('navigate pushes history', () => {
      const publish = sinon.fake();
      const path = '/foo/bar';

      navigate(publish, path);

      assert.equal(history.pushState.lastArg, path);
    });

    it('publishes the right event', () => {
      const publish = sinon.fake();
      const path = '/foo/bar';

      navigate(publish, path);

      assert.equal(publish.firstArg, events.store.updateLocation);
    });
  });

  describe('attachHistoryListener', () => {
    let originalWindow;

    beforeEach(() => {
      originalWindow = global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('publishes navigation events when they occur on the window', (done) => {
      const publish = sinon.fake();
      const document = createTestDom();
      global.window = document.defaultView;
      attachHistoryListener(publish);
      window.history.pushState({}, null, '/home');
      window.history.pushState({}, null, '/next-page');
      window.history.back();

      // This setTimeout is a bit of a hack, process.nextTick doesn't provide
      // enough time, and unlike other async things, we don't have a handle on
      // the callback/promise. We could subscribe to the event to verify
      // instead.
      setTimeout(() => {
        assert.equal(publish.callCount, 1);
        assert.equal(publish.firstArg, events.store.updateLocation);
        done();
      }, 20);
    });
  });
});
