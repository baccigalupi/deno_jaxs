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
  publish: BusPublisher;
  state: State;
};

export type TemplateDom = Text | Element;
export type TemplateDomCollection = Array<TemplateDom>;

export interface Template {
  dom: TemplateDomCollection;
  render: (
    renderKit: RenderKit,
    parentElement?: Element,
  ) => TemplateDomCollection;
  rerender: (
    renderKit: RenderKit,
  ) => TemplateDomCollection;
  updatable: (
    other: Template,
  ) => boolean;
  generatesJsx: boolean;
  replaceDom: (dom: TemplateDomCollection) => void;
  update: (template: Template, renderKit: RenderKit) => TemplateDomCollection;
  remove: () => void;
}

export type TemplateCreator = (props: Attributes) => Template;

// deno-lint-ignore no-explicit-any
export type State = Record<string, any>;
export type ViewModel = (state: State) => State;

// deno-lint-ignore no-explicit-any
export type Attributes = Record<string, any>;
export type EventAttributes = Record<string, string>;
export type AttributesAndEvents = {
  attributes: Attributes;
  events: EventAttributes;
};
export type DomEventListeners = Record<string, EventListener>;
