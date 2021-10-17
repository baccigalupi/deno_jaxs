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

class RootTemplate {
  constructor(Template, selector, document = null) {
    this.Template = Template;
    this.selector = selector;
    this.document = document || window.document;
    this.parentElement = this.document.querySelector(selector);
  }

  render(renderKit) {
    this.generateDom(renderKit);
    this.attachToParent();
  }

  generateDom(renderKit) {
    const template = this.Template();
    this.dom = template.render(renderKit);
  }

  attachToParent() {
    this.parentElement.innerHTML = '';
    this.dom.forEach((element) => this.parentElement.appendChild(element));
  }
}

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
    const template = new RootTemplate(Template, selector, document);
    this.rootTemplates.push(template);
    const renderKit = this.renderKit();
    if (!renderKit.document) renderKit.document = document;
    template.render(renderKit);
  }

  rerender() {
    const renderKit = this.renderKit();
    if (this.state === renderKit.state) return;

    this.state = renderKit.state;
    this.rootTemplates.forEach(({ template }) => {
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
