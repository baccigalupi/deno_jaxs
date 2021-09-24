// Message bus --------
export type BusLogger = (message: string) => void;
export type MaybeBusLogger = BusLogger | undefined;
// deno-lint-ignore no-explicit-any
export type BusPublisher = (eventName: string, payload: any) => void;
export type BusListener = (
  // deno-lint-ignore no-explicit-any
  payload: any,
  eventName: string,
  publisher: BusPublisher,
) => void;
export type BusFuzzyListener = { matcher: RegExp; listener: BusListener };
export type BusInitializeOptions = { warn: MaybeBusLogger };
export type BusEventMatcher = RegExp | string;

// Router ------

// TODO: add real Component or Template type when we get there
// deno-lint-ignore no-explicit-any
export type Component = any;

export interface Route {
  matcher: RegExp | string;
  component: Component;
  match(path: string): boolean;
  matches(path: string): Array<string>;
}

export type RouteCollection = Array<Route>;

// Templates ------
export type RenderKit = {
  document: Document;
};

export type TemplateDom = Text | Element;

export interface Template {
  dom: TemplateDom | undefined;
  render: (renderKit: RenderKit) => TemplateDom;
  rerender: (renderKit: RenderKit) => TemplateDom;
  removeDom: () => void;
  removeListeners: () => void;
}
