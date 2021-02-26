import * as React from "react";

type LoginProps = {

}

type LoginState = {

}

class Login extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps | Readonly<LoginProps>) {
		super(props)
	}

	render(): JSX.Element {
		return <div>Login</div>
	}
	
}
export default Login
