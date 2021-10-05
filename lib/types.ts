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
export interface Route {
  matcher: RegExp | string;
  component: Template;
  match(path: string): boolean;
  matches(path: string): Array<string>;
}

export type RouteCollection = Array<Route>;

// Templates ------
export type RenderKit = {
  document: Document;
  props?: Attributes;
};

export type TemplateDom = Text | Element;

export interface Template {
  dom: TemplateDom | undefined;
  render: (renderKit: RenderKit) => TemplateDom;
  willChange: (renderKit: RenderKit) => boolean;
  rerender: (renderKit: RenderKit) => TemplateDom;
  remove: () => void;
}

// deno-lint-ignore no-explicit-any
export type Attributes = Record<string, any>;
export type EventAttributes = Record<string, string>;
export type AttributesAndEvents = {
  attributes: Attributes;
  events: EventAttributes;
};
export type DomEventListenerData = {
  event: string;
  listener: EventListener;
};
export type DomEventListeners = Array<DomEventListenerData>;
