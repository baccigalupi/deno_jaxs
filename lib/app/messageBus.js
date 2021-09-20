export class MessageBus {
  constructor({ warn }) {
    this.warn = warn
    this.fuzzyListeners = []
    this.exactListeners = {}
  }

  subscribe(eventMatcher, listener) {
    if (typeof eventMatcher === 'string') {
      this.subscribeExactListeners(eventMatcher, listener)
    } else {
      this.subscribeFuzzyListeren(eventMatcher, listener)
    }
  }

  subscribeExactListeners(eventMatcher, listener) {
    this.exactListeners[eventMatcher] = this.exactListeners[eventMatcher] || []
    this.exactListeners[eventMatcher].push(listener)
  }

  subscribeFuzzyListeren(matcher, listener) {
    this.fuzzyListeners.push({ matcher, listener })
  }

  publish(eventName, payload) {
    let published = this.publishExactListeners(eventName, payload)
    published = this.publishFuzzyListeners(eventName, payload) || published

    if (!published) this.warnOfMissingMatch(eventName)
  }

  publishExactListeners(eventName, payload) {
    if (!this.exactListeners[eventName]) return false

    this.exactListeners[eventName].forEach((listener) => {
      listener(payload, eventName, this.publish.bind(this))
    })

    return true
  }

  publishFuzzyListeners(eventName, payload) {
    let published = false

    this.fuzzyListeners.forEach(({ matcher, listener }) => {
      if (eventName.match(matcher)) {
        published = true
        listener(payload, eventName, this.publish.bind(this))
      }
    })

    return published
  }

  warnOfMissingMatch(eventName) {
    if (!this.warn) return

    this.warn(`Event "${eventName}" has no listeners`)
  }
}

export default (options = {}) => {
  return new MessageBus(options)
}
