import * as React from 'react';
import Button from '../common/Button';
import TextField from '../common/TextField';
import './NewToDo.scss';

type Props = {

};

type State = {
  textFieldValue: string;
};

class NewToDo extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      textFieldValue: '',
    };
  }

  async onButtonClick() {
    const { textFieldValue } = this.state;

    const toDoText = textFieldValue;

    this.setState({ textFieldValue: '' });
  }

  render(): JSX.Element {
    const { textFieldValue } = this.state;

    return (
      <div className="new-todo">
        <form className="new-todo__form" id="main-form">
          <TextField
            className="new-todo__input"
            type="text"
            id="todo-text"
            placeholder="NEW TODO"
            value={textFieldValue}
            onChange={(ev) => this.setState({
              textFieldValue: ev.target.value,
            })}
          />
          <Button id="add-todo" className="new-todo__btn-add" onClick={() => this.onButtonClick()}>ADD</Button>
        </form>
      </div>
    );
  }
}
export default NewToDo;
