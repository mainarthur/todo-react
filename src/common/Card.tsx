import * as React from 'react';
import './Card.scss';

type Props = {
  id?: string
};

class Card extends React.PureComponent<Props> {
  render(): JSX.Element {
    const { children, id } = this.props;

    return <div className="card" id={id}>{children}</div>;
  }
}
export default Card;
