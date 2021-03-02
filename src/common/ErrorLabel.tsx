import * as React from "react";
import "./ErrorLabel.scss"

type Props = {
	invalid?: boolean
	className? : string
}

type State = {

}

class ErrorLabel extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { invalid, className } = this.props
		return <label className={"error-label" + (invalid ? " error-label_visible" : "") + (className ? ` ${className}` : "")}>{this.props.children}</label>
	}
	
}
export default ErrorLabel
