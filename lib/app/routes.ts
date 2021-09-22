// deno-lint-ignore-file no-explicit-any
// TODO: addd Component or Template type where any exists now
type Component = any;

interface MatchableRoute {
  match(path: string): boolean;
}

class ExactRoute implements MatchableRoute {
  path: string;
  component: Component;

  constructor(path: string, component: Component) {
    this.path = path;
    this.component = component;
  }

  match(path: string): boolean {
    return this.path.trim() === path.trim();
  }
}

class FuzzyRoute implements MatchableRoute {
  matcher: RegExp;
  component: Component;

  constructor(matcher: RegExp, component: Component) {
    this.matcher = matcher;
    this.component = component;
  }

  match(path: string): boolean {
    return this.matcher.test(path.trim());
  }

  matches(path: string): Array<string> {
    return path.trim().match(this.matcher) || [];
  }
}

type Route = ExactRoute | FuzzyRoute;
type RouteCollection = Array<Route>;

export class Routes {
  collection: RouteCollection;
  defaultRoute: Component | undefined;

  constructor() {
    this.collection = [];
  }

  addPath(path: string, component: Component): Routes {
    this.collection.push(new ExactRoute(path, component));
    return this;
  }

  addMatcher(matcher: RegExp, component: Component): Routes {
    this.collection.push(new FuzzyRoute(matcher, component));
    return this;
  }

  addDefault(component: Component): Routes {
    this.defaultRoute = new FuzzyRoute(/.*/, component);
    return this;
  }

  getRoute(path: string): Route | undefined {
    const matched = this.collection.find((route: Route) => {
      return route.match(path);
    });

    return matched || this.defaultRoute;
  }
}

const routes = () => new Routes();
export default routes;
