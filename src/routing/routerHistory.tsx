import { createBrowserHistory, Location } from 'history'
import * as qs from 'querystringify'

export const history = createBrowserHistory()

export function locationToRoute(location: Location<object>) {
  return {
    path: location.pathname,
    hash: location.hash,
    query: qs.parse(location.search),
  }
}
