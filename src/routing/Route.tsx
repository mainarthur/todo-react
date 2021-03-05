import * as React from 'react'
import { RouterContext } from './RouterContext'

type Props = {
  path: string
}

export default class Route extends React.PureComponent<Props> {
  render() {
    const { path, children } = this.props
    const { route } = this.context

    if (path !== route.path) return <></>

    return <>{children}</>
  }
}

Route.contextType = RouterContext
