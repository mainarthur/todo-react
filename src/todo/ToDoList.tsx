import * as React from 'react';
import { api } from '../api/api';
import ToDoListResponse from '../api/responses/ToDoListResponse';
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
    Console.log(prevProps);
    if (prevProps.user) {
      const { user, user: { _id: currentUserId } } = this.props;
      const { user: { _id: prevUserId } } = prevProps;

      if (currentUserId !== prevUserId) {
        await this.loadTodos(user);
      }
    }
  }

  onToDoDeleted(toDoId: string) {
    const { todos } = this.state;
    const newTodos = todos.filter((t) => {
      const { _id: tId } = t;

      return tId !== toDoId;
    });

    this.setState({
      todos: newTodos,
    });
  }

  onToDoStatusChanged(toDoId: string, newStatus: boolean) {
    const { todos } = this.state;
    const newTodos = [...todos];
    const todoIndex = newTodos.findIndex((t) => {
      const { _id: tId } = t;

      return tId === toDoId;
    });
    newTodos[todoIndex].done = newStatus;

    this.setState({ todos: newTodos });
  }

  async loadTodos(user: User) {
    const { _id: userId } = user;

    if (user) {
      const db = await connectDB(`todo-${userId}`);

      try {
        const todos = await api<ToDoListResponse, {}>({
          endpoint: `/todo${localStorage.getItem('lastUpdate') ? `?from=${localStorage.getItem('lastUpdate')}` : ''}`,
        });

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

        const transaction = db.transaction(defaultStoreName, 'readwrite');
        const store = transaction.objectStore(defaultStoreName);
        const todosRequest = store.getAll();
        todosRequest.addEventListener('success', () => {
          this.setState({
            todos: todosRequest.result,
          });
        });
      } catch (err) {
        Console.log(err);
      }
    }
  }

  render(): JSX.Element {
    const { todos } = this.state;

    return (
      <div className="todos">
        <div className="todos_center">
          <Button className="todos__btn todos__btn-clear">CLEAR ALL</Button>
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
      </div>
    );
  }
}
export default ToDoList;
