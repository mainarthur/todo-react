import * as React from 'react';
import './styles.scss';

class NotFound extends React.PureComponent {
  render(): JSX.Element {
    return <h1 className="title">404 - Page not Found</h1>;
  }
}

export default NotFound;
