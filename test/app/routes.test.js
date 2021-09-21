import jsx from '../../lib/jsx';
import routes from '../../lib/app/routes';

import { assert } from 'chai';

describe('routes', () => {
  it('starts as empty', () => {
    const pages = routes();
    assert.equal(pages.getRoute('/'), undefined);
  });

  it('getting a route will return a default when no match and default is configured', () => {
    const NotFound = () => <h1>Nope, not here!</h1>;
    const pages = routes().default(NotFound);
    assert.equal(pages.getRoute('/').component, NotFound);
    assert.equal(pages.getRoute('/ueaumr-chaeud').component, NotFound);
  });

  it('finds routes by exact patch', () => {
    const Hello = () => <h1>Hi!</h1>;
    const pages = routes().addPath('/hello', Hello);
    assert.equal(pages.getRoute('/'), undefined);
    assert.equal(pages.getRoute('/hello').component, Hello);
    assert.equal(pages.getRoute('/hellow'), undefined);
  });

  it('finds routes by regex, and provides matcher information', () => {
    const Hello = () => <h1>Hi!</h1>;
    const NotFound = () => <h1>Nope, not here!</h1>;

    const pages = routes()
      .addMatcher(/^\/(hello|hi)(.*)/, Hello)
      .default(NotFound);

    assert.equal(pages.getRoute('/hello').component, Hello);
    assert.equal(pages.getRoute('/hi').component, Hello);

    let route = pages.getRoute('/hellow');
    assert.equal(route.component, Hello);
    assert.equal(route.matches[1], 'hello');
    assert.equal(route.matches[2], 'w');

    route = pages.getRoute('/hiya');
    assert.equal(route.component, Hello);
    assert.equal(route.matches[1], 'hi');
    assert.equal(route.matches[2], 'ya');
  });

  it('returns the first match', () => {
    const Hello = () => <h1>Hi!</h1>;
    const High = () => <h1>Jump</h1>;

    let pages = routes()
      .addMatcher(/^\/(hello|hi)(.*)/, Hello)
      .addPath('/high', High);

    assert.equal(pages.getRoute('/hi').component, Hello);
    assert.equal(pages.getRoute('/high').component, Hello);

    pages = routes()
      .addPath('/high', High)
      .addMatcher(/^\/(hello|hi)(.*)/, Hello);

    assert.equal(pages.getRoute('/hi').component, Hello);
    assert.equal(pages.getRoute('/high').component, High);
  });

  it('uses the default only if there are not other matches', () => {
    const Hello = () => <h1>Hi!</h1>;
    const NotFound = () => <h1>Nope, not here!</h1>;

    const pages = routes()
      .default(NotFound)
      .addMatcher(/^\/(hello|hi)(.*)/, Hello);

    assert.equal(pages.getRoute('/hi').component, Hello);
  });
});
