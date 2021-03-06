import * as React from 'react'
import {
  ReactNode,
  FC,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Update } from 'history'

import { setRouteAction } from '../../redux/actions/routerActions'
import { RootState } from '../../redux/reducers'

import { history, locationToRoute } from '../routerHistory'

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

  const routes = Object.keys(routesProps).map((key) => routesProps[key].path)

  const handleRouteChange = useCallback((update: Update<object>) => {
    const route = locationToRoute(update.location)
    dispatch(setRouteAction(route))
  }, [dispatch])

  const unlisten = useMemo(() => history.listen(handleRouteChange), [handleRouteChange])

  useEffect(() => {
    const route = locationToRoute(history.location)

    dispatch(setRouteAction(route))
    return () => unlisten()
  }, [dispatch, unlisten])

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
