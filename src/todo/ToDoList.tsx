import * as React from 'react';
import Button from '../common/Button';
import ToDo from '../models/ToDo';
import { history } from '../routing/RouterContext';
import ToDoElement from './ToDoElement';
import './ToDoList.scss';

type ToDoListProps = {
  todos: ToDo[];
  onToDoDeleted(toDoId: string): void;
  onToDoStatusChanged(toDoId: string, newStatus: boolean): void;
};

type ToDoListState = {
};

class ToDoList extends React.Component<ToDoListProps, ToDoListState> {
  render(): JSX.Element {
    const { todos, onToDoDeleted, onToDoStatusChanged } = this.props;

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
                onDelete={(toDoId: string) => onToDoDeleted(toDoId)}
                onStatusChange={(id, newStatus) => onToDoStatusChanged(id, newStatus)}
              />
            );
          })}
        </ul>
        <div className="todos__bottom-dnd" />
      </div>
    );
  }
}
export default ToDoList;
