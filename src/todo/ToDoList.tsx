import * as React from 'react'
import { connect } from 'react-redux'
import { api } from '../api/api'
import UpdateToDoBody from '../api/bodies/UpdateToDoBody'
import DeleteResponse from '../api/responses/DeleteResponse'
import ToDoListResponse from '../api/responses/ToDoListResponse'
import UpdateToDoResponse from '../api/responses/UpdateToDoResponse'
import Button from '../common/Button'
import { connectDB, defaultStoreName } from '../indexeddb/connect'
import { err, log } from '../logging/logger'
import ToDo from '../models/ToDo'
import User from '../models/User'
import { setTodosAction } from '../redux/actions/toDoActions'
import { RootState } from '../redux/reducers'
import { history } from '../routing/RouterContext'
import ClassNames from './ClassNames'
import ToDoElement from './ToDoElement'
import './ToDoList.scss'

interface DispatchProps {
  setToDos: typeof setTodosAction
}

type OwnProps = {
  user: User
}

interface ToDoListState {
  todos: ToDo[]
}

type Props = OwnProps & DispatchProps & ToDoListState

class ToDoList extends React.Component<Props> {
  constructor(props: Props | Readonly<Props>) {
    super(props)

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

  onLogOutClick = () => {
    localStorage.clear()
    return history.push('/login')
  };

  onToDoDeleted = async (toDoId: string) => {
    const { todos, setToDos } = this.props
    const newTodos = todos.filter((t) => {
      const { _id: tId } = t

      return tId !== toDoId
    })

    try {
      await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      })
    } catch (e) {
      err(e)
    }

    setToDos(newTodos)
  };

  onToDoStatusChanged = async (toDoId: string, newStatus: boolean) => {
    const { todos, setToDos } = this.props
    const newTodos = todos.map((t) => {
      const { _id: tId } = t
      if (tId === toDoId) {
        const newTodo = { ...t }
        newTodo.done = newStatus
        return newTodo
      }

      return t
    })

    try {
      await api<UpdateToDoResponse, UpdateToDoBody>({
        endpoint: '/todo',
        method: 'PATCH',
        body: {
          _id: toDoId,
          done: newStatus,
        },
      })
    } catch (e) {
      err(e)
    }

    setToDos(newTodos)
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
    } = this.props
    return (
      <div className="todos">
        <div className="todos_center">
          <Button
            className="todos__btn todos__btn-clear"
          >
            CLEAR ALL
          </Button>
          <Button
            className="todos__btn todos__btn-logout"
            onClick={this.onLogOutClick}
          >
            LOGOUT
          </Button>
        </div>
        <ul className={ClassNames.TODOLIST_CLASSNAME}>
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
        </ul>
        <div className={ClassNames.BOTTOM_DROPABLE} />
      </div>
    )
  }
}

const mapStateToProps = (state: RootState): ToDoListState => ({ todos: state.todos })

const mapDispatchToProps: DispatchProps = {
  setToDos: setTodosAction,
}

export default connect<ToDoListState, DispatchProps, OwnProps>(mapStateToProps,
  mapDispatchToProps)(ToDoList)
