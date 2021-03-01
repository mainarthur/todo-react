import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import ProtectedRoute from "./routing/ProtectedRoute";
import Login from "./login/Login";
import Register from "./register/Register";
import Router from "./routing/Router";

ReactDOM.render(
	<Router>
		<ProtectedRoute path="/" redirectPath="/login" condition={localStorage.getItem("access_token") != null} component={App}/>
		<ProtectedRoute path="/login" redirectPath="/" condition={localStorage.getItem("access_token") == null} component={Login}/>
		<ProtectedRoute path="/register" redirectPath="/" condition={localStorage.getItem("access_token") == null} component={Register}/>
	</Router>,
	document.getElementById("root")
);