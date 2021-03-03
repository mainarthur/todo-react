import * as React from 'react';
import { api } from '../api/api';
import UpdateToDoBody from '../api/bodies/UpdateToDoBody';
import DeleteResponse from '../api/responses/DeleteResponse';
import ToDoListResponse from '../api/responses/ToDoListResponse';
import UpdateToDoResponse from '../api/responses/UpdateResponseResponse';
import Button from '../common/Button';
import { connectDB, defaultStoreName } from '../indexeddb/connect';
import Console from '../logging/Console';
import ToDo from '../models/ToDo';
import User from '../models/User';
import { history } from '../routing/RouterContext';
import ToDoElement from './ToDoElement';
import './ToDoList.scss';

type ToDoListProps = {
  user: User;
};

type ToDoListState = {
  todos: ToDo[];
};

class ToDoList extends React.Component<ToDoListProps, ToDoListState> {
  constructor(props: ToDoListProps | Readonly<ToDoListProps>) {
    super(props);

    this.state = {
      todos: [],
    };

    const { user } = props;

    if (user) {
      this.loadTodos(user);
    }
  }

  async componentDidMount() {
    await api({
      endpoint: '/user',
    });
  }

  async componentDidUpdate(prevProps: ToDoListProps) {
    const { user, user: { _id: currentUserId } } = this.props;
    let { user: prevUser } = prevProps;

    if (!prevUser) {
      prevUser = {
        _id: '',
        name: '',
        email: '',
      };
    }

    const { _id: prevUserId } = prevUser;

    if (currentUserId !== prevUserId) {
      await this.loadTodos(user);
    }
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
      <div className="todos">
        <div className="todos_center">
          <Button
            className="todos__btn todos__btn-clear"
          >
            CLEAR ALL
          </Button>
          <Button
            className="todos__btn todos__btn-logout"
            onClick={() => {
              localStorage.clear();
              return history.push('/login');
            }}
          >
            LOGOUT
          </Button>
        </div>
        <ul className="todo-list">
          {todos.map((toDo) => {
            const { _id: tId } = toDo;

            return (
              <ToDoElement
                key={tId}
                id={tId}
                text={toDo.text}
                done={toDo.done}
                onDelete={(toDoId: string) => this.onToDoDeleted(toDoId)}
                onStatusChange={(id, newStatus) => this.onToDoStatusChanged(id, newStatus)}
              />
            );
          })}
        </ul>
        <div className="buttom-dnd" />
      </div>
    );
  }
}
export default ToDoList;
