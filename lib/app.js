import Redux from 'https://dev.jspm.io/redux@4.0.5';
import createBus from './app/messageBus.ts';
import { attachHistoryListener } from './handlers/navigation.js';
const { createStore } = Redux;

const configureBus = (handlers) => {
  const bus = createBus();
  handlers.forEach(({ event, listener }) => {
    bus.subscribe(event, listener);
  });
  return bus;
};

const configureStore = (reducers) => createStore(reducers);

const connectStore = (bus, store) => {
  const storeMatcher = /store:(.+)/;
  bus.subscribe(storeMatcher, (payload, eventName) => {
    const type = eventName.match(storeMatcher)[1];
    store.dispatch({ type, payload });
  });
};

const startHistory = (bus) => {
  const publish = (name, payload) => bus.publish(name, payload);
  attachHistoryListener(publish);
};

export class App {
  constructor({ handlers, reducers, store }) {
    this.rootTemplates = [];
    this.bus = configureBus(handlers);
    this.publish = (name, payload) => this.bus.publish(name, payload);
    this.store = store || configureStore(reducers);
    connectStore(this.bus, this.store);
    startHistory(this.bus);
    this.state = this.store.getState();
    this.store.subscribe(() => this.rerender());
  }

  render({ selector, document, Template }) {
    const template = Template();
    this.rootTemplates.push({ selector, template });
    this.document = document || window.document;

    const dom = template.render(this.renderKit());
    const parentElement = this.document.querySelector(selector);
    parentElement.innerHTML = '';
    parentElement.appendChild(dom);
  }

  rerender() {
    const renderKit = this.renderKit();
    if (this.state === renderKit.state) return;

    this.state = renderKit.state;
    this.rootTemplates.forEach(({ template }) => {
      console.log(template);
      template.rerender(renderKit);
    });
  }

  renderKit() {
    return {
      document: this.document,
      state: this.store.getState(),
      publish: this.publish,
    };
  }
}

export default (configuration) => {
  return new App(configuration);
};
