import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import createBus from '../../lib/app/messageBus.ts';

Deno.test('MessageBus: adds a listener and calls it when event is triggered', () => {
  const listenerCalls: Array<string> = [];

  const bus = createBus();
  bus.subscribe('click', (payload) => {
    listenerCalls.push(payload);
  });

  bus.publish('click', 'first click');
  bus.publish('click', 'second click');

  assertEquals(listenerCalls[0], 'first click');
  assertEquals(listenerCalls[1], 'second click');
});

Deno.test('MessageBus: calls multiple listeners for the same event name', () => {
  const listenerCalls: Array<Record<string, string>> = [];

  const bus = createBus();
  bus.subscribe('click', (payload) => {
    listenerCalls.push({ message: 'first callback', payload });
  });
  bus.subscribe('click', (payload) => {
    listenerCalls.push({ message: 'second callback', payload });
  });

  bus.publish('click', 'click bate');

  assertEquals(listenerCalls[0], {
    message: 'first callback',
    payload: 'click bate',
  });
  assertEquals(listenerCalls[1], {
    message: 'second callback',
    payload: 'click bate',
  });
});

Deno.test('MessageBus: works with regex event registration', () => {
  const listenerCalls: Array<Record<string, string>> = [];

  const bus = createBus();
  bus.subscribe(/store:.+/, (payload, event) => {
    listenerCalls.push({ payload, event });
  });

  bus.publish('store:updateAboutMeForm', 'input');
  bus.publish('store:clearCurrentUser', 'user-id');

  assertEquals(listenerCalls[0], {
    payload: 'input',
    event: 'store:updateAboutMeForm',
  });

  assertEquals(listenerCalls[1], {
    payload: 'user-id',
    event: 'store:clearCurrentUser',
  });
});

Deno.test('MessageBus: calls exact matches before fuzzy matches, regardless of subscribe order', () => {
  const listenerCalls: Array<string> = [];

  const bus = createBus();
  bus.subscribe(/store:.+/, () => {
    listenerCalls.push('fuzzy call');
  });
  bus.subscribe('store:updateAboutMeForm', () => {
    listenerCalls.push('exact call');
  });

  bus.publish('store:updateAboutMeForm', 'whatever');

  assertEquals(listenerCalls, ['exact call', 'fuzzy call']);
});

Deno.test('MessageBus: logs a warning when there is no match listener for an event', () => {
  const messages: Array<string> = [];
  const bus = createBus({
    warn: (message) => messages.push(message),
  });
  bus.subscribe('click', () => {
    /*no-op*/
  });
  bus.publish('click', 'hello');
  bus.publish('clickMe', 'hello?');

  assertEquals(messages, ['Event "clickMe" has no listeners']);
});

Deno.test('MessageBus: wont warn when there is a fuzzy match', () => {
  const messages: Array<string> = [];
  const bus = createBus({
    warn: (message) => messages.push(message),
  });
  bus.subscribe(/click.*/, () => {
    /*no-op*/
  });
  bus.publish('click', 'hello');
  bus.publish('clickMe', 'hello?');

  assertEquals(messages, []);
});
