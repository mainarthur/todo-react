import * as React from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import TextField from "../common/TextField";
import { history } from "../routing/RouterContext";
import "./Login.scss"

type LoginProps = {

}

type LoginState = {
	email: string
	password: string
}

class Login extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps | Readonly<LoginProps>) {
		super(props)
        if(localStorage.getItem("access_token")) {
            history.push("/")
        }

		this.state = {
			email: "",
			password: ""
		}
	}

	render(): JSX.Element {
		return <Card>
			<TextField className="login__email" id="email" placeholder="Email" onChange={(ev) => this.setState({email: ev.target.value})}/>
			<TextField className="login__password" id="password" placeholder="Password" onChange={(ev) => this.setState({password: ev.target.value})}/>
			<Button className="login__button" onClick={() => {
				localStorage.setItem("access_token", "123")
				history.push("/")
			}}>Login</Button>
		</Card>
	}

}
export default Login
