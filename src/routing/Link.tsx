import * as React from 'react';
import { RouterContext, history } from './RouterContext';

type Props = {
  to: string
  onClick?(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void,
  className?: string
};

export default class Link extends React.Component<Props> {
  static contextType = RouterContext;

  render() {
    const {
      to, onClick, children, className,
    } = this.props;
    const { route } = this.context;

    return (
      <a
        href={to}
        {...{ className }}
        onClick={(ev) => {
          ev.preventDefault();

          if (onClick) {
            onClick(ev);
          }

          if (route.path === to) {
            return;
          }

          history.push(to);
        }}
      >
        {children}
      </a>
    );
  }
}
