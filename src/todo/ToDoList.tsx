import * as React from "react"
import { api } from "../api/api"
import { ToDoListResponse } from "../api/responses/ToDoListResponse"
import Button from "../common/Button"
import { connectDB, defaultStoreName } from "../indexeddb/connect"
import { ToDo } from "../models/ToDo"
import { User } from "../models/User"
import { history } from "../routing/RouterContext"
import ToDoElement from "./ToDoElement"
import "./ToDoList.scss"

type ToDoListProps = {
	user: User
}

type ToDoListState = {
	todos: ToDo[]
}

class ToDoList extends React.Component<ToDoListProps, ToDoListState> {
	constructor(props: ToDoListProps | Readonly<ToDoListProps>) {
		super(props)

		this.state = {
			todos: []
		}

		this.loadTodos(props.user)
	}

	async componentDidUpdate(prevProps: ToDoListProps) {
		if (this.props.user?._id != prevProps.user?._id) {
			await this.loadTodos(this.props.user)
		}
	}

	async loadTodos(user: User) {
		if (user) {
			const db = await connectDB(`todo-${user._id}`)

			try {
				const todos = await api<ToDoListResponse, {}>({
					endpoint: `/todo${localStorage.getItem("lastUpdate") ? `?from=${localStorage.getItem("lastUpdate")}` : ""}`
				})

				console.log(todos)



				if (todos.status) {
					let maxLastUpdate = 0
					let currentLastUpdate: number = parseInt(localStorage.getItem("lastUpdate"))

					if (!isNaN(currentLastUpdate)) {
						maxLastUpdate = Math.max(currentLastUpdate, maxLastUpdate)
					}

					(todos as ToDoListResponse).results.forEach((toDo: ToDo) => {
						if (toDo.lastUpdate) {
							maxLastUpdate = Math.max(maxLastUpdate, toDo.lastUpdate)
						}

						const transaction = db.transaction(defaultStoreName, "readwrite")
						const store = transaction.objectStore(defaultStoreName)
						if (!toDo.deleted) {
							store.put(toDo)
						} else {
							store.delete(toDo._id)
						}
					})

					localStorage.setItem("lastUpdate", `${maxLastUpdate}`)
				}

				const transaction = db.transaction(defaultStoreName, "readwrite")
				const store = transaction.objectStore(defaultStoreName)
				const todosRequest = store.getAll()
				todosRequest.addEventListener("success", () => {
					this.setState({
						todos: todosRequest.result
					})
				})
			} catch (err) {
				console.log(err)
			}
		}
	}

	onToDoDeleted(toDoId: string) {
		this.setState({
			todos: this.state.todos.filter(toDo => toDo._id !== toDoId)
		})
	}


	onToDoStatusChanged(toDoId: string, newStatus: boolean) {
		const { todos } = this.state
		const newTodos = [...todos]
		const todoIndex = newTodos.findIndex((t) => t._id === toDoId)
		newTodos[todoIndex].done = newStatus

		this.setState({ todos: newTodos })
	}


	render(): JSX.Element {
		return <div className="todos">
			<div className="todos_center">
				<Button className="todos__btn todos__btn-clear">CLEAR ALL</Button>
				<Button className="todos__btn todos__btn-logout" onClick={() => {
					localStorage.clear()
					return history.push("/login")
				}}>LOGOUT</Button>
			</div>
			<ul className="todo-list">
				{this.state.todos.map(toDo => <ToDoElement
					key={toDo._id}
					id={toDo._id} text={toDo.text}
					done={toDo.done} onDelete={(toDoId: string) => this.onToDoDeleted(toDoId)}
					onStatusChange={(id, newStatus) => this.onToDoStatusChanged(id, newStatus)} />)}
			</ul>
		</div>

	}

	async componentDidMount() {
		await api({
			endpoint: "/user"
		})
	}

}
export default ToDoList
