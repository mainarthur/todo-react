import * as React from "react"
import "./Card.scss"

type Props = {
	id?: string
}

class Card extends React.Component<Props> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		const { children, id} = this.props
		
		return <div className="card" {...{id}}>{children}</div>
	}

}
export default Card
