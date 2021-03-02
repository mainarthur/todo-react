import * as React from "react"
import "./Button.scss"

type Props = {
	className?: string
	id?: string
	onClick?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void
}


class Button extends React.Component<Props> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { className, children, id, onClick } = this.props


		return <div {...{id, onClick}} className={className ? `${className} btn` : "btn"}>{children}</div>
	}

}
export default Button
