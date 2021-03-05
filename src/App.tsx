import * as React from 'react';
import { connect } from 'react-redux';
import Card from './common/Card';
import './App.scss';
import NewToDo from './todo/NewToDo';
import ToDoList from './todo/ToDoList';
import { history } from './routing/RouterContext';
import UserResponse from './api/responses/UserResponse';
import { api, refreshTokens } from './api/api';
import User from './models/User';
import Console from './logging/Console';
import ToDo from './models/ToDo';
import { connectDB, defaultStoreName } from './indexeddb/connect';
import ToDoListResponse from './api/responses/ToDoListResponse';
import UpdateToDoResponse from './api/responses/UpdateToDoResponse';
import UpdateToDoBody from './api/bodies/UpdateToDoBody';
import DeleteResponse from './api/responses/DeleteResponse';
import { AppState } from './redux/reducers/appReducer';
import { addToDoAction, setTodosAction, setUserAction } from './redux/actions/appActions';
import { RootState } from './redux/reducers';

interface DispatchProps {
  setUser: typeof setUserAction;
  addToDo: typeof addToDoAction;
  setToDos: typeof setTodosAction;
}

type Props = DispatchProps & AppState;

class App extends React.Component<Props> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    if (localStorage.getItem('access_token') == null) {
      history.push('/login');
    }
  }

  async componentDidMount() {
    try {
      await refreshTokens();

      const { user: userFromState, setUser } = this.props;

      if (!userFromState) {
        const user = await api<UserResponse, {}>({
          endpoint: '/user',
        });

        if (user.status) {
          setUser((user as UserResponse).result);
          await this.loadTodos((user as UserResponse).result);
        } else if (userFromState) {
          setUser(null);
        }
      }
    } catch (err) {
      Console.err(err);
    }
  }

  componentWillUnmount() {
    const { setUser } = this.props;

    setUser(null);
  }

  onToDoDeleted = async (toDoId: string) => {
    const { todos, setToDos } = this.props;
    const newTodos = todos.filter((t) => {
      const { _id: tId } = t;

      return tId !== toDoId;
    });

    try {
      await api<DeleteResponse, {}>({
        endpoint: `/todo/${toDoId}`,
        method: 'DELETE',
      });
    } catch (err) {
      Console.err(err);
    }

    setToDos(newTodos);
  };

  onToDoStatusChanged = async (toDoId: string, newStatus: boolean) => {
    const { todos, setToDos } = this.props;
    const newTodos = todos.map((t) => {
      const { _id: tId } = t;
      if (tId === toDoId) {
        const newTodo = { ...t };
        newTodo.done = newStatus;
        return newTodo;
      }

      return t;
    });

    try {
      await api<UpdateToDoResponse, UpdateToDoBody>({
        endpoint: '/todo',
        method: 'PATCH',
        body: {
          _id: toDoId,
          done: newStatus,
        },
      });
    } catch (err) {
      Console.err(err);
    }

    setToDos(newTodos);
  };

  onToDoPositionChanged = async (id: string, nextId: string, prevId: string) => {
    const { todos, setToDos } = this.props;

    const prevTodo = todos.find((t) => {
      const { _id: tId } = t;

      return tId === prevId;
    });

    const nextTodo = todos.find((t) => {
      const { _id: tId } = t;

      return tId === nextId;
    });

    if (prevTodo || nextTodo) {
      let newPosition = 0;
      if (!prevTodo) {
        newPosition = nextTodo.position / 2;
      } else if (!nextTodo) {
        newPosition = prevTodo.position + 1;
      } else {
        newPosition = (prevTodo.position + nextTodo.position) / 2;
      }

      const newTodos = todos.map((t) => {
        const { _id: tId } = t;
        if (tId === id) {
          const newTodo = { ...t };
          newTodo.position = newPosition;
          return newTodo;
        }

        return t;
      });

      try {
        await api<UpdateToDoResponse, UpdateToDoBody>({
          endpoint: '/todo',
          method: 'PATCH',
          body: {
            _id: id,
            position: newPosition,
          },
        });
      } catch (err) {
        Console.err(err);
      }

      setToDos(newTodos);
    }
  };

  onNewToDo = (toDo: ToDo) => {
    const { addToDo } = this.props;

    addToDo(toDo);
  };

  loadTodos = async (user: User) => {
    if (user) {
      const { _id: userId } = user;
      const db = await connectDB(`todo-${userId}`);
      try {
        const todos = await api<ToDoListResponse, {}>({
          endpoint: `/todo${localStorage.getItem('lastUpdate') ? `?from=${localStorage.getItem('lastUpdate')}` : ''}`,
        });

        Console.log(todos);

        if (todos.status) {
          let maxLastUpdate = 0;
          const currentLastUpdate: number = parseInt(localStorage.getItem('lastUpdate'), 10);

          if (!Number.isNaN(currentLastUpdate)) {
            maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate);
          }

          (todos as ToDoListResponse).results.forEach((toDo: ToDo) => {
            const { _id: toDoId } = toDo;

            if (toDo.lastUpdate) {
              maxLastUpdate = Math.max(maxLastUpdate, toDo.lastUpdate);
            }

            const transaction = db.transaction(defaultStoreName, 'readwrite');
            const store = transaction.objectStore(defaultStoreName);
            if (!toDo.deleted) {
              store.put(toDo);
            } else {
              store.delete(toDoId);
            }
          });

          localStorage.setItem('lastUpdate', `${maxLastUpdate}`);
        }
      } catch (err) {
        Console.log(err);
      } finally {
        const transaction = db.transaction(defaultStoreName, 'readwrite');
        const store = transaction.objectStore(defaultStoreName).index('position');
        const todosRequest = store.getAll();
        todosRequest.addEventListener('success', () => {
          const { setToDos } = this.props;

          setToDos(todosRequest.result);
        });
      }
    }
  };

  render(): JSX.Element {
    const { todos } = this.props;
    return (
      <>
        <Card>
          <NewToDo onNewToDo={this.onNewToDo} />
        </Card>
        <Card id="todos-card">
          <ToDoList
            todos={todos}
            onToDoDeleted={this.onToDoDeleted}
            onToDoStatusChanged={this.onToDoStatusChanged}
            onToDoPositionChange={this.onToDoPositionChanged}
          />
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state: RootState): AppState => ({ ...state.app });

const mapDispatchToProps: DispatchProps = {
  setUser: setUserAction,
  addToDo: addToDoAction,
  setToDos: setTodosAction,
};

export default connect<AppState, DispatchProps>(mapStateToProps,
  mapDispatchToProps)(App);
