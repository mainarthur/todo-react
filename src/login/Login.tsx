import * as React from "react";
import Button from "../common/Button";
import Card from "../common/Card";
import TextField from "../common/TextField";

type LoginProps = {

}

type LoginState = {

}

class Login extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps | Readonly<LoginProps>) {
		super(props)
	}

	render(): JSX.Element {
		return <Card>
		<TextField id="login" placeholder="Email"/>
			<TextField id="password" placeholder="Password"/>
			<Button>Login</Button>
		</Card>
	}
	
}
export default Login
