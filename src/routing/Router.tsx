import * as React from 'react';
import { Update } from 'history';
import { history, RouterContext, locationToRoute } from './RouterContext';

type Props = {
  routes: {
    [key: string]: {
      path: string
    }
  },
  NotFound: typeof React.Component
};

type State = {
  route: {
    path: string
    hash: string
    query: object
  }
};

class Router extends React.Component<Props, State> {
  routes: string[];

  unlisten: () => void;

  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.routes = Object.keys(props.routes).map((key) => props.routes[key].path);
    this.unlisten = history.listen(this.handleRouteChange);
    this.state = {
      route: locationToRoute(history.location),
    };
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleRouteChange = (update: Update<object>) => {
    const route = locationToRoute(update.location);
    this.setState({ route });
  };

  render() {
    const { children, NotFound } = this.props;
    const { route } = this.state;
    const routerContextValue = { route };
    const is404 = this.routes.indexOf(route.path) === -1;
    return (
      <RouterContext.Provider value={routerContextValue}>
        {is404 ? <NotFound /> : children}
      </RouterContext.Provider>
    );
  }
}

export default Router;
