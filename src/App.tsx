import * as React from "react"
import Card from "./common/Card"
import "./App.scss"
import NewToDo from "./todo/NewToDo"
import ToDoList from "./todo/ToDoList"
import { history } from "./routing/RouterContext"
import { UserResponse } from "./api/responses/UserResponse"
import { api } from "./api/api"
import { User } from "./models/User"

type AppProps = {

}

type AppState = {
    user: User
}

class App extends React.Component<AppProps, AppState> {


    constructor(props: AppProps | Readonly<AppProps>) {
        super(props)
        if (localStorage.getItem("access_token") == null) {
            history.push("/login")
        }


    }

    render(): JSX.Element {
        const user = this.state?.user

        return <>
            <Card>
                <NewToDo />
            </Card>
            <Card id="todos-card">
                <ToDoList {...{ user }} />
            </Card>
        </>
    }

    async componentDidMount() {
        if(!this.state?.user) {
            const user = await api<UserResponse, {}>({
                endpoint: "/user"
            })
    
            if (user.status) {
                this.setState({
                    user: (user as UserResponse).result
                })
            } else if (this.state.user) {
                this.setState({
                    user: null
                })
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            user: null
        })
    }

}
export default App