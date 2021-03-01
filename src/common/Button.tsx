import * as React from "react";
import "./Button.scss"

type Props = {
	className?: string
	id?: string
}

type State = {

}

class Button extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { className, children, ...rest } = this.props


		return <div {...rest} className={className ? `${className} btn` : "btn"}>{children}</div>
	}

}
export default Button
