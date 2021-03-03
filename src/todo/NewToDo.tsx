import * as React from 'react';
import { api } from '../api/api';
import NewToDoBody from '../api/bodies/NewToDoBody';
import NewToDoResponse from '../api/responses/NewToDoResponse';
import Button from '../common/Button';
import TextField from '../common/TextField';
import ToDo from '../models/ToDo';
import './NewToDo.scss';

type Props = {
  onNewToDo(toDo: ToDo): void;
};

type State = {
  textFieldValue: string;
  invalidText: boolean;
};

class NewToDo extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      textFieldValue: '',
      invalidText: false,
    };
  }

  async onButtonClick() {
    const { onNewToDo } = this.props;
    const { textFieldValue } = this.state;

    const toDoText = textFieldValue.trim();

    if (toDoText === '') {
      return this.setState({
        invalidText: true,
      });
    }

    this.setState({ textFieldValue: '', invalidText: false });

    const toDoResponse = await api<NewToDoResponse, NewToDoBody>({
      endpoint: '/todo',
      method: 'POST',
      body: {
        text: toDoText,
      },
    });

    if (toDoResponse.status) {
      onNewToDo((toDoResponse as NewToDoResponse).result);
    }

    return null;
  }

  render(): JSX.Element {
    const { textFieldValue, invalidText } = this.state;

    return (
      <div className="new-todo">
        <form className="new-todo__form" id="main-form">
          <TextField
            className="new-todo__input"
            type="text"
            id="todo-text"
            placeholder="NEW TODO"
            errorText="Text is required"
            invalid={invalidText}
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
