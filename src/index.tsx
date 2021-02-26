import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import App from "./App";
import ProtectedRoute from "./common/ProtectedRoute";
import Login from "./login/Login";
import Register from "./register/Register";

ReactDOM.render(
	<BrowserRouter>
	<Switch>
		<ProtectedRoute exact path="/" redirectPath="/login" condition={localStorage.getItem("access_token") != null} component={App}/>
		<ProtectedRoute exact path="/login" redirectPath="/" condition={localStorage.getItem("access_token") == null} component={Login}/>
		<ProtectedRoute exact path="/register" redirectPath="/" condition={localStorage.getItem("access_token") == null} component={Register}/>
	</Switch>
	</BrowserRouter>,
	document.getElementById("root")
);