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
  disabled?: boolean
}

const Link: FC<Props> = ({
  to,
  onClick,
  className,
  children,
  disabled,
}: Props) => {
  const context = useSelector((state: RootState) => state.router)

  const onAnchorClick = (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault()

    if (disabled) {
      return
    }

    const { route } = context

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
  disabled: false,
}

export default Link
