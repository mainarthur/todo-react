import * as React from 'react'
import { ReactNode, FC } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../redux/reducers'

type Props = {
  path: string,
  children?: ReactNode
}

const Route: FC<Props> = ({
  path,
  children,
}: Props) => {
  const routerContext = useSelector((state: RootState) => state.router)
  const { route } = routerContext

  if (path !== route.path) return <></>

  return <>{children}</>
}

Route.defaultProps = {
  children: null,
}

export default Route
