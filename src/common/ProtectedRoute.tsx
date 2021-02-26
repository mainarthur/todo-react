import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface ProtectedRouteProps extends RouteProps {
	condition: boolean
	redirectPath: string
}

class ProtectedRoute extends Route<ProtectedRouteProps> {
	constructor(props: ProtectedRouteProps | Readonly<ProtectedRouteProps>) {
		super(props)
	}

	render() {
		return this.props.condition ? <Route {...this.props} /> : <Redirect to={this.props.redirectPath}/>
	}
	
}
export default ProtectedRoute
