type WarnLogger = (message: string) => void;
type MaybeWarnLogger = WarnLogger | undefined;
// deno-lint-ignore no-explicit-any
type Publisher = (eventName: string, payload: any) => void;
// deno-lint-ignore no-explicit-any
type Listener = (payload: any, eventName: string, publisher: Publisher) => void;
type FuzzyListener = { matcher: RegExp; listener: Listener };
type EventMatcher = RegExp | string;
type MessageBusOptions = { warn: MaybeWarnLogger };

export class MessageBus {
  warn: MaybeWarnLogger;
  fuzzyListeners: Array<FuzzyListener>;
  exactListeners: Record<string, Array<Listener>>;

  constructor(options: MessageBusOptions) {
    const { warn } = options;
    this.warn = warn;
    this.fuzzyListeners = [];
    this.exactListeners = {};
  }

  subscribe(eventMatcher: EventMatcher, listener: Listener): void {
    if (typeof eventMatcher === 'string') {
      this.subscribeExactListeners(eventMatcher, listener);
    } else {
      this.subscribeFuzzyListerers(eventMatcher, listener);
    }
  }

  subscribeExactListeners(eventMatcher: string, listener: Listener): void {
    this.exactListeners[eventMatcher] = this.exactListeners[eventMatcher] || [];
    this.exactListeners[eventMatcher].push(listener);
  }

  subscribeFuzzyListerers(matcher: RegExp, listener: Listener): void {
    this.fuzzyListeners.push({ matcher, listener });
  }

  publish(eventName: string, payload: any): void {
    let published = this.publishExactListeners(eventName, payload);
    published = this.publishFuzzyListeners(eventName, payload) || published;

    if (!published) this.warnOfMissingMatch(eventName);
  }

  publishExactListeners(eventName: string, payload: any): boolean {
    if (!this.exactListeners[eventName]) return false;

    this.exactListeners[eventName].forEach((listener) => {
      listener(payload, eventName, this.publish.bind(this));
    });

    return true;
  }

  publishFuzzyListeners(eventName: string, payload: any): boolean {
    let published = false;

    this.fuzzyListeners.forEach(({ matcher, listener }: FuzzyListener) => {
      if (eventName.match(matcher)) {
        published = true;
        listener(payload, eventName, this.publish.bind(this));
      }
    });

    return published;
  }

  warnOfMissingMatch(eventName: string): void {
    if (!this.warn) return;

    this.warn(`Event "${eventName}" has no listeners`);
  }
}

const defaultOptions = { warn: undefined };

export default (options: MessageBusOptions = defaultOptions) => {
  return new MessageBus(options);
};
