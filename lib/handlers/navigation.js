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
  publish(event); // This used to use setTimeout to hack next tick to give location change time
  // Not sure if it's needed in Deno or real life
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
