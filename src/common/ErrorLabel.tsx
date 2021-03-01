import * as React from "react";

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
		return <label className={}>{this.props.children}</label>
	}
	
}
export default ErrorLabel
