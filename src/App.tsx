import * as React from "react";
import Button from "./common/Button";
import Card from "./common/Card"
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
        return (<div>
            <h1 className="title">TO-DO LIST</h1>
            <Card>
                <div className="new-task">
                    <form className="new-task__form" id="main-form">
                        <div is="text-field" className="new-task__input" /* type="text" */ id="todo-text" placeholder="NEW TASK">
                        </div>
                        <Button id="add-todo" className="new-task__btn-add">ADD</Button>
                    </form>
                </div>
            </Card>
            <Card id="todos-card">
                <div className="todos">
                    <div className="todos_center">
                        <Button className="todos__btn todos__btn-clear">CLEAR ALL</Button>
                        <Button className="todos__btn todos__btn-logout">LOGOUT</Button>
                    </div>
                </div>
            </Card>
        </div>)
    }

}
export default App