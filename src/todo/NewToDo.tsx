import * as React from "react";
import Button from "../common/Button";
import TextField from "../common/TextField";
import "./NewToDo.scss"

type Props = {

}

type State = {
	textFieldValue: string
}

class NewToDo extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
		this.state = {
			textFieldValue: ""
		}
	}

	render(): JSX.Element {
		return <div className="new-todo"><form className="new-task__form" id="main-form">
			<TextField className="new-task__input" type="text" id="todo-text" placeholder="NEW TASK" value={this.state.textFieldValue} onChange={(ev) => this.setState({
				textFieldValue: ev.target.value
			})}></TextField>
			<Button id="add-todo" className="new-task__btn-add" onClick={(ev) => this.onButtonClick(ev)}>ADD</Button>
		</form></div>
	}

	async onButtonClick(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		const { textFieldValue } = this.state

		const toDoText = textFieldValue

		this.setState({textFieldValue: ""})

		console.log(toDoText)
	}

}
export default NewToDo
