import * as React from 'react';
import { api } from '../api/api';
import NewToDoBody from '../api/bodies/NewToDoBody';
import NewToDoResponse from '../api/responses/NewToDoResponse';
import Button from '../common/Button';
import Card from '../common/Card';
import ErrorLabel from '../common/ErrorLabel';
import TextField from '../common/TextField';
import ToDo from '../models/ToDo';
import './NewToDo.scss';

type OwnProps = {
  onNewToDo(toDo: ToDo): void;
};

class NewToDo extends React.Component<Props, State> {
  timerId: number;

  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      textFieldValue: '',
      invalidText: false,
    };
  }

  onFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    this.onButtonClick();
  };

  onButtonClick = async () => {
    const { onNewToDo } = this.props;
    const { textFieldValue } = this.state;

    const toDoText = textFieldValue.trim();

    if (toDoText === '') {
      clearTimeout(this.timerId);

      this.timerId = window.setTimeout(() => {
        const { invalidText } = this.state;
        if (invalidText) {
          this.setState({
            invalidText: false,
          });
        }
      }, 5000);

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

    return true;
  };

  onTextChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newText = ev.target.value;

    if (newText !== '') {
      const { invalidText } = this.state;

      if (invalidText) {
        this.setState({
          invalidText: false,
        });
      }
    }
    this.setState({
      textFieldValue: newText,
    });
  };

  render(): JSX.Element {
    const { textFieldValue, invalidText } = this.state;

    return (
      <div className="new-todo">
        <ErrorLabel
          className="new-todo__error-label"
          invalid={invalidText}
        >
          <Card>
            Text is required
          </Card>
        </ErrorLabel>
        <form
          className="new-todo__form"
          id="main-form"
          onSubmit={this.onFormSubmit}
        >
          <TextField
            className="new-todo__input"
            type="text"
            id="todo-text"
            placeholder="NEW TODO TEXT"
            value={textFieldValue}
            onChange={this.onTextChange}
          />
          <Button
            id="add-todo"
            className="new-todo__btn-add"
            onClick={this.onButtonClick}
          >
            ADD
          </Button>
        </form>
      </div>
    );
  }
}
export default NewToDo;
