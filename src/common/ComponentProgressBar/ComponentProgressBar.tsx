import * as React from 'react'
import { FC, ReactNode } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

interface Props {
  loading: boolean
  children?: ReactNode
  className?: string
}

const ComponentProgressBar: FC<Props> = ({ children, loading, className }: Props) => (loading ? <CircularProgress className={className} size="1.5rem" /> : <>{children}</>)

ComponentProgressBar.defaultProps = {
  className: null,
  children: null,
}

export default ComponentProgressBar
