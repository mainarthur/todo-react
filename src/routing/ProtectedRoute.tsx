import * as React from "react"
import Redirect from "./Redirect"

interface ProtectedRouteProps {
	condition: boolean
	redirectPath: string
	component: typeof React.Component
	path: string
}

class ProtectedRoute extends React.Component<ProtectedRouteProps> {
	constructor(props: ProtectedRouteProps | Readonly<ProtectedRouteProps>) {
		super(props)
	}

	render(): JSX.Element {
		const { condition, redirectPath, component: Component, path } = this.props

		console.log(Component)

		if (location.pathname === path) {
			return condition ? (<Component />) : <Redirect to={redirectPath} />
		} else {
			return <></>
		}
	}

}
export default ProtectedRoute
