import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import ProtectedRoute from "./routing/ProtectedRoute";
import Login from "./login/Login";
import Register from "./register/Register";
import Router from "./routing/Router";
import Route from "./routing/Route";
import { routes } from "./routing/config";
import NotFound from "./common/NotFound";
import Redirect from "./routing/Redirect";

ReactDOM.render(
	<Router routes={routes} NotFound={NotFound}>
		<Route path={routes.login.path}>
			{localStorage.getItem("access_token") != null ? <Redirect to="/" /> : <Login />}
		</Route>
		<Route path={routes.home.path}>
			{localStorage.getItem("access_token") == null ? <Redirect to="/login" /> : <App />}
		</Route>
		<Route path={routes.register.path}>
			{localStorage.getItem("access_token") != null ? <Redirect to="/" /> : <Register />}
		</Route>

	</Router>,
	document.querySelector(".root")
);