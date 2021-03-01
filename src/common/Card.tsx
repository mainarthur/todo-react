import * as React from "react";
import "./Card.scss"

type Props = {
	id?: string
}

type State = {

}

class Card extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { children, ...rest } = this.props
		
		return <div className="card" {...rest}>{children}</div>
	}

}
export default Card
