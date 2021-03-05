import * as React from 'react'
import { MouseEvent as RMouseEvent, KeyboardEvent } from 'react'
import './Button.scss'

type Props = {
  className?: string
  id?: string
  onClick?(event: RMouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent<HTMLDivElement>): void
}

class Button extends React.Component<Props> {
  onDivClicked = (ev: RMouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent<HTMLDivElement>) => {
    const {
      onClick,
    } = this.props

    onClick(ev)
  };

  render(): JSX.Element {
    const {
      className, children, id,
    } = this.props

    return (
      <div
        id={id}
        role="button"
        tabIndex={0}
        onClick={this.onDivClicked}
        onKeyDown={this.onDivClicked}
        className={className ? `${className} btn` : 'btn'}
      >
        {children}
      </div>
    )
  }
}
export default Button
