import * as React from "react";

type Props = {
	to: string
}


class Redirect extends React.Component<Props> {
	constructor(props: Props | Readonly<Props>) {
		super(props)
	}

	render(): JSX.Element {
		location.href = this.props.to


		return <></>
	}
	
}
export default Redirect
