import * as React from "react"
import Button from "../common/Button"
import { ToDo } from "../models/ToDo"

type Props = {
	toDo: ToDo
}

type State = {

}

class ToDoElement extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
		
	}

	render(): JSX.Element {
		const { toDo } = this.props 
		const { text, done } = toDo

		return <li className="todo">
			<input className="todo__checkbox" type="checkbox" checked={done}/>
			<span className="todo__text">{text}</span>
			<span className="todo_centered-horizontally"><Button className="todo__btn-delete">X</Button></span>
			<hr className="todo__divider" />
		</li>
	}
	
}
export default ToDoElement
