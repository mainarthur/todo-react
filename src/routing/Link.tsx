import * as React from 'react';
import { RouterContext, history } from './RouterContext';

type Props = {
  to: string;
  onClick?(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void,
  className?: string;
};

export default class Link extends React.Component<Props> {
  onAnchorClick(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const { onClick, to } = this.props;
    const { route } = this.context;

    ev.preventDefault();

    if (onClick) {
      onClick(ev);
    }

    if (route.path === to) {
      return;
    }

    history.push(to);
  }

  render() {
    const {
      to, children, className,
    } = this.props;

    return (
      <a
        href={to}
        className={className}
        onClick={this.onAnchorClick}
      >
        {children}
      </a>
    );
  }
}

Link.contextType = RouterContext;
