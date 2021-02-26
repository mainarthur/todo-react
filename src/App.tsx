import * as React from "react";
import "./App.scss"

type AppProps = {

}

type AppState = {

}

class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps | Readonly<AppProps>) {
		super(props)
	}

	render(): JSX.Element {
		return (<div><h1 className="title">TO-DO LIST</h1>
        <div className="card">
            <div className="new-task">
                <form className="new-task__form" id="main-form">
                    <div is="text-field" className="new-task__input" /* type="text" */ id="todo-text" placeholder="NEW TASK">
                    </div>
                    <div id="add-todo" className="btn new-task__btn-add">ADD</div>
                </form>
            </div>
        </div>
        <div className="card" id="todos-card">
            <div className="todos">
                <div className="todos_center">
                    <div className="btn todos__btn todos__btn-clear">
                        CLEAR ALL
                    </div>
                    <div className="btn todos__btn todos__btn-logout">
                        LOGOUT
                    </div>
                </div>
            </div>
        </div></div>)
	}
	
}
export default App