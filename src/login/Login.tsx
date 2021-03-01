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

		this.onLoginButtonClick = this.onLoginButtonClick.bind(this)
		this.onEmailChange = this.onEmailChange.bind(this)
		this.onPasswordChange = this.onPasswordChange.bind(this)
	}

	onLoginButtonClick(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		const { email, password } = this.state
	}

	onEmailChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.setState({email: ev.target.value})
	}

	onPasswordChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.setState({password: ev.target.value})
	}

	render(): JSX.Element {
		return <Card>
			<TextField className="login__email" id="email" placeholder="Email" onChange={this.onEmailChange}/>
			<TextField className="login__password" id="password" placeholder="Password" onChange={this.onPasswordChange}/>
			<Button className="login__button" onClick={this.onLoginButtonClick}>Login</Button>
		</Card>
	}

}
export default Login
