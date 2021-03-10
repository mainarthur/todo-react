import * as React from 'react'
import { connect } from 'react-redux'
import { Update } from 'history'

import setRouteAction from '../redux/actions/routerActions'
import { RouterState } from '../redux/reducers/routerReducer'
import { RootState } from '../redux/reducers'

import { history, RouterContext, locationToRoute } from './RouterContext'

interface DispatchProps {
  setRoute: typeof setRouteAction
}

type OwnProps = {
  routes: {
    [key: string]: {
      path: string
    }
  },
  NotFound: React.ReactNode,
}

type Props = RouterState & DispatchProps & OwnProps & { children?: React.ReactNode }

class Router extends React.Component<Props> {
  routes: string[]

  unlisten: () => void

  constructor(props: Props | Readonly<Props>) {
    super(props)
    this.routes = Object.keys(props.routes).map((key) => props.routes[key].path)
    this.unlisten = history.listen(this.handleRouteChange)
    props.setRoute(locationToRoute(history.location))
  }

  componentWillUnmount() {
    this.unlisten()
  }

  handleRouteChange = (update: Update<object>) => {
    const { setRoute } = this.props

    const route = locationToRoute(update.location)
    setRoute(route)
  };

  render() {
    const { children, NotFound, route } = this.props
    if (!route) {
      return null
    }
    const routerContextValue = { route }
    const is404 = this.routes.indexOf(route.path) === -1

    return (
      <RouterContext.Provider value={routerContextValue}>
        {is404 ? NotFound : children}
      </RouterContext.Provider>
    )
  }
}

const mapStateToProps = (state: RootState): RouterState => ({ ...state.router })

const mapDispatchToProps: DispatchProps = {
  setRoute: setRouteAction,
}

export default connect<RouterState, DispatchProps, OwnProps>(mapStateToProps,
  mapDispatchToProps)(Router)
