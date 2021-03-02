import * as React from "react"
import "./styles.scss"

type Props = {

}

type State = {

}

class NotFound extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		return <h1 className="title">404 - Page not Found</h1>
	}
	
}
export default NotFound
