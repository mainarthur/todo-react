import * as React from "react";
import { history, RouterContext, locationToRoute } from "./RouterContext"
import Route from "./Route";
import Link from "./Link";
import { Location, Update } from "history";

type Props = {
	routes: {
		[key: string]: {
			path: string
		}
	},
	NotFound: typeof React.Component
}

type State = {
	route: {
		path: string
		hash: string
		query: object
	}
}

class Router extends React.Component<Props, State> {
	routes: string[];
	unlisten: () => void;
	constructor(props: Props | Readonly<Props>) {
		super(props);
		// Convert our routes into an array for easy 404 checking
		this.routes = Object.keys(props.routes).map((key) => props.routes[key].path);
		// Listen for path changes from the history API
		this.unlisten = history.listen(this.handleRouteChange);
		// Define the initial RouterContext value
		this.state = {
			route: locationToRoute(history.location),
		};
	}
	componentWillUnmount() {
		this.unlisten();
	}

	handleRouteChange = (update: Update<object>) => {
		const route = locationToRoute(update.location);
		this.setState({ route: route });
	}
	render() {
		const { children, NotFound } = this.props;
		const { route } = this.state;
		const routerContextValue = { route };
		const is404 = this.routes.indexOf(route.path) === -1;
		return (
			<RouterContext.Provider value={routerContextValue}>
				{is404 ? <NotFound /> : children}
			</RouterContext.Provider>
		);
	}
}


export default Router
