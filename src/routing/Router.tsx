import * as React from "react";


class Router extends React.Component {
	constructor(props: {} | Readonly<{}>) {
		super(props)
	}

	render(): JSX.Element {		
		return <>{this.props.children}</>
	}
	
}
export default Router
