import * as React from "react";
import "./Button.scss"

type Props = {
	className?: string
	id?: string
}


class Button extends React.Component<Props> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { className, children, id } = this.props


		return <div {...{id}} className={className ? `${className} btn` : "btn"}>{children}</div>
	}

}
export default Button
