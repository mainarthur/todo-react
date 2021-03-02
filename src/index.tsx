import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import Login from './login/Login';
import Register from './register/Register';
import Router from './routing/Router';
import Route from './routing/Route';
import { routes } from './routing/config';
import NotFound from './common/NotFound';

ReactDOM.render(
  <Router routes={routes} NotFound={NotFound}>
    <h1 className="title">TO-DO LIST</h1>
    <Route path={routes.home.path}>
      <App />
    </Route>
    <Route path={routes.login.path}>
      <Login />
    </Route>
    <Route path={routes.register.path}>
      <Register />
    </Route>

  </Router>,
  document.querySelector('.root'),
);
