import * as React from "react"
import Button from "../common/Button"

type Props = {
	text: string
	done?: boolean
	id?: string
}

type State = {

}

class ToDo extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
		
	}

	render(): JSX.Element {
		const { done, text } = this.props 

		return <li className="todo">
			<input className="todo__checkbox" type="checkbox" checked={done}/>
			<span className="todo__text">{text}</span>
			<span className="todo_centered-horizontally"><Button className="todo__btn-delete">X</Button></span>
			<hr className="todo__divider" />
		</li>
	}
	
}
export default ToDo
