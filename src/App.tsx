import * as React from "react";

type AppProps = {

}

type AppState = {

}

class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps | Readonly<AppProps>) {
		super(props)
	}

	render(): JSX.Element {
		return <div>MainPage!</div>
	}
	
}
export default App