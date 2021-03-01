import * as React from "react";
import { RouterContext, history } from "./RouterContext"

type Props = {
	to: string
}


class Redirect extends React.Component<Props> {
	static contextType = RouterContext
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { to } = this.props
		const { route } = this.context

		if(route.path !== to) {
			history.push(to)
		}

		return <></>
	}
	
}
export default Redirect
