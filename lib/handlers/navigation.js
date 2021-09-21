import { findHref } from '../utilities/dom.js';
import events from '../store/events.js';
const event = events.store.updateLocation;

const windowListener = (publish) => {
  return () => {
    publish(event);
  };
};

export const attachHistoryListener = (publish) => {
  window.onpopstate = windowListener(publish);
};

export const navigate = (publish, path) => {
  history.pushState(null, '', path);
  setTimeout(() => publish(event), 0); // next tick to give location change time
};

export const listener = (domEvent, _eventName, publish) => {
  if (!domEvent || !domEvent.target) return;
  domEvent.preventDefault();

  const href = findHref(domEvent.target);
  navigate(publish, href);
};

export const linkSubscription = {
  event: 'navigate',
  listener,
};
