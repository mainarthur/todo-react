import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import Login from './login/Login';
import Register from './register/Register';
import Router from './routing/Router';
import Route from './routing/Route';
import routes from './routing/config';
import NotFound from './common/NotFound';
import rootReducer from './redux/reducers';

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

ReactDOM.render(
  <Router routes={routes} NotFound={NotFound}>
    <h1 className="title">TO-DO LIST</h1>
    <Route path={routes.home.path}>
      <Provider store={store}>
        <App />
      </Provider>
    </Route>
    <Route path={routes.login.path}>
      <Provider store={store}>
        <Login />
      </Provider>
    </Route>
    <Route path={routes.register.path}>
      <Provider store={store}>
        <Register />
      </Provider>
    </Route>
  </Router>,
  document.querySelector('.root'),
);
