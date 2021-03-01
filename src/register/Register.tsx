import * as React from "react";
import Card from "../common/Card";
import TextField from "../common/TextField";
import { history } from "../routing/RouterContext";

type RegisterProps = {

}

type RegisterState = {

}

class Register extends React.Component<RegisterProps, RegisterState> {
	constructor(props: RegisterProps | Readonly<RegisterProps>) {
		super(props)
        if(localStorage.getItem("access_token")) {
            history.push("/")
        }
	}

	render(): JSX.Element {
		return <Card>
			<TextField placeholder="" id="email"/>
		</Card>
	}
	
}
export default Register
