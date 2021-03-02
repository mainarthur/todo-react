import * as React from 'react';
import './Button.scss';

type Props = {
  className?: string
  id?: string
  onClick?(event: React.MouseEvent<HTMLDivElement, MouseEvent> |
  React.KeyboardEvent<HTMLDivElement>): void
};

class Button extends React.Component<Props> {
  onDivClicked(ev:React.MouseEvent<HTMLDivElement, MouseEvent> |
  React.KeyboardEvent<HTMLDivElement>) {
    const {
      onClick,
    } = this.props;

    onClick(ev);
  }

  render(): JSX.Element {
    const {
      className, children, id,
    } = this.props;

    return (
      <div
        id={id}
        role="button"
        tabIndex={0}
        onClick={(ev) => this.onDivClicked(ev)}
        onKeyDown={(ev) => this.onDivClicked(ev)}
        className={className ? `${className} btn` : 'btn'}
      >
        {children}
      </div>
    );
  }
}
export default Button;
