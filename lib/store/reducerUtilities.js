export const composeReducers = (reducers) => {
  const reducer = (state = reducer.initial, actionData) => {
    if (typeof state === 'function') state = state()

    return reducers.reduce((latestState, reducer) => {
      return reducer(latestState, actionData)
    }, state)
  }

  reducer.initialState = (state) => {
    reducer.initial = state
    return reducer
  }

  return reducer
}

export const createReducer = (event) => {
  const reducer = (state = reducer.initial, action = {}) => {
    if (typeof state === 'function') state = state()

    const { type, payload } = action
    if (type !== event || !reducer.transformer) return state

    return reducer.transformer(state, payload)
  }

  reducer.transform = (transformer) => {
    reducer.transformer = transformer
    return reducer
  }

  reducer.initialState = (state) => {
    reducer.initial = state
    return reducer
  }

  return reducer
}
