const addPathToCollection = (collection, path, component) => {
  collection.push({
    path,
    component,
    fuzzy: false
  })
}

const addMatcherToCollection = (collection, matcher, component) => {
  collection.push({
    matcher,
    component,
    fuzzy: true
  })
}

const appendIfMatches = (matchingRoutes, route, path) => {
  const matches = path.match(route.matcher)
  if (matches) {
    matchingRoutes.push({
      ...route,
      matches
    })
  }
}

const appendIfExact = (matchingRoutes, route, path) => {
  if (route.path === path) {
    matchingRoutes.push(route)
  }
}

const appendRelatedRoute = (matchingRoutes, route, path) => {
  if (route.fuzzy) {
    appendIfMatches(matchingRoutes, route, path)
  } else {
    appendIfExact(matchingRoutes, route, path)
  }
}

const addPath = (collection, routes) => (path, component) => {
  addPathToCollection(collection, path, component)
  return routes
}

const addMatcher = (collection, routes) => (matcher, component) => {
  addMatcherToCollection(collection, matcher, component)
  return routes
}

const getRoutes = (collection) => (path) => {
  let defaultRoute

  const matches = collection.reduce((matchingRoutes, route) => {
    if (route.default) {
      defaultRoute = route
    } else {
      appendRelatedRoute(matchingRoutes, route, path)
    }
    return matchingRoutes
  }, [])

  if (!matches.length && defaultRoute) {
    matches.push(defaultRoute)
  }

  return matches
}

const getRoute = (collection) => (path) => {
  return getRoutes(collection)(path)[0]
}

const addDefault = (collection, routes) => (component) => {
  collection.push({
    matcher: undefined,
    component: component,
    fuzzy: false,
    default: true
  })

  return routes
}

const routes = () => {
  const collection = []

  routes.addPath = addPath(collection, routes)
  routes.addMatcher = addMatcher(collection, routes)
  routes.default = addDefault(collection, routes)
  routes.getRoutes = getRoutes(collection)
  routes.getRoute = getRoute(collection)

  return routes
}

export default routes
