import * as React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Container from '@material-ui/core/Container'

import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'

import { setTodosAction } from '../redux/actions/toDoActions'
import { RootState } from '../redux/reducers'

import { api } from '../api/api'
import DeleteResponse from '../api/responses/DeleteResponse'

import ToDo from '../models/ToDo'

interface DispatchProps {
  setToDos: typeof setTodosAction
}

interface ToDoListState {
  todos: ToDo[]
}

interface OwnProps {
  onClearAllError(): void
  onClearDoneError(): void
}

const styles = () => createStyles({
  controls: {
    textAlign: 'center',
  },
  clearAllButton: {
    color: '#fff',
  },
  clearDoneButton: {
    backgroundColor: '#fff',
  },
})

type Props = WithStyles<typeof styles> & DispatchProps & OwnProps & ToDoListState

class ToDoListControls extends React.Component<Props> {
  onClearAllClick = async () => {
    const { setToDos, todos, onClearAllError } = this.props
    const faliedToDeleteIndexes: Array<number> = []

    for (let i = 0; i < todos.length; i += 1) {
      const toDo = todos[i]
      const { _id: toDoId } = toDo
      // eslint-disable-next-line no-await-in-loop
      const response = await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      })

      if (!response.status) {
        faliedToDeleteIndexes.push(i)
      }
    }

    setToDos(todos.filter((e, i) => faliedToDeleteIndexes.indexOf(i) !== -1))

    if (faliedToDeleteIndexes.length > 0) {
      onClearAllError()
    }
  };

  onClearDoneClick = async () => {
    const { setToDos, todos, onClearDoneError } = this.props
    const faliedToDeleteIndexes: Array<number> = []

    const doneTodos = todos.filter((toDo) => toDo.done)
    const undoneTodos = todos.filter((toDo) => !toDo.done)

    for (let i = 0; i < todos.length; i += 1) {
      const toDo = doneTodos[i]
      const { _id: toDoId } = toDo

      // eslint-disable-next-line no-await-in-loop
      const response = await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      })

      if (!response.status) {
        faliedToDeleteIndexes.push(i)
      }
    }

    const rest = doneTodos.filter((e, i) => faliedToDeleteIndexes.indexOf(i) !== -1)

    const newTodos = [...undoneTodos, ...rest]

    setToDos(newTodos)

    if (faliedToDeleteIndexes.length > 0) {
      onClearDoneError()
    }
  };

  render() {
    const { classes } = this.props
    return (
      <Container className={classes.controls}>
        <ButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            className={classes.clearAllButton}
            onClick={this.onClearAllClick}
          >
            Clear All
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.clearDoneButton}
            onClick={this.onClearDoneClick}
          >
            Clear Done
          </Button>
        </ButtonGroup>
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState): ToDoListState => ({ todos: state.todos })

const mapDispatchToProps: DispatchProps = {
  setToDos: setTodosAction,
}

export default connect<ToDoListState, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ToDoListControls))
