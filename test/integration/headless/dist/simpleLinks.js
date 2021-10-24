const findHref = (node)=>{
    if (!node || !node.getAttribute) return '';
    while(!node.getAttribute('href')){
        node = node.parentNode;
        if (!node || !node.getAttribute) return '';
    }
    return node.getAttribute('href');
};
const setAttributesOnElement = (element, attributes)=>{
    for(const key in attributes){
        element.setAttribute(key, attributes[key]);
    }
};
const setEventsOnElement = (element, events, publish)=>{
    const listeners = [];
    for(const domEvent in events){
        const eventName = events[domEvent];
        const listener = (event)=>publish(eventName, event)
        ;
        listeners.push({
            event: domEvent,
            listener
        });
        element.addEventListener(domEvent, listener);
    }
    return listeners;
};
const removeListeners = (element, listeners)=>{
    listeners.forEach(({ event , listener  })=>{
        element.removeEventListener(event, listener);
    });
};
const createNode = (type, document)=>{
    document = document || window.document;
    return document.createElement(type);
};
const createTextNode = (value, document)=>{
    document = document || window.document;
    return document.createTextNode(value);
};
const createDecoratedNode = (type, attributes, events, renderKit)=>{
    const dom = createNode(type, renderKit.document);
    setAttributesOnElement(dom, attributes);
    const listeners = setEventsOnElement(dom, events, renderKit.publish);
    return {
        dom,
        listeners
    };
};
const storeEvent = (name)=>{
    const eventName = `store:${name}`;
    return {
        [name]: eventName
    };
};
const __default = {
    store: {
        ...storeEvent('updateLocation')
    }
};
const event = __default.store.updateLocation;
const windowListener = (publish)=>{
    return ()=>{
        publish(event);
    };
};
const attachHistoryListener = (publish)=>{
    window.onpopstate = windowListener(publish);
};
const navigate = (publish, path)=>{
    history.pushState(null, '', path);
    publish(event);
};
const listener = (domEvent, _eventName, publish)=>{
    if (!domEvent || !domEvent.target) return;
    domEvent.preventDefault();
    const href = findHref(domEvent.target);
    navigate(publish, href);
};
const linkSubscription = {
    event: 'navigate',
    listener
};
const listener1 = (event)=>{
    event.preventDefault();
    event.stopPropagation();
};
const noOpSubscription = {
    event: 'no-op',
    listener: listener1
};
var exports = {
}, _dewExec = false;
function dew() {
    if (_dewExec) return exports;
    _dewExec = true;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports['default'] = symbolObservablePonyfill;
    function symbolObservablePonyfill(root) {
        var result;
        var _Symbol = root.Symbol;
        if (typeof _Symbol === 'function') {
            if (_Symbol.observable) {
                result = _Symbol.observable;
            } else {
                result = _Symbol('observable');
                _Symbol.observable = result;
            }
        } else {
            result = '@@observable';
        }
        return result;
    }
    return exports;
}
var exports1 = {
}, _dewExec1 = false;
var module = {
    exports: exports1
};
var _global = typeof self !== "undefined" ? self : global;
function dew1() {
    if (_dewExec1) return module.exports;
    _dewExec1 = true;
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var _ponyfill = dew();
    var _ponyfill2 = _interopRequireDefault(_ponyfill);
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            'default': obj
        };
    }
    var root;
    if (typeof self !== 'undefined') {
        root = self;
    } else if (typeof window !== 'undefined') {
        root = window;
    } else if (typeof _global !== 'undefined') {
        root = _global;
    } else {
        root = module;
    }
    var result = (0, _ponyfill2['default'])(root);
    exports1['default'] = result;
    return module.exports;
}
var exports2 = {
}, _dewExec2 = false;
function dew2() {
    if (_dewExec2) return exports2;
    _dewExec2 = true;
    Object.defineProperty(exports2, '__esModule', {
        value: true
    });
    function _interopDefault(ex) {
        return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
    }
    var $$observable = _interopDefault(dew1());
    var randomString = function randomString() {
        return Math.random().toString(36).substring(7).split('').join('.');
    };
    var ActionTypes = {
        INIT: "@@redux/INIT" + randomString(),
        REPLACE: "@@redux/REPLACE" + randomString(),
        PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
            return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
        }
    };
    function isPlainObject(obj) {
        if (typeof obj !== 'object' || obj === null) return false;
        var proto = obj;
        while(Object.getPrototypeOf(proto) !== null){
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(obj) === proto;
    }
    function createStore(reducer, preloadedState, enhancer) {
        var _ref2;
        if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
            throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
        }
        if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
            enhancer = preloadedState;
            preloadedState = undefined;
        }
        if (typeof enhancer !== 'undefined') {
            if (typeof enhancer !== 'function') {
                throw new Error('Expected the enhancer to be a function.');
            }
            return enhancer(createStore)(reducer, preloadedState);
        }
        if (typeof reducer !== 'function') {
            throw new Error('Expected the reducer to be a function.');
        }
        var currentReducer = reducer;
        var currentState = preloadedState;
        var currentListeners = [];
        var nextListeners = currentListeners;
        var isDispatching = false;
        function ensureCanMutateNextListeners() {
            if (nextListeners === currentListeners) {
                nextListeners = currentListeners.slice();
            }
        }
        function getState() {
            if (isDispatching) {
                throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
            }
            return currentState;
        }
        function subscribe(listener) {
            if (typeof listener !== 'function') {
                throw new Error('Expected the listener to be a function.');
            }
            if (isDispatching) {
                throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
            }
            var isSubscribed = true;
            ensureCanMutateNextListeners();
            nextListeners.push(listener);
            return function unsubscribe() {
                if (!isSubscribed) {
                    return;
                }
                if (isDispatching) {
                    throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
                }
                isSubscribed = false;
                ensureCanMutateNextListeners();
                var index = nextListeners.indexOf(listener);
                nextListeners.splice(index, 1);
                currentListeners = null;
            };
        }
        function dispatch(action) {
            if (!isPlainObject(action)) {
                throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
            }
            if (typeof action.type === 'undefined') {
                throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
            }
            if (isDispatching) {
                throw new Error('Reducers may not dispatch actions.');
            }
            try {
                isDispatching = true;
                currentState = currentReducer(currentState, action);
            } finally{
                isDispatching = false;
            }
            var listeners = currentListeners = nextListeners;
            for(var i = 0; i < listeners.length; i++){
                var listener = listeners[i];
                listener();
            }
            return action;
        }
        function replaceReducer(nextReducer) {
            if (typeof nextReducer !== 'function') {
                throw new Error('Expected the nextReducer to be a function.');
            }
            currentReducer = nextReducer;
            dispatch({
                type: ActionTypes.REPLACE
            });
        }
        function observable() {
            var _ref;
            var outerSubscribe = subscribe;
            return _ref = {
                subscribe: function subscribe(observer) {
                    if (typeof observer !== 'object' || observer === null) {
                        throw new TypeError('Expected the observer to be an object.');
                    }
                    function observeState() {
                        if (observer.next) {
                            observer.next(getState());
                        }
                    }
                    observeState();
                    var unsubscribe = outerSubscribe(observeState);
                    return {
                        unsubscribe: unsubscribe
                    };
                }
            }, _ref[$$observable] = function() {
                return this;
            }, _ref;
        }
        dispatch({
            type: ActionTypes.INIT
        });
        return _ref2 = {
            dispatch: dispatch,
            subscribe: subscribe,
            getState: getState,
            replaceReducer: replaceReducer
        }, _ref2[$$observable] = observable, _ref2;
    }
    function warning(message) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error(message);
        }
        try {
            throw new Error(message);
        } catch (e) {
        }
    }
    function getUndefinedStateErrorMessage(key, action) {
        var actionType = action && action.type;
        var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
        return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
    }
    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
        var reducerKeys = Object.keys(reducers);
        var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';
        if (reducerKeys.length === 0) {
            return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
        }
        if (!isPlainObject(inputState)) {
            return "The " + argumentName + " has unexpected type of \"" + ({
            }).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
        }
        var unexpectedKeys = Object.keys(inputState).filter(function(key) {
            return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
        });
        unexpectedKeys.forEach(function(key) {
            unexpectedKeyCache[key] = true;
        });
        if (action && action.type === ActionTypes.REPLACE) return;
        if (unexpectedKeys.length > 0) {
            return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
        }
    }
    function assertReducerShape(reducers) {
        Object.keys(reducers).forEach(function(key) {
            var reducer = reducers[key];
            var initialState = reducer(undefined, {
                type: ActionTypes.INIT
            });
            if (typeof initialState === 'undefined') {
                throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
            }
            if (typeof reducer(undefined, {
                type: ActionTypes.PROBE_UNKNOWN_ACTION()
            }) === 'undefined') {
                throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
            }
        });
    }
    function combineReducers(reducers) {
        var reducerKeys = Object.keys(reducers);
        var finalReducers = {
        };
        for(var i = 0; i < reducerKeys.length; i++){
            var key = reducerKeys[i];
            {
                if (typeof reducers[key] === 'undefined') {
                    warning("No reducer provided for key \"" + key + "\"");
                }
            }
            if (typeof reducers[key] === 'function') {
                finalReducers[key] = reducers[key];
            }
        }
        var finalReducerKeys = Object.keys(finalReducers);
        var unexpectedKeyCache;
        {
            unexpectedKeyCache = {
            };
        }
        var shapeAssertionError;
        try {
            assertReducerShape(finalReducers);
        } catch (e) {
            shapeAssertionError = e;
        }
        return function combination(state, action) {
            if (state === void 0) {
                state = {
                };
            }
            if (shapeAssertionError) {
                throw shapeAssertionError;
            }
            {
                var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
                if (warningMessage) {
                    warning(warningMessage);
                }
            }
            var hasChanged = false;
            var nextState = {
            };
            for(var _i = 0; _i < finalReducerKeys.length; _i++){
                var _key = finalReducerKeys[_i];
                var reducer = finalReducers[_key];
                var previousStateForKey = state[_key];
                var nextStateForKey = reducer(previousStateForKey, action);
                if (typeof nextStateForKey === 'undefined') {
                    var errorMessage = getUndefinedStateErrorMessage(_key, action);
                    throw new Error(errorMessage);
                }
                nextState[_key] = nextStateForKey;
                hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            }
            hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
            return hasChanged ? nextState : state;
        };
    }
    function bindActionCreator(actionCreator, dispatch) {
        return function() {
            return dispatch(actionCreator.apply(this, arguments));
        };
    }
    function bindActionCreators(actionCreators, dispatch) {
        if (typeof actionCreators === 'function') {
            return bindActionCreator(actionCreators, dispatch);
        }
        if (typeof actionCreators !== 'object' || actionCreators === null) {
            throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
        }
        var boundActionCreators = {
        };
        for(var key in actionCreators){
            var actionCreator = actionCreators[key];
            if (typeof actionCreator === 'function') {
                boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
            }
        }
        return boundActionCreators;
    }
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            keys.push.apply(keys, Object.getOwnPropertySymbols(object));
        }
        if (enumerableOnly) keys = keys.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        return keys;
    }
    function _objectSpread2(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i] != null ? arguments[i] : {
            };
            if (i % 2) {
                ownKeys(source, true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                });
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
            } else {
                ownKeys(source).forEach(function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                });
            }
        }
        return target;
    }
    function compose() {
        for(var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++){
            funcs[_key] = arguments[_key];
        }
        if (funcs.length === 0) {
            return function(arg) {
                return arg;
            };
        }
        if (funcs.length === 1) {
            return funcs[0];
        }
        return funcs.reduce(function(a, b) {
            return function() {
                return a(b.apply(void 0, arguments));
            };
        });
    }
    function applyMiddleware() {
        for(var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++){
            middlewares[_key] = arguments[_key];
        }
        return function(createStore) {
            return function() {
                var store = createStore.apply(void 0, arguments);
                var _dispatch = function dispatch() {
                    throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
                };
                var middlewareAPI = {
                    getState: store.getState,
                    dispatch: function dispatch() {
                        return _dispatch.apply(void 0, arguments);
                    }
                };
                var chain = middlewares.map(function(middleware) {
                    return middleware(middlewareAPI);
                });
                _dispatch = compose.apply(void 0, chain)(store.dispatch);
                return _objectSpread2({
                }, store, {
                    dispatch: _dispatch
                });
            };
        };
    }
    function isCrushed() {
    }
    if (typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
        warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
    }
    exports2.__DO_NOT_USE__ActionTypes = ActionTypes;
    exports2.applyMiddleware = applyMiddleware;
    exports2.bindActionCreators = bindActionCreators;
    exports2.combineReducers = combineReducers;
    exports2.compose = compose;
    exports2.createStore = createStore;
    return exports2;
}
const __default1 = dew2();
const createReducer = (event)=>{
    if (typeof event === 'function') {
        event = event().type;
    }
    const reducer = (originalState = reducer.initial, action = {
    })=>{
        if (typeof originalState === 'function') originalState = originalState();
        const { type , payload  } = action;
        if (type !== event || !reducer.transformer) return originalState;
        const finalState = reducer.transformer(originalState, payload);
        if (reducer.debugging) {
            reducer.log('REDAXTED-DEBUG', {
                originalState,
                action,
                finalState
            });
        }
        return finalState;
    };
    reducer.transform = (transformer)=>{
        reducer.transformer = transformer;
        return reducer;
    };
    reducer.initialState = (state)=>{
        reducer.initial = state;
        return reducer;
    };
    reducer.debug = (log = console.log)=>{
        reducer.log = log;
        reducer.debugging = true;
        return reducer;
    };
    return reducer;
};
const separateAttrsAndEvents = (combined, defaultValue = '')=>{
    const attributes = {
    };
    const events = {
    };
    for(const key in combined){
        const value = combined[key];
        if (key.match(/on.+/i)) {
            const eventKey = key.slice(2).toLowerCase();
            events[eventKey] = value;
        } else {
            attributes[key] = normalizeValueForKey(combined, key, defaultValue);
        }
    }
    return {
        attributes,
        events
    };
};
const shallowEqual = (object1, object2)=>{
    if (!keysMatch(object1, object2)) return false;
    for(const key in object1){
        if (object1[key] !== object2[key]) return false;
    }
    return true;
};
const keysMatch = (object1, object2)=>{
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    const length = keys1.length;
    if (length !== keys2.length) return false;
    keys1.sort();
    keys2.sort();
    for(let i = 0; i < length; i++){
        if (keys1[i] !== keys2[i]) return false;
    }
    return true;
};
const normalizeValueForKey = (object, key, defaultValue = '')=>{
    if (object[key] === undefined) return defaultValue;
    return object[key];
};
const normalizeHash = (hash)=>{
    return hash[0] === '#' ? hash.slice(1) : hash;
};
const queryParams = (queryString)=>{
    return queryString.replace(/^\?/, '').split('&').reduce((aggregate, pairString)=>{
        if (!pairString) return aggregate;
        const pair = pairString.split('=');
        aggregate[pair[0]] = pair[1];
        return aggregate;
    }, {
    });
};
const locationChanged = (state, locationData)=>{
    if (!state) return true;
    return locationData.hash !== state.hash || locationData.path !== state.path || !shallowEqual(locationData.queryParams, state.queryParams);
};
const dataFromLocation = ()=>{
    const { hash , pathname , search  } = location;
    return {
        hash: normalizeHash(hash),
        path: pathname,
        queryParams: queryParams(search)
    };
};
const transformer = (state)=>{
    const locationData = dataFromLocation();
    if (locationChanged(state, locationData)) {
        return locationData;
    } else {
        return state;
    }
};
const __default2 = createReducer('updateLocation').initialState(()=>dataFromLocation()
).transform(transformer);
const isArray = Array.isArray;
const ensureArray = (children)=>{
    if (isArray(children)) {
        return children;
    }
    if (!children) {
        return [];
    }
    return [
        children
    ];
};
class TextTemplate {
    dom;
    value;
    constructor(content){
        this.value = content;
        this.dom = [];
    }
    render(renderKit) {
        this.dom = this.generateDom(renderKit);
        return this.dom;
    }
    generateDom(renderKit) {
        const textNode = createTextNode(this.value, renderKit.document);
        if (!textNode) return [];
        return [
            textNode
        ];
    }
    remove() {
        this.dom.forEach((element)=>element.remove()
        );
    }
}
const recursiveRender = (children, renderKit, rendered = [], method = 'render')=>{
    return children.reduce((aggregate, view)=>{
        if (!view) return aggregate;
        if (isArray(view)) {
            const dom = recursiveRender(view, renderKit, aggregate, method);
            return dom;
        }
        aggregate.push(view[method](renderKit));
        return aggregate;
    }, rendered).flat();
};
const replaceTextNodes = (child)=>{
    if (isTextNode(child)) {
        return textNode(child);
    }
    return child;
};
const isTextNode = (child)=>{
    return typeof child === 'string' || typeof child === 'number';
};
const textNode = (content)=>{
    return new TextTemplate(content);
};
class Children {
    collection;
    dom;
    constructor(jsxChildren){
        this.collection = ensureArray(jsxChildren).map(replaceTextNodes).flat();
        this.dom = [];
    }
    render(renderKit, parentElement) {
        this.dom = this.generateDom(renderKit);
        this.attachToParent(parentElement);
        return this.dom;
    }
    generateDom(renderKit) {
        return recursiveRender(this.collection, renderKit);
    }
    attachToParent(parentElement) {
        if (!parentElement) return;
        this.dom.forEach((dom)=>{
            parentElement.appendChild(dom);
        });
    }
    remove() {
        this.collection.forEach((child)=>child.remove()
        );
    }
}
class TagTemplate {
    type;
    events;
    listeners;
    attributes;
    children;
    dom;
    constructor(tagType, combinedAttributes, children){
        this.type = tagType;
        const { events , attributes  } = separateAttrsAndEvents(combinedAttributes);
        this.events = events;
        this.attributes = attributes;
        this.listeners = [];
        this.children = new Children(children);
        this.dom = [];
    }
    render(renderKit) {
        const { dom , listeners  } = this.generateDom(renderKit);
        if (!dom) return this.dom;
        this.children.render(renderKit, dom);
        this.dom = [
            dom
        ];
        this.listeners = listeners;
        return this.dom;
    }
    generateDom(renderKit) {
        return createDecoratedNode(this.type, this.attributes, this.events, renderKit);
    }
    remove() {
        this.children.remove();
        this.removeListeners();
        this.removeDom();
    }
    removeListeners() {
        this.dom.forEach((element)=>removeListeners(element, this.listeners)
        );
    }
    removeDom() {
        this.dom.forEach((element)=>element.remove()
        );
    }
}
const ensureChildrenArray = (maybeChildren, attributes)=>maybeChildren || attributes.children || []
;
const packageAttributes = (maybeAttributes, maybeChildren)=>{
    const attributes = maybeAttributes || {
    };
    const children = ensureChildrenArray(maybeChildren, attributes);
    attributes.children = attributes.children || children;
    return attributes;
};
const jsx = (type, attributes, ...children)=>{
    if (typeof type === 'string') {
        return new TagTemplate(type, attributes, children);
    }
    return type(packageAttributes(attributes, children));
};
jsx.fragment = (attributes, maybeChildren)=>{
    const children = ensureChildrenArray(maybeChildren, attributes);
    return new Children(children);
};
class MessageBus {
    warn;
    fuzzyListeners;
    exactListeners;
    constructor(options){
        const { warn  } = options;
        this.warn = warn;
        this.fuzzyListeners = [];
        this.exactListeners = {
        };
    }
    subscribe(eventMatcher, listener) {
        if (typeof eventMatcher === 'string') {
            this.subscribeExactListeners(eventMatcher, listener);
        } else {
            this.subscribeFuzzyListerers(eventMatcher, listener);
        }
    }
    subscribeExactListeners(eventMatcher, listener) {
        this.exactListeners[eventMatcher] = this.exactListeners[eventMatcher] || [];
        this.exactListeners[eventMatcher].push(listener);
    }
    subscribeFuzzyListerers(matcher, listener) {
        this.fuzzyListeners.push({
            matcher,
            listener
        });
    }
    publish(eventName, payload) {
        let published = this.publishExactListeners(eventName, payload);
        published = this.publishFuzzyListeners(eventName, payload) || published;
        if (!published) this.warnOfMissingMatch(eventName);
    }
    publishExactListeners(eventName, payload) {
        if (!this.exactListeners[eventName]) return false;
        this.exactListeners[eventName].forEach((listener)=>{
            listener(payload, eventName, this.publish.bind(this));
        });
        return true;
    }
    publishFuzzyListeners(eventName, payload) {
        let published = false;
        this.fuzzyListeners.forEach(({ matcher , listener  })=>{
            if (eventName.match(matcher)) {
                published = true;
                listener(payload, eventName, this.publish.bind(this));
            }
        });
        return published;
    }
    warnOfMissingMatch(eventName) {
        if (!this.warn) return;
        this.warn(`Event "${eventName}" has no listeners`);
    }
}
const defaultOptions = {
    warn: undefined
};
const __default3 = (options = defaultOptions)=>{
    return new MessageBus(options);
};
class Root {
    Template;
    selector;
    document;
    parentElement;
    dom;
    template;
    constructor(Template, selector, document = null){
        this.Template = Template;
        this.selector = selector;
        this.document = document || window.document;
        this.parentElement = this.document.querySelector(selector);
        this.dom = [];
    }
    render(renderKit) {
        this.dom = this.generateDom(renderKit);
        this.attachToParent();
        return this.dom;
    }
    generateDom(renderKit) {
        this.template = this.Template({
        });
        return this.template.render(renderKit);
    }
    attachToParent() {
        if (this.parentElement == null) return;
        const parent = this.parentElement;
        parent.innerHTML = '';
        this.dom.forEach((element)=>parent.appendChild(element)
        );
    }
    remove() {
        this.template && this.template.remove();
    }
}
const { createStore  } = __default1;
const configureBus = (handlers)=>{
    const bus = __default3();
    handlers.forEach(({ event , listener  })=>{
        bus.subscribe(event, listener);
    });
    return bus;
};
const configureStore = (reducers)=>{
    return createStore(reducers);
};
const connectStore = (bus, store)=>{
    const storeMatcher = /store:(.+)/;
    bus.subscribe(storeMatcher, (payload, eventName)=>{
        const type = eventName.match(storeMatcher)[1];
        store.dispatch({
            type,
            payload
        });
    });
};
const startHistory = (bus)=>{
    const publish = (name, payload)=>bus.publish(name, payload)
    ;
    attachHistoryListener(publish);
};
class App {
    constructor({ handlers , reducers , store  }){
        this.rootTemplates = [];
        this.bus = configureBus(handlers);
        this.publish = (name, payload)=>this.bus.publish(name, payload)
        ;
        this.store = store || configureStore(reducers);
        connectStore(this.bus, this.store);
        startHistory(this.bus);
        this.state = this.store.getState();
        this.store.subscribe(()=>this.rerender()
        );
    }
    render({ selector , document , Template  }) {
        document = document || window.document;
        document.addEventListener('DOMContentLoaded', ()=>{
            const template = new Root(Template, selector, document);
            this.rootTemplates.push(template);
            const renderKit = this.renderKit();
            if (!renderKit.document) renderKit.document = document;
            template.render(renderKit);
        });
    }
    rerender() {
        const renderKit = this.renderKit();
        if (this.state === renderKit.state) return;
        this.state = renderKit.state;
        this.rootTemplates.forEach((template)=>{
            template.render(renderKit);
        });
    }
    renderKit() {
        return {
            document: this.document,
            state: this.store.getState(),
            publish: this.publish
        };
    }
}
const __default4 = (configuration)=>{
    return new App(configuration);
};
class Bound {
    Template;
    template;
    viewModel;
    attributes;
    viewModelProps;
    props;
    dom;
    constructor(Template, viewModel, attributes){
        this.Template = Template;
        this.viewModel = viewModel;
        this.attributes = attributes || {
        };
        this.viewModelProps = {
        };
        this.props = {
        };
        this.dom = [];
    }
    render(renderKit) {
        this.dom = this.generateDom(renderKit);
        return this.dom;
    }
    generateDom(renderKit) {
        const state = renderKit.state || {
        };
        this.viewModelProps = this.viewModel(state);
        this.props = {
            ...this.viewModelProps,
            ...this.attributes
        };
        this.template = this.Template(this.props);
        return this.template.render(renderKit);
    }
    remove() {
        this.template && this.template.remove();
    }
}
const bind = (Template, viewModel)=>{
    return (attributes)=>new Bound(Template, viewModel, attributes)
    ;
};
const { createStore: createStore1 , combineReducers  } = __default1;
const appHandlers = [
    linkSubscription,
    noOpSubscription, 
];
const appReducers = {
    location: __default2
};
const Link = ({ href , description  })=>{
    return jsx("p", null, jsx("a", {
        href: href,
        onClick: "navigate"
    }, description));
};
const NotLink = ({ description  })=>{
    return jsx("p", null, description);
};
const MaybeLink = ({ currentPath , href , description  })=>{
    if (currentPath === href) return jsx(NotLink, {
        description: description
    });
    return jsx(Link, {
        href: href,
        description: description
    });
};
const linkViewModel = (state)=>({
        currentPath: state.location.path
    })
;
const TabHeader = bind(MaybeLink, linkViewModel);
const Page = ()=>{
    return jsx("div", {
        class: "page"
    }, jsx("h1", null, "Where to go, what to do?"), jsx("div", {
        class: "tab-headers"
    }, jsx(TabHeader, {
        href: "/simpleLinks",
        description: "Home area"
    }), jsx(TabHeader, {
        href: "/switchTabs",
        description: "Alternative view"
    })));
};
const reducers = combineReducers(appReducers);
const app = __default4({
    handlers: appHandlers,
    reducers
});
const selector1 = '#app';
app.render({
    selector: selector1,
    Template: Page
});
