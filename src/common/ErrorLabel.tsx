import * as React from "react";
import "./ErrorLabel.scss"

type Props = {
	invalid?: boolean
}

type State = {

}

class ErrorLabel extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { invalid } = this.props
		return <label className={"error-label" + (invalid ? " error-label_visible" : "")}>{this.props.children}</label>
	}
	
}
export default ErrorLabel
