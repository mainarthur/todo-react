import * as React from "react";
import "./TextField.scss"

type Props = {
	className?: string
	type?: string
	id: string
	placeholder: string
	onChange?(ev: React.ChangeEvent<HTMLInputElement>): void
	value?: string
}

type State = {
	animation: string
	value: string
}

class TextField extends React.Component<Props, State> {
	#prevValue:string = ""

	constructor(props: Props | Readonly<Props>) {
		super(props)
		this.state = {
			animation: "",
			value: ""
		}
	}

	render(): JSX.Element {
		const { id, type, placeholder, className, onChange, value } = this.props
		let { animation } = this.state

		if(value === "" && this.#prevValue !== "" && animation === "_maximizing") {
			animation = "_minimizing"
		}

		this.#prevValue = value

		return <div className={className ? `textfield ${className}` : "textfield"}>
			<div className="textfield__floating">
				<input className="textfield__input" onFocus={(e) => this.setState({ animation: "_maximizing" })} onBlur={(e) => { e.target.value === "" ? this.setState({ animation: "_minimizing" }) : null}} {...{ onChange, id, type, value, placeholder }} />
				<label htmlFor={id}>{placeholder}</label>
				<div className="textfield__border"><div className={"textfield__border_animated" + (animation  ? ` textfield__border${animation}` : "")}></div></div>
			</div>
		</div>
	}

}
export default TextField
