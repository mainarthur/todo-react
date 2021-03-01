import * as React from "react";
import Card from "./common/Card"
import "./App.scss"
import NewToDo from "./todo/NewToDo";

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
                <NewToDo />
            </Card> 
            <Card id="todos-card">
                
            </Card>
        </div>)
    }

}
export default App