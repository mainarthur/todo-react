import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom"
import App from "./App";
import Login from "./login/Login";
import Register from "./register/Register";

ReactDOM.render(
	<BrowserRouter>
	<Switch>
		<Route exact path="/" component={App}/>
		<Route exact path="/login" component={Login}/>
		<Route exact path="/register" component={Register}/>
	</Switch>
	</BrowserRouter>,
	document.getElementById("root")
);