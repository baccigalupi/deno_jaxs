import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import jsx from '../../lib/jsx.js';
import routes from '../../lib/app/routes.js';

Deno.test('Routes: Routes: starts as empty', () => {
  const pages = routes();
  assertEquals(pages.getRoute('/'), undefined);
});

Deno.test('Routes: getting a route will return a default when no match and default is configured', () => {
  const NotFound = () => <h1>Nope, not here!</h1>;
  const pages = routes().default(NotFound);
  assertEquals(pages.getRoute('/').component, NotFound);
  assertEquals(pages.getRoute('/ueaumr-chaeud').component, NotFound);
});

Deno.test('Routes: finds routes by exact patch', () => {
  const Hello = () => <h1>Hi!</h1>;
  const pages = routes().addPath('/hello', Hello);
  assertEquals(pages.getRoute('/'), undefined);
  assertEquals(pages.getRoute('/hello').component, Hello);
  assertEquals(pages.getRoute('/hellow'), undefined);
});

Deno.test('Routes: finds routes by regex, and provides matcher information', () => {
  const Hello = () => <h1>Hi!</h1>;
  const NotFound = () => <h1>Nope, not here!</h1>;

  const pages = routes()
    .addMatcher(/^\/(hello|hi)(.*)/, Hello)
    .default(NotFound);

  assertEquals(pages.getRoute('/hello').component, Hello);
  assertEquals(pages.getRoute('/hi').component, Hello);

  let route = pages.getRoute('/hellow');
  assertEquals(route.component, Hello);
  assertEquals(route.matches[1], 'hello');
  assertEquals(route.matches[2], 'w');

  route = pages.getRoute('/hiya');
  assertEquals(route.component, Hello);
  assertEquals(route.matches[1], 'hi');
  assertEquals(route.matches[2], 'ya');
});

Deno.test('Routes: returns the first match', () => {
  const Hello = () => <h1>Hi!</h1>;
  const High = () => <h1>Jump</h1>;

  let pages = routes()
    .addMatcher(/^\/(hello|hi)(.*)/, Hello)
    .addPath('/high', High);

  assertEquals(pages.getRoute('/hi').component, Hello);
  assertEquals(pages.getRoute('/high').component, Hello);

  pages = routes()
    .addPath('/high', High)
    .addMatcher(/^\/(hello|hi)(.*)/, Hello);

  assertEquals(pages.getRoute('/hi').component, Hello);
  assertEquals(pages.getRoute('/high').component, High);
});

Deno.test('Routes: uses the default only if there are not other matches', () => {
  const Hello = () => <h1>Hi!</h1>;
  const NotFound = () => <h1>Nope, not here!</h1>;

  const pages = routes()
    .default(NotFound)
    .addMatcher(/^\/(hello|hi)(.*)/, Hello);

  assertEquals(pages.getRoute('/hi').component, Hello);
});
