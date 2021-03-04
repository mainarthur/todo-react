import * as React from 'react';
import Button from '../common/Button';
import ToDo from '../models/ToDo';
import { history } from '../routing/RouterContext';
import ClassNames from './ClassNames';
import ToDoElement from './ToDoElement';
import './ToDoList.scss';

type ToDoListProps = {
  todos: ToDo[];
  onToDoDeleted(toDoId: string): void;
  onToDoStatusChanged(toDoId: string, newStatus: boolean): void;
  onToDoPositionChange(id: string, nextId: string, prevId: string): void;
};

type ToDoListState = {
};

class ToDoList extends React.Component<ToDoListProps, ToDoListState> {
  onLogOutClick = () => {
    localStorage.clear();
    return history.push('/login');
  };

  render(): JSX.Element {
    const {
      todos,
      onToDoDeleted,
      onToDoStatusChanged,
      onToDoPositionChange,
    } = this.props;

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
            const { _id: tId } = toDo;

            return (
              <ToDoElement
                key={tId}
                id={tId}
                text={toDo.text}
                done={toDo.done}
                onDelete={onToDoDeleted}
                onStatusChange={onToDoStatusChanged}
                onPositionChange={onToDoPositionChange}
              />
            );
          })}
        </ul>
        <div className={ClassNames.BOTTOM_DROPABLE} />
      </div>
    );
  }
}
export default ToDoList;
