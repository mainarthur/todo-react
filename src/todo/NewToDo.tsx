import * as React from 'react'
import { connect } from 'react-redux'
import { api } from '../api/api'
import NewToDoBody from '../api/bodies/NewToDoBody'
import NewToDoResponse from '../api/responses/NewToDoResponse'
import Button from '../common/Button'
import Card from '../common/Card'
import ErrorLabel from '../common/ErrorLabel'
import TextField from '../common/TextField'
import ToDo from '../models/ToDo'
import { changeNewToDoTextAction, toggleTextErrorAction } from '../redux/actions/newToDoActions'
import { addToDoAction } from '../redux/actions/toDoActions'
import { RootState } from '../redux/reducers'
import { NewToDoState } from '../redux/reducers/newToDoReducer'
import './NewToDo.scss'

interface DispatchProps {
  changeText: typeof changeNewToDoTextAction
  toggleTextError: typeof toggleTextErrorAction
  addToDo: typeof addToDoAction
}

type StateProps = {
  newTodoState: NewToDoState
  todos: ToDo[]
}

type Props = StateProps & DispatchProps

class NewToDo extends React.Component<Props> {
  timerId: number

  onFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    this.onButtonClick()
  };

  onButtonClick = async () => {
    const {
      newTodoState: {
        textFieldValue,
        invalidText,
      },
      toggleTextError,
      changeText,
      addToDo,
    } = this.props

    const toDoText = textFieldValue.trim()

    if (toDoText === '') {
      clearTimeout(this.timerId)

      this.timerId = window.setTimeout(() => {
        const {
          newTodoState: {
            invalidText: invalidTextAtUpdate,
          },
          toggleTextError: toggleTextErrorAtUpdate,
        } = this.props

        if (invalidTextAtUpdate) {
          toggleTextErrorAtUpdate()
        }
      }, 5000)

      return !invalidText && toggleTextError()
    }

    changeText('')
    if (invalidText) {
      toggleTextError()
    }

    const toDoResponse = await api<NewToDoResponse, NewToDoBody>({
      endpoint: '/todo',
      method: 'POST',
      body: {
        text: toDoText,
      },
    })

    if (toDoResponse.status) {
      addToDo((toDoResponse as NewToDoResponse).result)
    }

    return true
  };

  onTextChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newText = ev.target.value
    const { newTodoState: { invalidText }, toggleTextError, changeText } = this.props

    if (newText !== '') {
      if (invalidText) {
        toggleTextError()
      }
    }
    changeText(newText)
  };

  render(): JSX.Element {
    const { newTodoState: { textFieldValue, invalidText } } = this.props

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
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  newTodoState: state.newToDo,
  todos: state.todos,
})

const mapDispatchToProps: DispatchProps = {
  changeText: changeNewToDoTextAction,
  toggleTextError: toggleTextErrorAction,
  addToDo: addToDoAction,
}

export default connect<StateProps, DispatchProps>(mapStateToProps,
  mapDispatchToProps)(NewToDo)
