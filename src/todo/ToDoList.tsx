import * as React from 'react'
import { connect } from 'react-redux'

import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'

import { Typography } from '@material-ui/core'
import ErrorSnackBar from '../common/ErrorSnackBar'
import ReloadButton from '../common/ReloadButton'
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
import ToDoListControls from './ToDoListControls'

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
  noToDoText: {
    padding: theme.spacing(5),
    textAlign: 'center',
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

  onClearAllError = () => {
    const { clearAllError } = this.state

    if (!clearAllError) {
      this.setState({
        clearAllError: true,
      })
    }
  }

  onClearDoneError = () => {
    const { clearDoneError } = this.state

    if (!clearDoneError) {
      this.setState({
        clearDoneError: true,
      })
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

  onCloseSnackBar = () => {
    const {
      deleteError,
      positionChangeError,
      statusChangeError,
      clearAllError,
      clearDoneError,
    } = this.state

    if (deleteError) {
      this.setState({
        deleteError: false,
      })
    }

    if (positionChangeError) {
      this.setState({
        positionChangeError: false,
      })
    }

    if (statusChangeError) {
      this.setState({
        statusChangeError: false,
      })
    }

    if (clearAllError) {
      this.setState({
        clearAllError: false,
      })
    }

    if (clearDoneError) {
      this.setState({
        clearDoneError: false,
      })
    }
  }

  onToDoDeleted = async (toDoId: string) => {
    const { todos, setToDos } = this.props
    const { deleteError } = this.state

    const response = await api<DeleteResponse, {}>({
      endpoint: `/todo/${toDoId}`,
      method: 'DELETE',
    })

    if (response.status) {
      const newTodos = todos.filter((t) => {
        const { _id: tId } = t

        return tId !== toDoId
      })

      setToDos(newTodos)
    } else if (!deleteError) {
      this.setState({
        deleteError: true,
      })
    }
  };

  onToDoStatusChanged = async (toDoId: string, newStatus: boolean) => {
    const { todos, setToDos } = this.props
    const { statusChangeError } = this.state

    const response = await api<UpdateToDoResponse, UpdateToDoBody>({
      endpoint: '/todo',
      method: 'PATCH',
      body: {
        _id: toDoId,
        done: newStatus,
      },
    })

    if (response.status) {
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
    } else if (!statusChangeError) {
      this.setState({
        statusChangeError: true,
      })
    }
  }

  onToDoPositionChanged = async (id: string, nextId: string, prevId: string) => {
    const { todos, setToDos } = this.props
    const { positionChangeError } = this.state

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

      const response = await api<UpdateToDoResponse, UpdateToDoBody>({
        endpoint: '/todo',
        method: 'PATCH',
        body: {
          _id: id,
          position: newPosition,
        },
      })

      if (response.status) {
        const newTodos = todos.map((t) => {
          const { _id: tId } = t
          if (tId === id) {
            const newTodo = { ...t }
            newTodo.position = newPosition
            return newTodo
          }

          return t
        })

        setToDos(newTodos)
      } else if (!positionChangeError) {
        this.setState({
          positionChangeError: true,
        })
      }
    }
  }

  loadTodos = async (user: User) => {
    if (user) {
      const { _id: userId } = user
      const db = await connectDB(`todo-${userId}`)
      const { loadError } = this.state

      try {
        const response = await api<ToDoListResponse, {}>({
          endpoint: `/todo${localStorage.getItem('lastUpdate') ? `?from=${localStorage.getItem('lastUpdate')}` : ''}`,
        })

        log(response)

        if (response.status) {
          const todosResponse = response as ToDoListResponse
          const { results: todos } = todosResponse
          let maxLastUpdate = 0
          const currentLastUpdate: number = parseInt(localStorage.getItem('lastUpdate'), 10)

          if (!Number.isNaN(currentLastUpdate)) {
            maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
          }

          todos.forEach((toDo: ToDo) => {
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
        } else if (!loadError) {
          this.setState({
            loadError: true,
          })
        }
      } catch (e) {
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
  }

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

    const todosElements = todos.map((toDo) => {
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
    })

    return (
      <Grid item className={classes.root}>
        <ToDoListControls
          onClearAllError={this.onClearAllError}
          onClearDoneError={this.onClearDoneError}
        />
        <Paper className={classes.paper}>
          {todosElements.length > 0 ? <List className={classes.list}>{todosElements}</List> : (
            <Typography variant="body1" className={classes.noToDoText}>
              Tasks you add appear here
            </Typography>
          )}
        </Paper>
        <div className="ClassNames.BOTTOM_DROPABLE" />
        <ErrorSnackBar
          open={loadError}
          action={(
            <ReloadButton onReloadTodosClick={this.onReloadTodosClick} />
          )}
        >
          To-Do List loading error
        </ErrorSnackBar>
        <ErrorSnackBar open={deleteError} autoHide onClose={this.onCloseSnackBar}>
          Failed to delete To-Do
        </ErrorSnackBar>
        <ErrorSnackBar open={statusChangeError} autoHide onClose={this.onCloseSnackBar}>
          Failed to change To-Do&apos;s status
        </ErrorSnackBar>
        <ErrorSnackBar open={positionChangeError} autoHide onClose={this.onCloseSnackBar}>
          Failed to change To-Do&apos;s position
        </ErrorSnackBar>
        <ErrorSnackBar open={clearAllError} autoHide onClose={this.onCloseSnackBar}>
          Failed to delete all tasks
        </ErrorSnackBar>
        <ErrorSnackBar open={clearDoneError} autoHide onClose={this.onCloseSnackBar}>
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
