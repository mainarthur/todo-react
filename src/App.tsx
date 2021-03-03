import * as React from 'react';
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
import UpdateToDoResponse from './api/responses/UpdateResponseResponse';
import UpdateToDoBody from './api/bodies/UpdateToDoBody';
import DeleteResponse from './api/responses/DeleteResponse';

type AppState = {
  user: User;
  todos: ToDo[];
};

class App extends React.Component<{}, AppState> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    if (localStorage.getItem('access_token') == null) {
      history.push('/login');
    }

    this.state = {
      user: null,
      todos: [],
    };
  }

  async componentDidMount() {
    try {
      await refreshTokens();

      const { user: userFromState } = this.state;

      if (!userFromState) {
        const user = await api<UserResponse, {}>({
          endpoint: '/user',
        });

        if (user.status) {
          this.setState({
            user: (user as UserResponse).result,
          });
          await this.loadTodos((user as UserResponse).result);
        } else if (userFromState) {
          this.setState({
            user: null,
          });
        }
      }
    } catch (err) {
      Console.err(err);
    }
  }

  componentWillUnmount() {
    this.setState({
      user: null,
    });
  }

  async onToDoDeleted(toDoId: string) {
    const { todos } = this.state;
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

    this.setState({
      todos: newTodos,
    });
  }

  async onToDoStatusChanged(toDoId: string, newStatus: boolean) {
    const { todos } = this.state;
    const newTodos = [...todos];
    const todoIndex = newTodos.findIndex((t) => {
      const { _id: tId } = t;

      return tId === toDoId;
    });
    newTodos[todoIndex].done = newStatus;

    try {
      await api<UpdateToDoResponse, UpdateToDoBody>({
        endpoint: '/todo',
        method: 'PATCH',
        body: {
          _id: toDoId,
          text: newTodos[todoIndex].text,
          done: newTodos[todoIndex].done,
          position: newTodos[todoIndex].position,
        },
      });
    } catch (err) {
      Console.err(err);
    }

    this.setState({ todos: newTodos });
  }

  onNewToDo(toDo: ToDo) {
    const { todos } = this.state;
    const newTodos = [...todos];

    newTodos.push(toDo);

    this.setState({ todos: newTodos });
  }

  async loadTodos(user: User) {
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
        const store = transaction.objectStore(defaultStoreName);
        const todosRequest = store.getAll();
        todosRequest.addEventListener('success', () => {
          this.setState({
            todos: todosRequest.result,
          });
        });
      }
    }
  }

  render(): JSX.Element {
    const { todos } = this.state;

    return (
      <>
        <Card>
          <NewToDo onNewToDo={(toDo: ToDo) => this.onNewToDo(toDo)} />
        </Card>
        <Card id="todos-card">
          <ToDoList
            {...{ todos }}
            onToDoDeleted={(toDoId: string) => this.onToDoDeleted(toDoId)}
            onToDoStatusChanged={(toDoId: string, newStatus: boolean) => {
              this.onToDoStatusChanged(toDoId, newStatus);
            }}
          />
        </Card>
      </>
    );
  }
}
export default App;
