import * as React from 'react'
import { ReactNode, FC, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducers'
import { history } from './routerHistory'

type Props = {
  to: string
  onClick?(ev: MouseEvent<HTMLAnchorElement>): void,
  className?: string,
  children?: ReactNode
}

const Link: FC<Props> = ({
  to,
  onClick,
  className,
  children,
}: Props) => {
  const context = useSelector((state: RootState) => state.router)

  const onAnchorClick = (ev: MouseEvent<HTMLAnchorElement>) => {
    const { route } = context

    ev.preventDefault()

    if (onClick) {
      onClick(ev)
    }

    if (route.path === to) {
      return
    }

    history.push(to)
  }

  return (
    <a
      href={to}
      className={className}
      onClick={onAnchorClick}
    >
      {children}
    </a>
  )
}

Link.defaultProps = {
  onClick: () => null,
  children: null,
  className: null,
}

export default Link
