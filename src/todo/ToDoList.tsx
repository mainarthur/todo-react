import * as React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'

import ReloadIcon from '@material-ui/icons/Cached'

import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'

import ErrorSnackBar from '../common/ErrorSnackBar'
import ToDoElement from './ToDoElement'

import { api } from '../api/api'
import UpdateToDoBody from '../api/bodies/UpdateToDoBody'
import DeleteResponse from '../api/responses/DeleteResponse'
import ToDoListResponse from '../api/responses/ToDoListResponse'
import UpdateToDoResponse from '../api/responses/UpdateToDoResponse'

import { connectDB, defaultStoreName } from '../indexeddb/connect'

import { setTodosAction } from '../redux/actions/toDoActions'
import { RootState } from '../redux/reducers'

import ToDo from '../models/ToDo'
import User from '../models/User'

import { err, log } from '../logging/logger'

const styles = (theme: Theme) => createStyles({
  paper: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  list: {
    width: '100%',
  },
  controls: {
    textAlign: 'center',
  },
  clearAllButton: {
    color: '#fff',
  },
  clearDoneButton: {
    backgroundColor: '#fff',
  },
  root: {
    minWidth: `calc(25vw + ${theme.spacing(4)}px)`,
  },
  reloadIcon: {
    fill: '#fff',
  },
})

interface DispatchProps {
  setToDos: typeof setTodosAction
}

type OwnProps = {
  user: User
}

interface ToDoListState {
  todos: ToDo[]
}

type Props = OwnProps & DispatchProps & ToDoListState & WithStyles<typeof styles>

interface State {
  deleteError: boolean
  positionChangeError: boolean
  statusChangeError: boolean
  loadError: boolean
  clearAllError: boolean
  clearDoneError: boolean
}

class ToDoList extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props)

    this.state = {
      deleteError: false,
      positionChangeError: false,
      statusChangeError: false,
      loadError: false,
      clearAllError: false,
      clearDoneError: false,
    }

    if (props.user) {
      this.loadTodos(props.user)
    }
  }

  async componentDidUpdate(prevProps: Props) {
    const { user, user: { _id: currentUserId } } = this.props
    let { user: prevUser } = prevProps

    if (!prevUser) {
      prevUser = {
        _id: '',
        name: '',
        email: '',
      }
    }

    const { _id: prevUserId } = prevUser

    if (currentUserId !== prevUserId) {
      await this.loadTodos(user)
    }
  }

  onReloadTodosClick = async () => {
    const { user } = this.props
    const { loadError } = this.state

    if (user) {
      try {
        await this.loadTodos(user)
      } catch (e) {
        if (!loadError) {
          this.setState({
            loadError: true,
          })
        }
        err(e)
      }
    }
  }

  onCloseDeleteErrorSnackBar = () => {
    const { deleteError } = this.state

    if (deleteError) {
      this.setState({
        deleteError: false,
      })
    }
  }

  onClosePositionChangeErrorSnackBar = () => {
    const { positionChangeError } = this.state

    if (positionChangeError) {
      this.setState({
        positionChangeError: false,
      })
    }
  }

  onCloseStatusChangeErrorSnackBar = () => {
    const { statusChangeError } = this.state

    if (statusChangeError) {
      this.setState({
        statusChangeError: false,
      })
    }
  }

  onCloseClearAllErrorSnackBar = () => {
    const { clearAllError } = this.state

    if (clearAllError) {
      this.setState({
        clearAllError: false,
      })
    }
  }

  onCloseClearDoneErrorSnackBar = () => {
    const { clearDoneError } = this.state

    if (clearDoneError) {
      this.setState({
        clearDoneError: false,
      })
    }
  }

  onClearAllClick = async () => {
    const { setToDos, todos } = this.props
    const faliedToDelete: Array<number> = []

    for (let i = 0; i < todos.length; i += 1) {
      const toDo = todos[i]
      const { _id: toDoId } = toDo
      try {
        // eslint-disable-next-line no-await-in-loop
        await api<DeleteResponse, {}>({
          endpoint: `/todo/${toDoId}`,
          method: 'DELETE',
        })
      } catch (e) {
        faliedToDelete.push(i)
        err(e)
      }
    }

    setToDos(todos.filter((e, i) => faliedToDelete.indexOf(i) !== -1))
  };

  onClearDoneClick = async () => {
    const { setToDos, todos } = this.props
    const faliedToDeleteIndexes: Array<number> = []

    const doneTodos = todos.filter((toDo) => toDo.done)
    const undoneTodos = todos.filter((toDo) => !toDo.done)

    for (let i = 0; i < todos.length; i += 1) {
      const toDo = doneTodos[i]
      const { _id: toDoId } = toDo
      try {
        // eslint-disable-next-line no-await-in-loop
        await api<DeleteResponse, {}>({
          endpoint: `/todo/${toDoId}`,
          method: 'DELETE',
        })
      } catch (e) {
        faliedToDeleteIndexes.push(i)
        err(e)
      }
    }

    const rest = doneTodos.filter((e, i) => faliedToDeleteIndexes.indexOf(i) !== -1)

    const newTodos = [...undoneTodos, ...rest]

    setToDos(newTodos)
  };

  onToDoDeleted = async (toDoId: string) => {
    const { todos, setToDos } = this.props
    try {
      await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      })

      const newTodos = todos.filter((t) => {
        const { _id: tId } = t

        return tId !== toDoId
      })

      setToDos(newTodos)
    } catch (e) {
      err(e)
    }
  };

  onToDoStatusChanged = async (toDoId: string, newStatus: boolean) => {
    const { todos, setToDos } = this.props
    try {
      await api<UpdateToDoResponse, UpdateToDoBody>({
        endpoint: '/todo',
        method: 'PATCH',
        body: {
          _id: toDoId,
          done: newStatus,
        },
      })

      const newTodos = todos.map((t) => {
        const { _id: tId } = t
        if (tId === toDoId) {
          const newTodo = { ...t }
          newTodo.done = newStatus
          return newTodo
        }

        return t
      })

      setToDos(newTodos)
    } catch (e) {
      err(e)
    }
  };

  onToDoPositionChanged = async (id: string, nextId: string, prevId: string) => {
    const { todos, setToDos } = this.props

    const prevTodo = todos.find((t) => {
      const { _id: tId } = t

      return tId === prevId
    })

    const nextTodo = todos.find((t) => {
      const { _id: tId } = t

      return tId === nextId
    })

    if (prevTodo || nextTodo) {
      let newPosition = 0
      if (!prevTodo) {
        newPosition = nextTodo.position / 2
      } else if (!nextTodo) {
        newPosition = prevTodo.position + 1
      } else {
        newPosition = (prevTodo.position + nextTodo.position) / 2
      }

      const newTodos = todos.map((t) => {
        const { _id: tId } = t
        if (tId === id) {
          const newTodo = { ...t }
          newTodo.position = newPosition
          return newTodo
        }

        return t
      })

      try {
        await api<UpdateToDoResponse, UpdateToDoBody>({
          endpoint: '/todo',
          method: 'PATCH',
          body: {
            _id: id,
            position: newPosition,
          },
        })
      } catch (e) {
        err(e)
      }

      setToDos(newTodos)
    }
  };

  loadTodos = async (user: User) => {
    if (user) {
      const { _id: userId } = user
      const db = await connectDB(`todo-${userId}`)
      try {
        const todos = await api<ToDoListResponse, {}>({
          endpoint: `/todo${localStorage.getItem('lastUpdate') ? `?from=${localStorage.getItem('lastUpdate')}` : ''}`,
        })

        log(todos)

        if (todos.status) {
          let maxLastUpdate = 0
          const currentLastUpdate: number = parseInt(localStorage.getItem('lastUpdate'), 10)

          if (!Number.isNaN(currentLastUpdate)) {
            maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
          }

          (todos as ToDoListResponse).results.forEach((toDo: ToDo) => {
            const { _id: toDoId } = toDo

            if (toDo.lastUpdate) {
              maxLastUpdate = Math.max(maxLastUpdate, toDo.lastUpdate)
            }

            const transaction = db.transaction(defaultStoreName, 'readwrite')
            const store = transaction.objectStore(defaultStoreName)
            if (!toDo.deleted) {
              store.put(toDo)
            } else {
              store.delete(toDoId)
            }
          })

          localStorage.setItem('lastUpdate', `${maxLastUpdate}`)
        }
      } catch (e) {
        const { loadError } = this.state

        if (!loadError) {
          this.setState({
            loadError: true,
          })
        }
        err(e)
      } finally {
        const transaction = db.transaction(defaultStoreName, 'readwrite')
        const store = transaction.objectStore(defaultStoreName).index('position')
        const todosRequest = store.getAll()
        todosRequest.addEventListener('success', () => {
          const { setToDos } = this.props

          setToDos(todosRequest.result)
        })
      }
    }
  };

  render(): JSX.Element {
    const {
      todos,
      classes,
    } = this.props
    const {
      loadError,
      deleteError,
      positionChangeError,
      statusChangeError,
      clearAllError,
      clearDoneError,
    } = this.state

    return (
      <Grid item className={classes.root}>
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
        <Paper className={classes.paper}>
          <List className={classes.list}>
            {todos.map((toDo) => {
              const { _id: tId } = toDo

              return (
                <ToDoElement
                  key={tId}
                  id={tId}
                  text={toDo.text}
                  done={toDo.done}
                  onDelete={this.onToDoDeleted}
                  onStatusChange={this.onToDoStatusChanged}
                  onPositionChange={this.onToDoPositionChanged}
                />
              )
            })}
          </List>
        </Paper>
        <div className="ClassNames.BOTTOM_DROPABLE" />
        <ErrorSnackBar
          open={loadError}
          action={(
            <IconButton onClick={this.onReloadTodosClick}>
              <ReloadIcon className={classes.reloadIcon} />
            </IconButton>
          )}
        >
          To-Do List loading error
        </ErrorSnackBar>
        <ErrorSnackBar
          open={deleteError}
          autoHide
          onClose={this.onCloseDeleteErrorSnackBar}
        >
          Failed to delete To-Do
        </ErrorSnackBar>
        <ErrorSnackBar
          open={statusChangeError}
          autoHide
          onClose={this.onCloseStatusChangeErrorSnackBar}
        >
          Failed to change To-Do&apos;s status
        </ErrorSnackBar>
        <ErrorSnackBar
          open={positionChangeError}
          autoHide
          onClose={this.onClosePositionChangeErrorSnackBar}
        >
          Failed to change To-Do&apos;s position
        </ErrorSnackBar>
        <ErrorSnackBar
          open={clearAllError}
          autoHide
          onClose={this.onCloseClearAllErrorSnackBar}
        >
          Failed to delete all tasks
        </ErrorSnackBar>
        <ErrorSnackBar
          open={clearDoneError}
          autoHide
          onClose={this.onCloseClearDoneErrorSnackBar}
        >
          Failed to delete all done tasks
        </ErrorSnackBar>
      </Grid>
    )// TODO add Snakbars for falied requests
  }
}

const mapStateToProps = (state: RootState): ToDoListState => ({ todos: state.todos })

const mapDispatchToProps: DispatchProps = {
  setToDos: setTodosAction,
}

export default connect<ToDoListState, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(ToDoList))
