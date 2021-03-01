import * as React from "react";
import Button from "../common/Button";
import "./ToDoList.scss"

type ToDoListProps = {

}

type ToDoListState = {

}

class ToDoList extends React.Component<ToDoListProps, ToDoListState> {
	constructor(props: ToDoListProps | Readonly<ToDoListProps>) {
		super(props)
	}

	render(): JSX.Element {
		return <div className="todos">
			<div className="todos_center">
				<Button className="todos__btn todos__btn-clear">CLEAR ALL</Button>
				<Button className="todos__btn todos__btn-logout">LOGOUT</Button>
			</div>
			<ul className="todo-list">
				
			</ul>
		</div>
		
	}

}
export default ToDoList
