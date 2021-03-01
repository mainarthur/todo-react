import * as React from "react";
import Card from "./common/Card"
import "./App.scss"
import NewToDo from "./todo/NewToDo";
import ToDoList from "./todo/ToDoList";
import { history } from "./routing/RouterContext";

type AppProps = {

}

type AppState = {

}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps | Readonly<AppProps>) {
        super(props)
        if(!localStorage.getItem("access_token")) {
            history.push("/login")
        }
    }

    render(): JSX.Element {
        return <>
            <Card>
                <NewToDo />
            </Card>
            <Card id="todos-card">
                <ToDoList />
            </Card>
        </>
    }

}
export default App