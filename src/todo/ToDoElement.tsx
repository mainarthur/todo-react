import * as React from 'react';
import Button from '../common/Button';

type Props = {
  id: string;
  onDelete(id: string): void;
  onStatusChange(id: string, newStatus: boolean): void;
  text: string;
  done: boolean;

};

type State = {

};

class ToDoElement extends React.Component<Props, State> {
  onDeleteButtonClick(): void {
    const { id, onDelete } = this.props;
    onDelete(id);
  }

  onCheckBoxChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    const { id, onStatusChange } = this.props;

    onStatusChange(id, ev.target.checked);
  }

  render(): JSX.Element {
    const {
      text, done,
    } = this.props;

    return (
      <li className="todo">
        <input className="todo__checkbox" type="checkbox" checked={done} onChange={(ev) => this.onCheckBoxChange(ev)} />
        <span className="todo__text">{text}</span>
        )
        <span className="todo_centered-horizontally"><Button onClick={() => this.onDeleteButtonClick()} className="todo__btn-delete">X</Button></span>
        <hr className="todo__divider" />
      </li>
    );
  }
}
export default ToDoElement;
