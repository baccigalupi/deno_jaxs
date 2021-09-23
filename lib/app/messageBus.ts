import {
  BusEventMatcher,
  BusFuzzyListener,
  BusInitializeOptions,
  BusListener,
  MaybeBusLogger,
} from '../types.ts';

export class MessageBus {
  warn: MaybeBusLogger;
  fuzzyListeners: Array<BusFuzzyListener>;
  exactListeners: Record<string, Array<BusListener>>;

  constructor(options: BusInitializeOptions) {
    const { warn } = options;
    this.warn = warn;
    this.fuzzyListeners = [];
    this.exactListeners = {};
  }

  subscribe(eventMatcher: BusEventMatcher, listener: BusListener): void {
    if (typeof eventMatcher === 'string') {
      this.subscribeExactListeners(eventMatcher, listener);
    } else {
      this.subscribeFuzzyListerers(eventMatcher, listener);
    }
  }

  subscribeExactListeners(eventMatcher: string, listener: BusListener): void {
    this.exactListeners[eventMatcher] = this.exactListeners[eventMatcher] || [];
    this.exactListeners[eventMatcher].push(listener);
  }

  subscribeFuzzyListerers(matcher: RegExp, listener: BusListener): void {
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

    this.fuzzyListeners.forEach(({ matcher, listener }: BusFuzzyListener) => {
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

export default (options: BusInitializeOptions = defaultOptions) => {
  return new MessageBus(options);
};
