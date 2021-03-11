import * as React from 'react'
import {
  ReactNode,
  FC,
  useEffect,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Update } from 'history'

import setRouteAction from '../redux/actions/routerActions'
import { RootState } from '../redux/reducers'

import { history, locationToRoute } from './routerHistory'
import Route from '../models/Route'

type Props = {
  routes: {
    [key: string]: {
      path: string
    }
  },
  NotFound: ReactNode,
  children?: ReactNode,
}

const Router: FC<Props> = ({
  routes: routesProps,
  NotFound,
  children,
}: Props) => {
  const dispatch = useDispatch()
  const routesState = useSelector((state: RootState) => state.router)

  const setRoute = (route: Route) => dispatch(setRouteAction(route))

  const routes = Object.keys(routesProps).map((key) => routesProps[key].path)

  const handleRouteChange = (update: Update<object>) => {
    const route = locationToRoute(update.location)
    setRoute(route)
  }

  const unlisten = useMemo(() => history.listen(handleRouteChange), [history])

  useEffect(() => {
    setRoute(locationToRoute(history.location))
    return () => unlisten()
  }, [])

  const { route } = routesState

  if (!route) {
    return null
  }

  const is404 = routes.indexOf(route.path) === -1

  return (
    <>
      {is404 ? NotFound : children}
    </>
  )
}

Router.defaultProps = {
  children: null,
}

export default Router
