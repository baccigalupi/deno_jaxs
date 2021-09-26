import { Route, RouteCollection, Template } from '../types.ts';

class ExactRoute implements Route {
  matcher: string;
  component: Template;

  constructor(path: string, component: Template) {
    this.matcher = path;
    this.component = component;
  }

  match(path: string): boolean {
    return this.matcher.trim() === path.trim();
  }

  matches(path: string): Array<string> {
    return [path.trim()];
  }
}

class FuzzyRoute implements Route {
  matcher: RegExp;
  component: Template;

  constructor(matcher: RegExp, component: Template) {
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

export class Router {
  collection: RouteCollection;
  defaultRoute: Route | undefined;

  constructor() {
    this.collection = [];
  }

  addPath(path: string, component: Template): Router {
    this.collection.push(new ExactRoute(path, component));
    return this;
  }

  addMatcher(matcher: RegExp, component: Template): Router {
    this.collection.push(new FuzzyRoute(matcher, component));
    return this;
  }

  addDefault(component: Template): Router {
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

const router = () => new Router();
export default router;
