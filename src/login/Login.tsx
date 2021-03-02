import * as React from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import ErrorLabel from "../common/ErrorLabel";
import TextField from "../common/TextField";
import { history } from "../routing/RouterContext";
import { isValidEmail, isValidPassword } from "../utils";
import "./Login.scss"

type LoginProps = {

}

type LoginState = {
	email: string
	password: string
	invalidEmail: boolean
	invalidPassword: boolean
	serverError: false
}

class Login extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps | Readonly<LoginProps>) {
		super(props)
        if(localStorage.getItem("access_token")) {
            history.push("/")
        }

		this.state = {
			email: "",
			password: "",
			invalidEmail: false,
			invalidPassword: false,
			serverError: false,
		}

		this.onLoginButtonClick = this.onLoginButtonClick.bind(this)
		this.onEmailChange = this.onEmailChange.bind(this)
		this.onPasswordChange = this.onPasswordChange.bind(this)
	}

	onLoginButtonClick(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		let { email, password, invalidEmail, invalidPassword } = this.state

		email = email.trim()
		password = password.trim()

		if(!isValidEmail(email)) {
			this.setState({
				invalidEmail:true
			})
		} else if(invalidEmail) {
			this.setState({
				invalidEmail: false
			})
		}

		if(!isValidPassword(password)) {
			this.setState({
				invalidPassword:true
			})
		} else if(invalidEmail) {
			this.setState({
				invalidPassword: false
			})
		}
	}

	onEmailChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.setState({email: ev.target.value})
	}

	onPasswordChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.setState({password: ev.target.value})
	}

	render(): JSX.Element {
		return <Card>
			<TextField className="login__email" id="email" placeholder="Email" invalid={this.state.invalidEmail} errorText="Ivalid email format" onChange={this.onEmailChange}/>
			<TextField className="login__password" id="password" placeholder="Password" invalid={this.state.invalidPassword} errorText="Password is too weak" onChange={this.onPasswordChange}/>
			<Button className="login__button" onClick={this.onLoginButtonClick}>Login</Button>
			<ErrorLabel invalid={this.state.serverError}>Login Problem: invalid email or password</ErrorLabel>
		</Card>
	}

}
export default Login
